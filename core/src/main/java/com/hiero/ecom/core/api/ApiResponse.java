package com.hiero.ecom.core.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.List;

/**
 * Standard API response wrapper with correlation ID and error tracking.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String code;
    private String message;
    private String timestamp;
    private String correlationId;
    private T data;
    private List<ApiError> errors;

    public ApiResponse() {
        this.timestamp = Instant.now().toString();
    }

    public static <T> ApiResponse<T> success(T data, String correlationId) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = true;
        response.code = "SUCCESS";
        response.message = "Request processed successfully";
        response.data = data;
        response.correlationId = correlationId;
        return response;
    }

    public static <T> ApiResponse<T> error(String code, String message, int httpStatus, String correlationId) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.code = code;
        response.message = message;
        response.correlationId = correlationId;
        return response;
    }

    public static <T> ApiResponse<T> error(String code, String message, List<ApiError> errors, String correlationId) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.code = code;
        response.message = message;
        response.errors = errors;
        response.correlationId = correlationId;
        return response;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public void setCorrelationId(String correlationId) {
        this.correlationId = correlationId;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public List<ApiError> getErrors() {
        return errors;
    }

    public void setErrors(List<ApiError> errors) {
        this.errors = errors;
    }
}
