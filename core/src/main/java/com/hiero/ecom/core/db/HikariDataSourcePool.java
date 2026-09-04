package com.hiero.ecom.core.db;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class HikariDataSourcePool {
    private static final Logger LOG = LoggerFactory.getLogger(HikariDataSourcePool.class);
    private final HikariDataSource dataSource;

    public HikariDataSourcePool(DatabaseConfig config) throws Exception {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(config.jdbcUrl());
        hikariConfig.setUsername(config.dbUsername());
        hikariConfig.setPassword(config.dbPassword());
        hikariConfig.setMaximumPoolSize(config.getMaxPoolSize());
        hikariConfig.setMinimumIdle(config.getMinIdleConnections());
        hikariConfig.setConnectionTimeout(config.getConnectionTimeoutSeconds() * 1000L);
        hikariConfig.setIdleTimeout(config.getIdleTimeoutSeconds() * 1000L);
        hikariConfig.setConnectionTestQuery(config.getValidationQuery());
        hikariConfig.setPoolName("HieroEcomPool");
        hikariConfig.setLeakDetectionThreshold(120000);

        try {
            this.dataSource = new HikariDataSource(hikariConfig);
            LOG.info("HikariCP DataSource pool initialized: maxPoolSize={}, minIdleConnections={}",
                config.getMaxPoolSize(), config.getMinIdleConnections());
        } catch (Exception e) {
            LOG.error("Failed to initialize HikariCP DataSource", e);
            throw e;
        }
    }

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    public DataSource getDataSource() {
        return dataSource;
    }

    public void close() throws SQLException {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
            LOG.info("HikariCP DataSource pool closed");
        }
    }
}
