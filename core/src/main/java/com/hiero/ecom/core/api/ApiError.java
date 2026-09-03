package com.hiero.ecom.core.api;

import java.io.Serializable;

public class ApiError implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String code;
    private String message;
    private String field;
    private Object value;
    
    public ApiError(String code, String message) {
        this.code = code;
        this.message = message;
    }
    
    public ApiError(String code, String message, String field) {
        this(code, message);
        this.field = field;
    }
    
    public ApiError(String code, String message, String field, Object value) {
        this(code, message, field);
        this.value = value;
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
    
    public String getField() {
        return field;
    }
    
    public void setField(String field) {
        this.field = field;
    }
    
    public Object getValue() {
        return value;
    }
    
    public void setValue(Object value) {
        this.value = value;
    }
}
