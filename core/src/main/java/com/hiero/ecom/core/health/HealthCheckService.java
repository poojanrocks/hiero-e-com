package com.hiero.ecom.core.health;

import org.osgi.annotation.versioning.ProviderType;

import java.util.Map;

@ProviderType
public interface HealthCheckService {

    HealthStatus getSystemHealth();

    Map<String, DependencyStatus> getDependencyStatuses();

    interface HealthStatus {
        boolean isHealthy();
        int getHttpStatus();
        Map<String, Object> toMap();
    }

    interface DependencyStatus {
        String getName();
        boolean isAvailable();
        String getStatus();
        long getResponseTimeMs();
    }
}
