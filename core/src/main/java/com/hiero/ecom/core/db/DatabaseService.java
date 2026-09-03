package com.hiero.ecom.core.db;

import org.osgi.annotation.versioning.ProviderType;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@ProviderType
public interface DatabaseService {

    Connection getConnection() throws SQLException;

    DataSource getDataSource();

    boolean isHealthy();

    void close() throws SQLException;
}
