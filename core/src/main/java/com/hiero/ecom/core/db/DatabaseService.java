package com.hiero.ecom.core.db;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Component(service = DatabaseService.class, immediate = true)
public class DatabaseService {
    private static final Logger LOGGER = LoggerFactory.getLogger(DatabaseService.class);

    @Reference
    private DataSource dataSource;

    public Connection getConnection() throws SQLException {
        try {
            Connection conn = dataSource.getConnection();
            String correlationId = MDC.get("correlationId");
            if (correlationId != null) {
                LOGGER.debug("Connection acquired [{}]", correlationId);
            }
            return conn;
        } catch (SQLException e) {
            String correlationId = MDC.get("correlationId");
            LOGGER.error("Failed to acquire database connection [{}]", correlationId, e);
            throw new SQLException("Database connection failed", e);
        }
    }

    public void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
                String correlationId = MDC.get("correlationId");
                if (correlationId != null) {
                    LOGGER.debug("Connection closed [{}]", correlationId);
                }
            } catch (SQLException e) {
                String correlationId = MDC.get("correlationId");
                LOGGER.warn("Error closing connection [{}]", correlationId, e);
            }
        }
    }

    public DataSource getDataSource() {
        return dataSource;
    }

    public boolean validateConnection() {
        try (Connection conn = getConnection()) {
            return !conn.isClosed();
        } catch (SQLException e) {
            LOGGER.error("Connection validation failed", e);
            return false;
        }
    }
}
