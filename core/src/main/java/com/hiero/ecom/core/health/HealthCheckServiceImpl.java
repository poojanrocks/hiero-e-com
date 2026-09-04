package com.hiero.ecom.core.health;

import com.hiero.ecom.core.db.DatabaseService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Component(service = HealthCheckService.class)
public class HealthCheckServiceImpl implements HealthCheckService {
    private static final Logger LOG = LoggerFactory.getLogger(HealthCheckServiceImpl.class);

    @Reference
    private DatabaseService databaseService;

    @Override
    public HealthStatus getSystemHealth() {
        return new HealthStatusImpl(checkAllDependencies());
    }

    @Override
    public Map<String, DependencyStatus> getDependencyStatuses() {
        return checkAllDependencies();
    }

    private Map<String, DependencyStatus> checkAllDependencies() {
        Map<String, DependencyStatus> statuses = new LinkedHashMap<>();
        statuses.put("database", checkDatabase());
        return statuses;
    }

    private DependencyStatus checkDatabase() {
        long startTime = System.currentTimeMillis();
        boolean available = databaseService != null && databaseService.isHealthy();
        long responseTime = System.currentTimeMillis() - startTime;
        return new DependencyStatusImpl("Database", available, responseTime);
    }

    private static class HealthStatusImpl implements HealthStatus {
        private final Map<String, DependencyStatus> dependencies;

        HealthStatusImpl(Map<String, DependencyStatus> dependencies) {
            this.dependencies = dependencies;
        }

        @Override
        public boolean isHealthy() {
            return dependencies.values().stream().allMatch(DependencyStatus::isAvailable);
        }

        @Override
        public int getHttpStatus() {
            return isHealthy() ? 200 : 503;
        }

        @Override
        public Map<String, Object> toMap() {
            Map<String, Object> result = new HashMap<>();
            result.put("healthy", isHealthy());
            Map<String, Map<String, Object>> depMap = new HashMap<>();
            dependencies.forEach((name, status) -> {
                Map<String, Object> statusMap = new HashMap<>();
                statusMap.put("status", status.getStatus());
                statusMap.put("responseTime", status.getResponseTimeMs());
                depMap.put(name, statusMap);
            });
            result.put("dependencies", depMap);
            return result;
        }
    }

    private static class DependencyStatusImpl implements DependencyStatus {
        private final String name;
        private final boolean available;
        private final long responseTimeMs;

        DependencyStatusImpl(String name, boolean available, long responseTimeMs) {
            this.name = name;
            this.available = available;
            this.responseTimeMs = responseTimeMs;
        }

        @Override
        public String getName() {
            return name;
        }

        @Override
        public boolean isAvailable() {
            return available;
        }

        @Override
        public String getStatus() {
            return available ? "UP" : "DOWN";
        }

        @Override
        public long getResponseTimeMs() {
            return responseTimeMs;
        }
    }
}
