package com.hiero.ecom.core.api;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Field-level error details in API responses.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {

    private String field;
    private String message;
    private String code;

    public ApiError() {
    }

    public ApiError(String field, String message) {
        this.field = field;
        this.message = message;
    }

    public ApiError(String field, String message, String code) {
        this.field = field;
        this.message = message;
        this.code = code;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
