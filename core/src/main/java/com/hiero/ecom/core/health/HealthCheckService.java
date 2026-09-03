package com.hiero.ecom.core.health;

import com.hiero.ecom.core.db.DatabaseService;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@Component(
    label = "Hiero eCommerce Health Check Service",
    description = "Provides health checks for critical dependencies"
)
@Service(HealthCheckService.class)
public class HealthCheckService {
    
    private static final Logger LOG = LoggerFactory.getLogger(HealthCheckService.class);
    
    @Reference(optional = true)
    private DatabaseService databaseService;
    
    public Map<String, Object> getHealthStatus() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", System.currentTimeMillis());
        
        Map<String, Object> components = new HashMap<>();
        components.put("database", checkDatabase());
        health.put("components", components);
        
        return health;
    }
    
    private Map<String, Object> checkDatabase() {
        Map<String, Object> dbHealth = new HashMap<>();
        try {
            if (databaseService != null && databaseService.isConnected()) {
                dbHealth.put("status", "UP");
                dbHealth.put("message", "Database connection healthy");
            } else {
                dbHealth.put("status", "DOWN");
                dbHealth.put("message", "Database service not available");
            }
        } catch (Exception e) {
            LOG.error("Database health check failed", e);
            dbHealth.put("status", "DOWN");
            dbHealth.put("message", "Database health check failed: " + e.getMessage());
        }
        return dbHealth;
    }
    
    public boolean isHealthy() {
        try {
            Map<String, Object> health = getHealthStatus();
            return "UP".equals(health.get("status"));
        } catch (Exception e) {
            LOG.error("Health check error", e);
            return false;
        }
    }
}
