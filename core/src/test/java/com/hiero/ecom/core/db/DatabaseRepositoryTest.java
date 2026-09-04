package com.hiero.ecom.core.db;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.MDC;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyObject;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DatabaseRepositoryTest {

    private DatabaseRepositoryImpl repository;

    @Mock
    private DatabaseService databaseService;

    @BeforeEach
    void setUp() {
        MDC.put("correlationId", "test-correlation-123");
        repository = new DatabaseRepositoryImpl();
        repository.databaseService = databaseService;
    }

    @Test
    void testExecuteQuerySuccess() throws SQLException {
        String sql = "SELECT * FROM products";
        Connection conn = mock(Connection.class);
        PreparedStatement stmt = mock(PreparedStatement.class);
        ResultSet rs = mock(ResultSet.class);
        ResultSetMetaData metadata = mock(ResultSetMetaData.class);

        when(databaseService.getConnection()).thenReturn(conn);
        when(conn.prepareStatement(sql)).thenReturn(stmt);
        when(stmt.executeQuery()).thenReturn(rs);
        when(rs.getMetaData()).thenReturn(metadata);
        when(metadata.getColumnCount()).thenReturn(2);
        when(metadata.getColumnName(1)).thenReturn("id");
        when(metadata.getColumnName(2)).thenReturn("name");
        when(rs.next()).thenReturn(true).thenReturn(false);
        when(rs.getObject(1)).thenReturn(1L);
        when(rs.getObject(2)).thenReturn("Test Product");

        QueryResult result = repository.executeQuery(sql);

        assertTrue(result.isSuccess());
        assertEquals(1, result.getRowCount());
        assertFalse(result.isEmpty());
        assertEquals(1L, result.getRows().get(0).get("id"));
        assertEquals("Test Product", result.getRows().get(0).get("name"));
    }

    @Test
    void testExecuteQueryEmpty() throws SQLException {
        String sql = "SELECT * FROM products WHERE id = ?";
        Connection conn = mock(Connection.class);
        PreparedStatement stmt = mock(PreparedStatement.class);
        ResultSet rs = mock(ResultSet.class);

        when(databaseService.getConnection()).thenReturn(conn);
        when(conn.prepareStatement(sql)).thenReturn(stmt);
        when(stmt.executeQuery()).thenReturn(rs);
        when(rs.next()).thenReturn(false);

        QueryResult result = repository.executeQuery(sql, 999L);

        assertTrue(result.isSuccess());
        assertEquals(0, result.getRowCount());
        assertTrue(result.isEmpty());
    }

    @Test
    void testExecuteQueryWithParameterization() throws SQLException {
        String sql = "SELECT * FROM products WHERE id = ? AND category = ?";
        Connection conn = mock(Connection.class);
        PreparedStatement stmt = mock(PreparedStatement.class);
        ResultSet rs = mock(ResultSet.class);
        ResultSetMetaData metadata = mock(ResultSetMetaData.class);

        when(databaseService.getConnection()).thenReturn(conn);
        when(conn.prepareStatement(sql)).thenReturn(stmt);
        when(stmt.executeQuery()).thenReturn(rs);
        when(rs.getMetaData()).thenReturn(metadata);
        when(metadata.getColumnCount()).thenReturn(1);
        when(metadata.getColumnName(1)).thenReturn("id");
        when(rs.next()).thenReturn(true).thenReturn(false);
        when(rs.getObject(1)).thenReturn(1L);

        QueryResult result = repository.executeQuery(sql, 1L, "electronics");

        assertTrue(result.isSuccess());
        assertEquals(1, result.getRowCount());
    }

    @Test
    void testExecuteQueryConnectionFailure() throws SQLException {
        String sql = "SELECT * FROM products";
        when(databaseService.getConnection()).thenThrow(new SQLException("Connection failed"));

        QueryResult result = repository.executeQuery(sql);

        assertFalse(result.isSuccess());
        assertNotNull(result.getErrorMessage());
        assertTrue(result.getErrorMessage().contains("Query execution failed"));
    }

    @Test
    void testExecuteUpdateSuccess() throws SQLException {
        String sql = "UPDATE products SET name = ? WHERE id = ?";
        Connection conn = mock(Connection.class);
        PreparedStatement stmt = mock(PreparedStatement.class);

        when(databaseService.getConnection()).thenReturn(conn);
        when(conn.prepareStatement(sql)).thenReturn(stmt);
        when(stmt.executeUpdate()).thenReturn(1);

        QueryResult result = repository.executeUpdate(sql, "Updated Name", 1L);

        assertTrue(result.isSuccess());
        assertEquals(1, result.getRowCount());
    }

    @Test
    void testExecuteUpdateNoRowsAffected() throws SQLException {
        String sql = "UPDATE products SET name = ? WHERE id = ?";
        Connection conn = mock(Connection.class);
        PreparedStatement stmt = mock(PreparedStatement.class);

        when(databaseService.getConnection()).thenReturn(conn);
        when(conn.prepareStatement(sql)).thenReturn(stmt);
        when(stmt.executeUpdate()).thenReturn(0);

        QueryResult result = repository.executeUpdate(sql, "Updated Name", 999L);

        assertTrue(result.isSuccess());
        assertEquals(0, result.getRowCount());
    }

    @Test
    void testExecuteUpdateFailure() throws SQLException {
        String sql = "UPDATE products SET name = ? WHERE id = ?";
        when(databaseService.getConnection()).thenThrow(new SQLException("Update failed"));

        QueryResult result = repository.executeUpdate(sql, "Name", 1L);

        assertFalse(result.isSuccess());
        assertNotNull(result.getErrorMessage());
    }

    @Test
    void testValidateQuery() throws SQLException {
        String sql = "SELECT 1";
        Connection conn = mock(Connection.class);
        PreparedStatement stmt = mock(PreparedStatement.class);
        ResultSet rs = mock(ResultSet.class);

        when(databaseService.getConnection()).thenReturn(conn);
        when(conn.prepareStatement(sql)).thenReturn(stmt);
        when(stmt.executeQuery()).thenReturn(rs);
        when(rs.next()).thenReturn(false);

        boolean valid = repository.validateQuery(sql);

        assertTrue(valid);
    }
}
