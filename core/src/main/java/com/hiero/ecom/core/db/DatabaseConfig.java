package com.hiero.ecom.core.db;

import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.ConfigurationPolicy;
import org.apache.felix.scr.annotations.Deactivate;
import org.apache.felix.scr.annotations.Property;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@Component(
    label = "Hiero eCommerce Database Configuration",
    description = "Database connection pooling and configuration",
    policy = ConfigurationPolicy.REQUIRE,
    metatype = true
)
public class DatabaseConfig {
    
    private static final Logger LOG = LoggerFactory.getLogger(DatabaseConfig.class);
    
    @Property(
        label = "Database URL",
        description = "JDBC database URL",
        value = "jdbc:mysql://localhost:3306/hiero_ecom"
    )
    private String databaseUrl;
    
    @Property(
        label = "Database User",
        description = "Database username",
        value = "root"
    )
    private String databaseUser;
    
    @Property(
        label = "Database Password",
        description = "Database password",
        value = ""
    )
    private String databasePassword;
    
    @Property(
        label = "Max Pool Size",
        description = "Maximum number of connections in the pool",
        intValue = 20
    )
    private int maxPoolSize;
    
    @Property(
        label = "Min Pool Size",
        description = "Minimum number of connections in the pool",
        intValue = 5
    )
    private int minPoolSize;
    
    @Property(
        label = "Connection Timeout",
        description = "Connection timeout in milliseconds",
        longValue = 30000
    )
    private long connectionTimeout;
    
    @Property(
        label = "Idle Timeout",
        description = "Idle timeout in milliseconds",
        longValue = 600000
    )
    private long idleTimeout;
    
    @Property(
        label = "Max Lifetime",
        description = "Maximum lifetime of connection in milliseconds",
        longValue = 1800000
    )
    private long maxLifetime;
    
    @Activate
    protected void activate(Map<String, Object> properties) {
        this.databaseUrl = getString(properties, "databaseUrl", "jdbc:mysql://localhost:3306/hiero_ecom");
        this.databaseUser = getString(properties, "databaseUser", "root");
        this.databasePassword = getString(properties, "databasePassword", "");
        this.maxPoolSize = getInt(properties, "maxPoolSize", 20);
        this.minPoolSize = getInt(properties, "minPoolSize", 5);
        this.connectionTimeout = getLong(properties, "connectionTimeout", 30000L);
        this.idleTimeout = getLong(properties, "idleTimeout", 600000L);
        this.maxLifetime = getLong(properties, "maxLifetime", 1800000L);
        LOG.info("DatabaseConfig activated with URL: {}", databaseUrl);
    }
    
    @Deactivate
    protected void deactivate() {
        LOG.info("DatabaseConfig deactivated");
    }
    
    private String getString(Map<String, Object> properties, String key, String defaultValue) {
        Object value = properties.get(key);
        return value instanceof String ? (String) value : defaultValue;
    }
    
    private int getInt(Map<String, Object> properties, String key, int defaultValue) {
        Object value = properties.get(key);
        if (value instanceof Integer) {
            return (Integer) value;
        }
        return defaultValue;
    }
    
    private long getLong(Map<String, Object> properties, String key, long defaultValue) {
        Object value = properties.get(key);
        if (value instanceof Long) {
            return (Long) value;
        }
        if (value instanceof Integer) {
            return ((Integer) value).longValue();
        }
        return defaultValue;
    }
    
    public String getDatabaseUrl() {
        return databaseUrl;
    }
    
    public String getDatabaseUser() {
        return databaseUser;
    }
    
    public String getDatabasePassword() {
        return databasePassword;
    }
    
    public int getMaxPoolSize() {
        return maxPoolSize;
    }
    
    public int getMinPoolSize() {
        return minPoolSize;
    }
    
    public long getConnectionTimeout() {
        return connectionTimeout;
    }
    
    public long getIdleTimeout() {
        return idleTimeout;
    }
    
    public long getMaxLifetime() {
        return maxLifetime;
    }
}
