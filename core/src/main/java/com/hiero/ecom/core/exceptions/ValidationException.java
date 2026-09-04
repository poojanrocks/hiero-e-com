package com.hiero.ecom.core.exceptions;

import org.apache.http.HttpStatus;

/**
 * Exception for validation errors (HTTP 400).
 */
public class ValidationException extends ApiException {

    public ValidationException(String message) {
        super(message, HttpStatus.SC_BAD_REQUEST, "VALIDATION_ERROR");
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause, HttpStatus.SC_BAD_REQUEST, "VALIDATION_ERROR");
    }
}
