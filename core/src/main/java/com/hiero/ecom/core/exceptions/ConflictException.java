package com.hiero.ecom.core.exceptions;

import org.apache.http.HttpStatus;

/**
 * Exception for conflict errors (HTTP 409).
 */
public class ConflictException extends ApiException {

    public ConflictException(String message) {
        super(message, HttpStatus.SC_CONFLICT, "CONFLICT");
    }

    public ConflictException(String message, Throwable cause) {
        super(message, cause, HttpStatus.SC_CONFLICT, "CONFLICT");
    }
}
