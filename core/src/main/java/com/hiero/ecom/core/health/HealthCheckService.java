/*
 * Copyright 2024 Hiero E-Commerce. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
package com.hiero.ecom.core.health;

import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hiero.ecom.core.db.DatabaseService;

/**
 * Service to check application and dependency health status.
 */
@Component(service = HealthCheckService.class, immediate = true)
public class HealthCheckService {
    private static final Logger log = LoggerFactory.getLogger(HealthCheckService.class);
    private static final String STATUS_UP = "UP";
    private static final String STATUS_DOWN = "DOWN";
    private static final String STATUS_DEGRADED = "DEGRADED";
    private static final String STATUS_UNAVAILABLE = "UNAVAILABLE";

    @Reference
    private DatabaseService databaseService;

    /**
     * Check overall application health.
     */
    public HealthStatus checkHealth(ResourceResolver resolver, String correlationId) {
        long startTime = System.currentTimeMillis();
        HealthStatus health = new HealthStatus(STATUS_UP, correlationId);

        try {
            // Check database health
            HealthStatus.DatabaseHealth dbHealth = checkDatabaseHealth();
            health.setDatabase(dbHealth);

            // Check application health
            HealthStatus.ApplicationHealth appHealth = checkApplicationHealth();
            health.setApplication(appHealth);

            // Determine overall status
            if (dbHealth != null && STATUS_DOWN.equals(dbHealth.getStatus())) {
                health.setStatus(STATUS_DOWN);
                log.warn("Health check: database unavailable [correlationId={}]", correlationId);
            } else if (dbHealth != null && "UNAVAILABLE".equals(dbHealth.getStatus())) {
                health.setStatus(STATUS_DEGRADED);
                log.warn("Health check: database service unavailable [correlationId={}]", correlationId);
            } else if (STATUS_DOWN.equals(appHealth.getStatus())) {
                health.setStatus(STATUS_DOWN);
                log.error("Health check: application down [correlationId={}]", correlationId);
            }

        } catch (Exception e) {
            health.setStatus(STATUS_DOWN);
            log.error("Health check failed [correlationId={}]", correlationId, e);
        }

        long responseTime = System.currentTimeMillis() - startTime;
        health.setResponseTime(responseTime);
        log.info("Health check completed [status={}, responseTime={}ms, correlationId={}]",
                health.getStatus(), responseTime, correlationId);

        return health;
    }

    /**
     * Check database connectivity and response time.
     */
    private HealthStatus.DatabaseHealth checkDatabaseHealth() {
        long startTime = System.currentTimeMillis();
        HealthStatus.DatabaseHealth health = new HealthStatus.DatabaseHealth();

        try {
            if (databaseService == null) {
                health.setStatus(STATUS_UNAVAILABLE);
                health.setLastError("DatabaseService not available");
                return health;
            }

            boolean isConnected = databaseService.isConnected();
            long responseTime = System.currentTimeMillis() - startTime;
            health.setResponseTime(responseTime);

            if (isConnected) {
                health.setStatus(STATUS_UP);
            } else {
                health.setStatus(STATUS_DOWN);
                health.setLastError("Connection test failed");
            }
        } catch (Exception e) {
            long responseTime = System.currentTimeMillis() - startTime;
            health.setResponseTime(responseTime);
            health.setStatus(STATUS_DOWN);
            health.setLastError(e.getClass().getSimpleName());
        }

        return health;
    }

    /**
     * Check application health (basic checks).
     */
    private HealthStatus.ApplicationHealth checkApplicationHealth() {
        HealthStatus.ApplicationHealth health = new HealthStatus.ApplicationHealth();
        try {
            health.setStatus(STATUS_UP);
            health.setUptime(getApplicationUptime());
        } catch (Exception e) {
            health.setStatus(STATUS_DOWN);
            log.error("Application health check failed", e);
        }
        return health;
    }

    private long getApplicationUptime() {
        return System.currentTimeMillis();
    }
}
