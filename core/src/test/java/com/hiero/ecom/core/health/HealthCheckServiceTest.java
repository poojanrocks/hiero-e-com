/*
 * Copyright 2024 Hiero E-Commerce. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
package com.hiero.ecom.core.health;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.hiero.ecom.core.db.DatabaseService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class HealthCheckServiceTest {
    private HealthCheckService healthCheckService;

    @Mock
    private DatabaseService databaseService;

    @Mock
    private ResourceResolver resourceResolver;

    @BeforeEach
    void setUp() {
        healthCheckService = new HealthCheckService();
        healthCheckService.databaseService = databaseService;
    }

    @Test
    void testHealthCheckSuccess() {
        when(databaseService.isConnected()).thenReturn(true);

        HealthStatus health = healthCheckService.checkHealth(resourceResolver, "test-correlation-id");

        assertNotNull(health);
        assertEquals("UP", health.getStatus());
        assertEquals("test-correlation-id", health.getCorrelationId());
        assertNotNull(health.getDatabase());
        assertEquals("UP", health.getDatabase().getStatus());
        assertNotNull(health.getApplication());
        assertEquals("UP", health.getApplication().getStatus());
        assertTrue(health.getResponseTime() >= 0);
    }

    @Test
    void testHealthCheckDatabaseDown() {
        when(databaseService.isConnected()).thenReturn(false);

        HealthStatus health = healthCheckService.checkHealth(resourceResolver, "test-correlation-id");

        assertNotNull(health);
        assertEquals("DOWN", health.getStatus());
        assertNotNull(health.getDatabase());
        assertEquals("DOWN", health.getDatabase().getStatus());
        assertNotNull(health.getDatabase().getLastError());
    }

    @Test
    void testHealthCheckDatabaseUnavailable() {
        healthCheckService.databaseService = null;

        HealthStatus health = healthCheckService.checkHealth(resourceResolver, "test-correlation-id");

        assertNotNull(health);
        assertEquals("DEGRADED", health.getStatus());
        assertNotNull(health.getDatabase());
        assertEquals("UNAVAILABLE", health.getDatabase().getStatus());
    }

    @Test
    void testHealthCheckException() {
        when(databaseService.isConnected()).thenThrow(new RuntimeException("Database error"));

        HealthStatus health = healthCheckService.checkHealth(resourceResolver, "test-correlation-id");

        assertNotNull(health);
        assertEquals("DOWN", health.getStatus());
        assertEquals("test-correlation-id", health.getCorrelationId());
    }

    @Test
    void testHealthCheckResponseTime() {
        when(databaseService.isConnected()).thenReturn(true);

        long startTime = System.currentTimeMillis();
        HealthStatus health = healthCheckService.checkHealth(resourceResolver, "test-correlation-id");
        long endTime = System.currentTimeMillis();

        assertTrue(health.getResponseTime() >= 0);
        assertTrue(health.getResponseTime() <= (endTime - startTime + 10));
    }

    @Test
    void testHealthStatusSerializable() {
        HealthStatus health = new HealthStatus("UP", "test-id");
        health.setDatabase(new HealthStatus.DatabaseHealth("UP", 5));
        health.setApplication(new HealthStatus.ApplicationHealth("UP", 1000));

        assertNotNull(health.getStatus());
        assertEquals("test-id", health.getCorrelationId());
        assertEquals(5, health.getDatabase().getResponseTime());
        assertEquals(1000, health.getApplication().getUptime());
    }
}
