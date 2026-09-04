package com.hiero.ecom.core.api;

import org.osgi.annotation.versioning.ProviderType;

@ProviderType
public class ApiResponse<T> {
    private final int status;
    private final String message;
    private final T data;
    private final String correlationId;
    private final long timestamp;

    public ApiResponse(int status, String message, T data, String correlationId) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.correlationId = correlationId;
        this.timestamp = System.currentTimeMillis();
    }

    public static <T> ApiResponse<T> success(T data, String correlationId) {
        return new ApiResponse<>(200, "Success", data, correlationId);
    }

    public static <T> ApiResponse<T> created(T data, String correlationId) {
        return new ApiResponse<>(201, "Created", data, correlationId);
    }

    public static <T> ApiResponse<T> noContent(String correlationId) {
        return new ApiResponse<>(204, "No Content", null, correlationId);
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public long getTimestamp() {
        return timestamp;
    }
}
