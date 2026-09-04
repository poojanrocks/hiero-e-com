package com.hiero.ecom.core.api;

import org.osgi.annotation.versioning.ProviderType;
import java.util.Collections;
import java.util.List;

@ProviderType
public class ApiError {
    private final int status;
    private final String error;
    private final String message;
    private final List<ValidationError> validationErrors;
    private final String correlationId;
    private final long timestamp;

    public ApiError(int status, String error, String message, String correlationId) {
        this(status, error, message, Collections.emptyList(), correlationId);
    }

    public ApiError(int status, String error, String message, List<ValidationError> validationErrors, String correlationId) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.validationErrors = validationErrors;
        this.correlationId = correlationId;
        this.timestamp = System.currentTimeMillis();
    }

    public static ApiError badRequest(String message, String correlationId) {
        return new ApiError(400, "BAD_REQUEST", message, correlationId);
    }

    public static ApiError unauthorized(String message, String correlationId) {
        return new ApiError(401, "UNAUTHORIZED", message, correlationId);
    }

    public static ApiError forbidden(String message, String correlationId) {
        return new ApiError(403, "FORBIDDEN", message, correlationId);
    }

    public static ApiError notFound(String message, String correlationId) {
        return new ApiError(404, "NOT_FOUND", message, correlationId);
    }

    public static ApiError conflict(String message, String correlationId) {
        return new ApiError(409, "CONFLICT", message, correlationId);
    }

    public static ApiError unprocessableEntity(String message, List<ValidationError> errors, String correlationId) {
        return new ApiError(422, "VALIDATION_ERROR", message, errors, correlationId);
    }

    public static ApiError internalServerError(String message, String correlationId) {
        return new ApiError(500, "INTERNAL_SERVER_ERROR", "An unexpected error occurred", correlationId);
    }

    public static ApiError serviceUnavailable(String message, String correlationId) {
        return new ApiError(503, "SERVICE_UNAVAILABLE", message, correlationId);
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public List<ValidationError> getValidationErrors() {
        return validationErrors;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public static class ValidationError {
        private final String field;
        private final String message;
        private final Object rejectedValue;

        public ValidationError(String field, String message, Object rejectedValue) {
            this.field = field;
            this.message = message;
            this.rejectedValue = rejectedValue;
        }

        public String getField() {
            return field;
        }

        public String getMessage() {
            return message;
        }

        public Object getRejectedValue() {
            return rejectedValue;
        }
    }
}
