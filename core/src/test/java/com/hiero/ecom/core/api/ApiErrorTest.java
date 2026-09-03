package com.hiero.ecom.core.api;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ApiErrorTest {

    @Test
    public void testBadRequestError() {
        String correlationId = "test-corr-id";
        ApiError error = ApiError.badRequest("Invalid input", correlationId);

        assertEquals(400, error.getStatus());
        assertEquals("BAD_REQUEST", error.getError());
        assertEquals("Invalid input", error.getMessage());
        assertEquals(correlationId, error.getCorrelationId());
        assertTrue(error.getValidationErrors().isEmpty());
    }

    @Test
    public void testNotFoundError() {
        String correlationId = "test-corr-id";
        ApiError error = ApiError.notFound("Resource not found", correlationId);

        assertEquals(404, error.getStatus());
        assertEquals("NOT_FOUND", error.getError());
    }

    @Test
    public void testValidationError() {
        String correlationId = "test-corr-id";
        List<ApiError.ValidationError> validationErrors = Arrays.asList(
            new ApiError.ValidationError("email", "Invalid email format", "test@"),
            new ApiError.ValidationError("age", "Must be at least 18", 15)
        );
        ApiError error = ApiError.unprocessableEntity("Validation failed", validationErrors, correlationId);

        assertEquals(422, error.getStatus());
        assertEquals("VALIDATION_ERROR", error.getError());
        assertEquals(2, error.getValidationErrors().size());
        assertEquals("email", error.getValidationErrors().get(0).getField());
    }

    @Test
    public void testInternalServerError() {
        String correlationId = "test-corr-id";
        ApiError error = ApiError.internalServerError("Database connection failed", correlationId);

        assertEquals(500, error.getStatus());
        assertEquals("INTERNAL_SERVER_ERROR", error.getError());
        assertEquals("An unexpected error occurred", error.getMessage());
    }

    @Test
    public void testServiceUnavailableError() {
        String correlationId = "test-corr-id";
        ApiError error = ApiError.serviceUnavailable("Database unavailable", correlationId);

        assertEquals(503, error.getStatus());
        assertEquals("SERVICE_UNAVAILABLE", error.getError());
    }
}
