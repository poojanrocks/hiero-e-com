package com.hiero.ecom.core.api;

import org.junit.Test;
import static org.junit.Assert.*;

public class ApiResponseTest {
    
    @Test
    public void testSuccessResponse() {
        String data = "test data";
        ApiResponse<String> response = ApiResponse.success(data);
        
        assertEquals(200, response.getStatus());
        assertEquals("Success", response.getMessage());
        assertEquals(data, response.getData());
        assertNotNull(response.getTimestamp());
    }
    
    @Test
    public void testErrorResponse() {
        ApiResponse<?> response = ApiResponse.error(500, "Internal Server Error");
        
        assertEquals(500, response.getStatus());
        assertEquals("Internal Server Error", response.getMessage());
    }
    
    @Test
    public void testNotFoundResponse() {
        ApiResponse<?> response = ApiResponse.notFound();
        
        assertEquals(404, response.getStatus());
        assertEquals("Resource not found", response.getMessage());
    }
    
    @Test
    public void testAddError() {
        ApiResponse<String> response = new ApiResponse<>(400, "Bad Request");
        ApiError error = new ApiError("INVALID_INPUT", "Field is required", "name");
        response.addError(error);
        
        assertEquals(1, response.getErrors().size());
        assertEquals("INVALID_INPUT", response.getErrors().get(0).getCode());
    }
}
