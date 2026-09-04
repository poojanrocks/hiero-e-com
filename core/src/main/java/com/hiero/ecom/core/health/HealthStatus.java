/*
 * Copyright 2024 Hiero E-Commerce. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
package com.hiero.ecom.core.health;

import java.io.Serializable;
import java.time.Instant;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * HealthStatus DTO for API responses.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HealthStatus implements Serializable {
    private static final long serialVersionUID = 1L;

    private String status; // "UP", "DOWN", "DEGRADED"
    private long timestamp; // milliseconds since epoch
    private long responseTime; // milliseconds
    private DatabaseHealth database;
    private ApplicationHealth application;
    private String correlationId;

    public HealthStatus() {
    }

    public HealthStatus(String status, String correlationId) {
        this.status = status;
        this.timestamp = System.currentTimeMillis();
        this.correlationId = correlationId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public long getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(long responseTime) {
        this.responseTime = responseTime;
    }

    public DatabaseHealth getDatabase() {
        return database;
    }

    public void setDatabase(DatabaseHealth database) {
        this.database = database;
    }

    public ApplicationHealth getApplication() {
        return application;
    }

    public void setApplication(ApplicationHealth application) {
        this.application = application;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public void setCorrelationId(String correlationId) {
        this.correlationId = correlationId;
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class DatabaseHealth {
        private String status; // "UP", "DOWN", "UNAVAILABLE"
        private long responseTime;
        private String lastError;

        public DatabaseHealth() {
        }

        public DatabaseHealth(String status, long responseTime) {
            this.status = status;
            this.responseTime = responseTime;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public long getResponseTime() {
            return responseTime;
        }

        public void setResponseTime(long responseTime) {
            this.responseTime = responseTime;
        }

        public String getLastError() {
            return lastError;
        }

        public void setLastError(String lastError) {
            this.lastError = lastError;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ApplicationHealth {
        private String status; // "UP", "DOWN"
        private long uptime;
        private String version;

        public ApplicationHealth() {
        }

        public ApplicationHealth(String status, long uptime) {
            this.status = status;
            this.uptime = uptime;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public long getUptime() {
            return uptime;
        }

        public void setUptime(long uptime) {
            this.uptime = uptime;
        }

        public String getVersion() {
            return version;
        }

        public void setVersion(String version) {
            this.version = version;
        }
    }
}
