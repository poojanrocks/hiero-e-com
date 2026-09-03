package com.hiero.ecom.core.api;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class ApiResponse<T> implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private int status;
    private String message;
    private T data;
    private List<ApiError> errors;
    private String requestId;
    private long timestamp;
    
    public ApiResponse(int status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.errors = new ArrayList<>();
        this.timestamp = System.currentTimeMillis();
    }
    
    public ApiResponse(int status, String message) {
        this(status, message, null);
    }
    
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "Success", data);
    }
    
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(200, message, data);
    }
    
    public static <T> ApiResponse<T> notFound() {
        return new ApiResponse<>(404, "Resource not found");
    }
    
    public static <T> ApiResponse<T> error(int status, String message) {
        return new ApiResponse<>(status, message);
    }
    
    public void addError(ApiError error) {
        this.errors.add(error);
    }
    
    public int getStatus() {
        return status;
    }
    
    public void setStatus(int status) {
        this.status = status;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
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
    
    public String getRequestId() {
        return requestId;
    }
    
    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }
    
    public long getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
