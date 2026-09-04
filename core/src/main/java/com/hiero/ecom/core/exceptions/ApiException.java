package com.hiero.ecom.core.exceptions;

import java.util.HashMap;
import java.util.Map;

/**
 * Base exception for API errors with HTTP status code and error code.
 */
public abstract class ApiException extends RuntimeException {

    private final int httpStatus;
    private final String errorCode;
    private final Map<String, String> fieldErrors;

    public ApiException(String message, int httpStatus, String errorCode) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.fieldErrors = new HashMap<>();
    }

    public ApiException(String message, Throwable cause, int httpStatus, String errorCode) {
        super(message, cause);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.fieldErrors = new HashMap<>();
    }

    public int getHttpStatus() {
        return httpStatus;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }

    public void addFieldError(String field, String message) {
        this.fieldErrors.put(field, message);
    }
}
