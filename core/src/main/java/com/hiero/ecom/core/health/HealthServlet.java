/*
 * Copyright 2024 Hiero E-Commerce. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
package com.hiero.ecom.core.health;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiero.ecom.core.correlation.CorrelationIdProvider;

import javax.servlet.Servlet;
import java.io.IOException;

/**
 * Health endpoint servlet at /api/health.
 */
@Component(
    service = Servlet.class,
    property = {
        "sling.servlet.paths=/api/health",
        "sling.servlet.methods=GET"
    }
)
public class HealthServlet extends SlingSafeMethodsServlet {
    private static final long serialVersionUID = 1L;
    private static final Logger log = LoggerFactory.getLogger(HealthServlet.class);
    private static final String CONTENT_TYPE_JSON = "application/json;charset=UTF-8";

    @Reference
    private HealthCheckService healthCheckService;

    @Reference
    private CorrelationIdProvider correlationIdProvider;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
            throws IOException {
        String correlationId = correlationIdProvider.getCorrelationId(request);
        long startTime = System.currentTimeMillis();

        try {
            response.setContentType(CONTENT_TYPE_JSON);

            HealthStatus health = healthCheckService.checkHealth(
                request.getResourceResolver(),
                correlationId
            );

            String jsonResponse = objectMapper.writeValueAsString(health);
            int httpStatus = "UP".equals(health.getStatus()) ? 200 : 503;
            response.setStatus(httpStatus);
            response.getWriter().write(jsonResponse);

            long responseTime = System.currentTimeMillis() - startTime;
            log.info("Health endpoint [status={}, httpStatus={}, responseTime={}ms, correlationId={}]",
                    health.getStatus(), httpStatus, responseTime, correlationId);

        } catch (Exception e) {
            long responseTime = System.currentTimeMillis() - startTime;
            response.setStatus(500);
            log.error("Health endpoint error [responseTime={}ms, correlationId={}]",
                    responseTime, correlationId, e);
            response.getWriter().write("{\"error\":\"Internal Server Error\"}");
        }
    }
}
