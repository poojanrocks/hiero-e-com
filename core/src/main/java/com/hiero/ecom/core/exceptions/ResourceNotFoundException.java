package com.hiero.ecom.core.exceptions;

import org.apache.http.HttpStatus;

/**
 * Exception for not found errors (HTTP 404).
 */
public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException(String message) {
        super(message, HttpStatus.SC_NOT_FOUND, "RESOURCE_NOT_FOUND");
    }

    public ResourceNotFoundException(String resource, String id) {
        super(resource + " with id " + id + " not found", HttpStatus.SC_NOT_FOUND, "RESOURCE_NOT_FOUND");
    }
}
