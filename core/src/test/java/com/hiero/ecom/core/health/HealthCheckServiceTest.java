package com.hiero.ecom.core.health;

import org.junit.Before;
import org.junit.Test;
import java.util.Map;
import static org.junit.Assert.*;

public class HealthCheckServiceTest {
    
    private HealthCheckService healthCheckService;
    
    @Before
    public void setUp() {
        healthCheckService = new HealthCheckService();
    }
    
    @Test
    public void testGetHealthStatus() {
        Map<String, Object> health = healthCheckService.getHealthStatus();
        
        assertNotNull(health);
        assertTrue(health.containsKey("status"));
        assertTrue(health.containsKey("timestamp"));
        assertTrue(health.containsKey("components"));
        assertNotNull(health.get("components"));
    }
    
    @Test
    public void testIsHealthy() {
        boolean healthy = healthCheckService.isHealthy();
        assertNotNull(healthy);
    }
}
