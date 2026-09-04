/*
 * Copyright 2024 Hiero E-Commerce. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
package com.hiero.ecom.core.health;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.hiero.ecom.core.correlation.CorrelationIdProvider;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.PrintWriter;
import java.io.StringWriter;

@ExtendWith(MockitoExtension.class)
public class HealthServletTest {
    private HealthServlet servlet;

    @Mock
    private HealthCheckService healthCheckService;

    @Mock
    private CorrelationIdProvider correlationIdProvider;

    @Mock
    private SlingHttpServletRequest request;

    @Mock
    private SlingHttpServletResponse response;

    @Mock
    private ResourceResolver resourceResolver;

    private StringWriter stringWriter;

    @BeforeEach
    void setUp() {
        servlet = new HealthServlet();
        servlet.healthCheckService = healthCheckService;
        servlet.correlationIdProvider = correlationIdProvider;

        stringWriter = new StringWriter();
        try {
            when(response.getWriter()).thenReturn(new PrintWriter(stringWriter));
        } catch (Exception e) {
            fail("Failed to setup mock response");
        }
        when(request.getResourceResolver()).thenReturn(resourceResolver);
    }

    @Test
    void testHealthEndpointSuccess() throws Exception {
        HealthStatus health = new HealthStatus("UP", "test-correlation-id");
        health.setDatabase(new HealthStatus.DatabaseHealth("UP", 5));
        health.setApplication(new HealthStatus.ApplicationHealth("UP", 1000));
        health.setResponseTime(10);

        when(correlationIdProvider.getCorrelationId(request)).thenReturn("test-correlation-id");
        when(healthCheckService.checkHealth(resourceResolver, "test-correlation-id")).thenReturn(health);

        servlet.doGet(request, response);

        verify(response).setStatus(200);
        verify(response).setContentType("application/json;charset=UTF-8");
        String output = stringWriter.toString();
        assertTrue(output.contains("UP"));
        assertTrue(output.contains("test-correlation-id"));
    }

    @Test
    void testHealthEndpointDown() throws Exception {
        HealthStatus health = new HealthStatus("DOWN", "test-correlation-id");
        health.setDatabase(new HealthStatus.DatabaseHealth("DOWN", 5));
        health.setApplication(new HealthStatus.ApplicationHealth("UP", 1000));
        health.setResponseTime(10);

        when(correlationIdProvider.getCorrelationId(request)).thenReturn("test-correlation-id");
        when(healthCheckService.checkHealth(resourceResolver, "test-correlation-id")).thenReturn(health);

        servlet.doGet(request, response);

        verify(response).setStatus(503);
        String output = stringWriter.toString();
        assertTrue(output.contains("DOWN"));
    }

    @Test
    void testHealthEndpointException() throws Exception {
        when(correlationIdProvider.getCorrelationId(request)).thenReturn("test-correlation-id");
        when(healthCheckService.checkHealth(any(), any())).thenThrow(new RuntimeException("Service error"));

        servlet.doGet(request, response);

        verify(response).setStatus(500);
        String output = stringWriter.toString();
        assertTrue(output.contains("error"));
    }

    @Test
    void testHealthEndpointIncludesCorrelationId() throws Exception {
        HealthStatus health = new HealthStatus("UP", "unique-correlation-123");
        health.setResponseTime(5);

        when(correlationIdProvider.getCorrelationId(request)).thenReturn("unique-correlation-123");
        when(healthCheckService.checkHealth(resourceResolver, "unique-correlation-123")).thenReturn(health);

        servlet.doGet(request, response);

        String output = stringWriter.toString();
        assertTrue(output.contains("unique-correlation-123"));
    }
}
