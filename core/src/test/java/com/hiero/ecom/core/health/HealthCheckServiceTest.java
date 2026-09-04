package com.hiero.ecom.core.health;

import com.hiero.ecom.core.db.DatabaseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class HealthCheckServiceTest {
    @Mock
    private DatabaseService databaseService;

    private HealthCheckService healthCheckService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        healthCheckService = new HealthCheckServiceImpl();
        ((HealthCheckServiceImpl) healthCheckService).databaseService = databaseService;
    }

    @Test
    public void testSystemHealthyWhenDatabaseIsHealthy() {
        when(databaseService.isHealthy()).thenReturn(true);
        HealthCheckService.HealthStatus status = healthCheckService.getSystemHealth();

        assertTrue(status.isHealthy());
        assertEquals(200, status.getHttpStatus());
    }

    @Test
    public void testSystemUnhealthyWhenDatabaseIsUnhealthy() {
        when(databaseService.isHealthy()).thenReturn(false);
        HealthCheckService.HealthStatus status = healthCheckService.getSystemHealth();

        assertFalse(status.isHealthy());
        assertEquals(503, status.getHttpStatus());
    }

    @Test
    public void testDependencyStatusesIncludesDatabase() {
        when(databaseService.isHealthy()).thenReturn(true);
        var statuses = healthCheckService.getDependencyStatuses();

        assertTrue(statuses.containsKey("database"));
        HealthCheckService.DependencyStatus dbStatus = statuses.get("database");
        assertTrue(dbStatus.isAvailable());
        assertEquals("UP", dbStatus.getStatus());
    }

    @Test
    public void testHealthStatusToMap() {
        when(databaseService.isHealthy()).thenReturn(true);
        HealthCheckService.HealthStatus status = healthCheckService.getSystemHealth();
        var statusMap = status.toMap();

        assertTrue((boolean) statusMap.get("healthy"));
        assertNotNull(statusMap.get("dependencies"));
    }
}
