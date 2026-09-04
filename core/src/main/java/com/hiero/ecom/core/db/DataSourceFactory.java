package com.hiero.ecom.core.db;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;

@Component(service = DataSource.class, property = {Constants.SERVICE_RANKING + ":Integer=10"})
@Designate(ocd = DatabaseConfig.class, factory = true)
public class DataSourceFactory implements DataSource {
    private static final Logger LOGGER = LoggerFactory.getLogger(DataSourceFactory.class);

    private HikariDataSource hikariDataSource;
    private DatabaseConfig config;

    @Activate
    protected void activate(DatabaseConfig config) {
        this.config = config;
        try {
            HikariConfig hikariConfig = new HikariConfig();
            hikariConfig.setJdbcUrl(config.db_url());
            hikariConfig.setUsername(config.db_username());
            hikariConfig.setPassword(config.db_password());
            hikariConfig.setMaximumPoolSize(config.pool_max_size());
            hikariConfig.setMinimumIdle(config.pool_min_idle());
            hikariConfig.setConnectionTimeout(config.connection_timeout());
            hikariConfig.setIdleTimeout(config.idle_timeout());
            hikariConfig.setMaxLifetime(config.max_lifetime());

            if (config.validation_enabled()) {
                hikariConfig.setConnectionTestQuery(config.validation_query());
            }

            hikariDataSource = new HikariDataSource(hikariConfig);
            LOGGER.info("DataSource initialized with pool size: {}, minIdle: {}",
                    config.pool_max_size(), config.pool_min_idle());
        } catch (Exception e) {
            LOGGER.error("Failed to initialize datasource", e);
            throw new RuntimeException("DataSource initialization failed", e);
        }
    }

    @Deactivate
    protected void deactivate() {
        if (hikariDataSource != null && !hikariDataSource.isClosed()) {
            hikariDataSource.close();
            LOGGER.info("DataSource closed");
        }
    }

    @Override
    public java.sql.Connection getConnection() {
        if (hikariDataSource == null) {
            throw new IllegalStateException("DataSource not initialized");
        }
        return hikariDataSource.getConnection();
    }

    @Override
    public java.sql.Connection getConnection(String username, String password) {
        if (hikariDataSource == null) {
            throw new IllegalStateException("DataSource not initialized");
        }
        return hikariDataSource.getConnection(username, password);
    }

    @Override
    public java.io.PrintWriter getLogWriter() {
        return hikariDataSource != null ? hikariDataSource.getLogWriter() : null;
    }

    @Override
    public void setLogWriter(java.io.PrintWriter out) {
        if (hikariDataSource != null) {
            hikariDataSource.setLogWriter(out);
        }
    }

    @Override
    public void setLoginTimeout(int seconds) {
        if (hikariDataSource != null) {
            hikariDataSource.setLoginTimeout(seconds);
        }
    }

    @Override
    public int getLoginTimeout() {
        return hikariDataSource != null ? hikariDataSource.getLoginTimeout() : 0;
    }

    @Override
    public java.util.logging.Logger getParentLogger() {
        return hikariDataSource != null ? hikariDataSource.getParentLogger() : null;
    }

    @Override
    public <T> T unwrap(Class<T> iface) {
        if (hikariDataSource != null && iface.isInstance(hikariDataSource)) {
            return iface.cast(hikariDataSource);
        }
        throw new RuntimeException("DataSource does not implement " + iface.getName());
    }

    @Override
    public boolean isWrapperFor(Class<?> iface) {
        return hikariDataSource != null && iface.isInstance(hikariDataSource);
    }
}
