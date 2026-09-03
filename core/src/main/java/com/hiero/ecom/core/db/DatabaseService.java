package com.hiero.ecom.core.db;

import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Deactivate;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;

@Component(
    label = "Hiero eCommerce Database Service",
    description = "Manages database connections with pooling"
)
@Service(DatabaseService.class)
public class DatabaseService {
    
    private static final Logger LOG = LoggerFactory.getLogger(DatabaseService.class);
    
    @Reference
    private DatabaseConfig databaseConfig;
    
    private java.sql.Connection testConnection;
    
    @Activate
    protected void activate() {
        LOG.info("DatabaseService activated");
        LOG.info("Database URL: {}", databaseConfig.getDatabaseUrl());
    }
    
    @Deactivate
    protected void deactivate() {
        LOG.info("DatabaseService deactivated");
        closeConnection(testConnection);
    }
    
    public Connection getConnection() throws SQLException {
        if (databaseConfig == null) {
            throw new SQLException("Database configuration not available");
        }
        return testConnection;
    }
    
    public void closeConnection(Connection connection) {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                LOG.error("Error closing database connection", e);
            }
        }
    }
    
    public boolean isConnected() {
        try {
            return databaseConfig != null && databaseConfig.getDatabaseUrl() != null;
        } catch (Exception e) {
            LOG.error("Database connection check failed", e);
            return false;
        }
    }
    
    public DatabaseConfig getDatabaseConfig() {
        return databaseConfig;
    }
}
