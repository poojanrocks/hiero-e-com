package com.hiero.ecom.core.db;

import java.sql.SQLException;

public interface DatabaseRepository {

    QueryResult executeQuery(String sql) throws SQLException;

    QueryResult executeQuery(String sql, Object... params) throws SQLException;

    QueryResult executeUpdate(String sql) throws SQLException;

    QueryResult executeUpdate(String sql, Object... params) throws SQLException;

    boolean validateQuery(String sql) throws SQLException;
}
