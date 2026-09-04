package com.hiero.ecom.core.db;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component(service = DatabaseRepository.class, immediate = true)
public class DatabaseRepositoryImpl implements DatabaseRepository {
    private static final Logger LOGGER = LoggerFactory.getLogger(DatabaseRepositoryImpl.class);

    @Reference
    private DatabaseService databaseService;

    @Override
    public QueryResult executeQuery(String sql) throws SQLException {
        return executeQuery(sql, (Object[]) null);
    }

    @Override
    public QueryResult executeQuery(String sql, Object... params) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = databaseService.getConnection();
            stmt = conn.prepareStatement(sql);

            if (params != null && params.length > 0) {
                for (int i = 0; i < params.length; i++) {
                    stmt.setObject(i + 1, params[i]);
                }
            }

            rs = stmt.executeQuery();
            List<Map<String, Object>> rows = new ArrayList<>();

            while (rs.next()) {
                Map<String, Object> row = extractRow(rs);
                rows.add(row);
            }

            String correlationId = MDC.get("correlationId");
            LOGGER.info("Query executed successfully, {} rows returned [{}]", rows.size(), correlationId);

            return new QueryResult.Builder()
                    .withRows(rows)
                    .success()
                    .build();
        } catch (SQLException e) {
            String correlationId = MDC.get("correlationId");
            LOGGER.error("Query execution failed [{}]", correlationId, e);
            return new QueryResult.Builder()
                    .failure("Query execution failed: " + e.getMessage())
                    .build();
        } finally {
            closeResources(rs, stmt, conn);
        }
    }

    @Override
    public QueryResult executeUpdate(String sql) throws SQLException {
        return executeUpdate(sql, (Object[]) null);
    }

    @Override
    public QueryResult executeUpdate(String sql, Object... params) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = databaseService.getConnection();
            stmt = conn.prepareStatement(sql);

            if (params != null && params.length > 0) {
                for (int i = 0; i < params.length; i++) {
                    stmt.setObject(i + 1, params[i]);
                }
            }

            int rowsAffected = stmt.executeUpdate();
            String correlationId = MDC.get("correlationId");
            LOGGER.info("Update executed successfully, {} rows affected [{}]", rowsAffected, correlationId);

            return new QueryResult.Builder()
                    .withRowCount(rowsAffected)
                    .success()
                    .build();
        } catch (SQLException e) {
            String correlationId = MDC.get("correlationId");
            LOGGER.error("Update execution failed [{}]", correlationId, e);
            return new QueryResult.Builder()
                    .failure("Update execution failed: " + e.getMessage())
                    .build();
        } finally {
            closeResources(null, stmt, conn);
        }
    }

    @Override
    public boolean validateQuery(String sql) throws SQLException {
        QueryResult result = executeQuery(sql);
        return result.isSuccess();
    }

    private Map<String, Object> extractRow(ResultSet rs) throws SQLException {
        Map<String, Object> row = new HashMap<>();
        ResultSetMetaData metadata = rs.getMetaData();
        int columnCount = metadata.getColumnCount();

        for (int i = 1; i <= columnCount; i++) {
            String columnName = metadata.getColumnName(i);
            Object value = rs.getObject(i);
            row.put(columnName, value);
        }

        return row;
    }

    private void closeResources(ResultSet rs, PreparedStatement stmt, Connection conn) {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                LOGGER.debug("Error closing ResultSet", e);
            }
        }
        if (stmt != null) {
            try {
                stmt.close();
            } catch (SQLException e) {
                LOGGER.debug("Error closing PreparedStatement", e);
            }
        }
        if (conn != null) {
            databaseService.closeConnection(conn);
        }
    }
}
