package com.hiero.ecom.core.db;

import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Component(service = DatabaseService.class, configurationPid = "com.hiero.ecom.core.db.DatabaseConfig")
public class DatabaseServiceImpl implements DatabaseService {
    private static final Logger LOG = LoggerFactory.getLogger(DatabaseServiceImpl.class);

    private DatabaseConfig config;
    private HikariDataSourcePool dataSourcePool;

    @Activate
    protected void activate(final DatabaseConfig config) {
        this.config = config;
        try {
            this.dataSourcePool = new HikariDataSourcePool(config);
            LOG.info("Database service activated with pool size: {}", config.getMaxPoolSize());
        } catch (Exception e) {
            LOG.error("Failed to initialize database pool", e);
            throw new RuntimeException("Failed to initialize database pool", e);
        }
    }

    @Deactivate
    protected void deactivate() {
        if (dataSourcePool != null) {
            try {
                dataSourcePool.close();
                LOG.info("Database pool closed successfully");
            } catch (SQLException e) {
                LOG.warn("Error closing database pool", e);
            }
        }
    }

    @Override
    public Connection getConnection() throws SQLException {
        if (dataSourcePool == null) {
            throw new SQLException("Database service not initialized");
        }
        return dataSourcePool.getConnection();
    }

    @Override
    public DataSource getDataSource() {
        return dataSourcePool != null ? dataSourcePool.getDataSource() : null;
    }

    @Override
    public boolean isHealthy() {
        try {
            if (dataSourcePool == null) {
                return false;
            }
            try (Connection conn = getConnection()) {
                return conn.isValid(5);
            }
        } catch (SQLException e) {
            LOG.debug("Database health check failed", e);
            return false;
        }
    }

    @Override
    public void close() throws SQLException {
        deactivate();
    }
}
