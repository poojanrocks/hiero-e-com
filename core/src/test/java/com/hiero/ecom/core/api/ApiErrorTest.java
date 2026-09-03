package com.hiero.ecom.core.api;

import org.junit.Test;
import static org.junit.Assert.*;

public class ApiErrorTest {
    
    @Test
    public void testApiErrorCreation() {
        ApiError error = new ApiError("ERR_001", "Test error message");
        
        assertEquals("ERR_001", error.getCode());
        assertEquals("Test error message", error.getMessage());
        assertNull(error.getField());
    }
    
    @Test
    public void testApiErrorWithField() {
        ApiError error = new ApiError("ERR_002", "Invalid field", "email");
        
        assertEquals("ERR_002", error.getCode());
        assertEquals("Invalid field", error.getMessage());
        assertEquals("email", error.getField());
    }
    
    @Test
    public void testApiErrorWithValue() {
        ApiError error = new ApiError("ERR_003", "Invalid value", "age", -5);
        
        assertEquals("ERR_003", error.getCode());
        assertEquals("Invalid value", error.getMessage());
        assertEquals("age", error.getField());
        assertEquals(-5, error.getValue());
    }
}
