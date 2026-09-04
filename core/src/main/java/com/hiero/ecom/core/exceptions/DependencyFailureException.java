package com.hiero.ecom.core.exceptions;

import org.apache.http.HttpStatus;

/**
 * Exception for dependency failures (HTTP 503).
 */
public class DependencyFailureException extends ApiException {

    public DependencyFailureException(String message) {
        super(message, HttpStatus.SC_SERVICE_UNAVAILABLE, "DEPENDENCY_FAILURE");
    }

    public DependencyFailureException(String message, Throwable cause) {
        super(message, cause, HttpStatus.SC_SERVICE_UNAVAILABLE, "DEPENDENCY_FAILURE");
    }
}
