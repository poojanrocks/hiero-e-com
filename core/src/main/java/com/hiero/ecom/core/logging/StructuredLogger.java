/*
 * Copyright 2024 Hiero E-Commerce. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
package com.hiero.ecom.core.logging;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Structured logging utility for consistent correlation ID logging without PII.
 */
@Component(service = StructuredLogger.class, immediate = true)
@Designate(ocd = StructuredLogger.LogConfig.class)
public class StructuredLogger {
    private static final Logger log = LoggerFactory.getLogger(StructuredLogger.class);

    @ObjectClassDefinition(name = "Structured Logging Configuration")
    public @interface LogConfig {
        String logLevel() default "INFO";

        boolean includeThreadName() default true;

        boolean includeDuration() default true;
    }

    /**
     * Log structured message with correlation ID.
     */
    public void logRequest(String correlationId, String endpoint, String method) {
        log.info("Request [correlationId={}, endpoint={}, method={}]", correlationId, endpoint, method);
    }

    /**
     * Log successful response with timing.
     */
    public void logSuccess(String correlationId, String endpoint, long duration, int statusCode) {
        log.info("Success [correlationId={}, endpoint={}, duration={}ms, statusCode={}]",
                correlationId, endpoint, duration, statusCode);
    }

    /**
     * Log error without exposing sensitive details.
     */
    public void logError(String correlationId, String endpoint, String errorType, long duration) {
        log.warn("Error [correlationId={}, endpoint={}, errorType={}, duration={}ms]",
                correlationId, endpoint, errorType, duration);
    }

    /**
     * Log dependency failure (e.g., database).
     */
    public void logDependencyFailure(String correlationId, String dependency, String reason, long duration) {
        log.error("Dependency failure [correlationId={}, dependency={}, reason={}, duration={}ms]",
                correlationId, dependency, reason, duration);
    }
}
