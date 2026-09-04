/*
 * Copyright 2024 Hiero E-Commerce. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
package com.hiero.ecom.core.correlation;

import org.apache.sling.api.SlingHttpServletRequest;
import org.osgi.service.component.annotations.Component;
import java.util.UUID;

/**
 * Provider for correlation IDs from request headers or generates new ones.
 */
@Component(service = CorrelationIdProvider.class, immediate = true)
public class CorrelationIdProvider {
    private static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    private static final String REQUEST_ATTRIBUTE = "correlationId";

    /**
     * Get or generate correlation ID for request.
     */
    public String getCorrelationId(SlingHttpServletRequest request) {
        String correlationId = (String) request.getAttribute(REQUEST_ATTRIBUTE);
        if (correlationId != null) {
            return correlationId;
        }

        correlationId = request.getHeader(CORRELATION_ID_HEADER);
        if (correlationId == null || correlationId.isEmpty()) {
            correlationId = UUID.randomUUID().toString();
        }

        request.setAttribute(REQUEST_ATTRIBUTE, correlationId);
        return correlationId;
    }
}
