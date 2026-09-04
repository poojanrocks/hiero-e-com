package com.hiero.ecom.core.api;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ApiResponseTest {

    @Test
    public void testSuccessResponse() {
        String correlationId = "test-corr-id";
        String data = "test data";
        ApiResponse<String> response = ApiResponse.success(data, correlationId);

        assertEquals(200, response.getStatus());
        assertEquals("Success", response.getMessage());
        assertEquals(data, response.getData());
        assertEquals(correlationId, response.getCorrelationId());
        assertTrue(response.getTimestamp() > 0);
    }

    @Test
    public void testCreatedResponse() {
        String correlationId = "test-corr-id";
        String data = "created resource";
        ApiResponse<String> response = ApiResponse.created(data, correlationId);

        assertEquals(201, response.getStatus());
        assertEquals("Created", response.getMessage());
        assertEquals(data, response.getData());
    }

    @Test
    public void testNoContentResponse() {
        String correlationId = "test-corr-id";
        ApiResponse<String> response = ApiResponse.noContent(correlationId);

        assertEquals(204, response.getStatus());
        assertEquals("No Content", response.getMessage());
        assertNull(response.getData());
    }

    @Test
    public void testResponseWithNullData() {
        String correlationId = "test-corr-id";
        ApiResponse<String> response = ApiResponse.success(null, correlationId);

        assertEquals(200, response.getStatus());
        assertNull(response.getData());
        assertEquals(correlationId, response.getCorrelationId());
    }
}
