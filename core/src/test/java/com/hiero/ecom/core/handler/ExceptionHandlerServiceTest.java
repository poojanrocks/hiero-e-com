package com.hiero.ecom.core.handler;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hiero.ecom.core.api.ApiResponse;
import com.hiero.ecom.core.exceptions.ConflictException;
import com.hiero.ecom.core.exceptions.DependencyFailureException;
import com.hiero.ecom.core.exceptions.ResourceNotFoundException;
import com.hiero.ecom.core.exceptions.ValidationException;
import org.apache.http.HttpStatus;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ExceptionHandlerServiceTest {

    private ExceptionHandlerService service;
    private SlingHttpServletRequest mockRequest;
    private SlingHttpServletResponse mockResponse;

    @BeforeEach
    void setUp() {
        service = new ExceptionHandlerService();
        mockRequest = mock(SlingHttpServletRequest.class);
        mockResponse = mock(SlingHttpServletResponse.class);
    }

    @Test
    void testGetOrCreateCorrelationId_FromHeader() {
        String expectedId = "test-correlation-id-123";
        when(mockRequest.getHeader("X-Correlation-ID")).thenReturn(expectedId);

        String correlationId = service.getOrCreateCorrelationId(mockRequest);

        assertEquals(expectedId, correlationId);
    }

    @Test
    void testGetOrCreateCorrelationId_GeneratesUUID() {
        when(mockRequest.getHeader("X-Correlation-ID")).thenReturn(null);
        when(mockRequest.getAttribute("correlationId")).thenReturn(null);

        String correlationId = service.getOrCreateCorrelationId(mockRequest);

        assertNotNull(correlationId);
        assertFalse(correlationId.isEmpty());
    }

    @Test
    void testHandleValidationException() {
        ValidationException exception = new ValidationException("Email is required");
        exception.addFieldError("email", "Field cannot be empty");
        when(mockRequest.getHeader("X-Correlation-ID")).thenReturn(null);
        when(mockRequest.getAttribute("correlationId")).thenReturn(null);

        ApiResponse<?> response = service.handleException(exception, mockRequest, mockResponse);

        assertFalse(response.isSuccess());
        assertEquals("VALIDATION_ERROR", response.getCode());
        assertEquals("Email is required", response.getMessage());
        assertNotNull(response.getErrors());
        assertEquals(1, response.getErrors().size());
        assertEquals("email", response.getErrors().get(0).getField());
        verify(mockResponse).setStatus(HttpStatus.SC_BAD_REQUEST);
    }

    @Test
    void testHandleResourceNotFoundException() {
        ResourceNotFoundException exception = new ResourceNotFoundException("Product", "123");
        when(mockRequest.getHeader("X-Correlation-ID")).thenReturn("test-id");

        ApiResponse<?> response = service.handleException(exception, mockRequest, mockResponse);

        assertFalse(response.isSuccess());
        assertEquals("RESOURCE_NOT_FOUND", response.getCode());
        assertEquals("test-id", response.getCorrelationId());
        verify(mockResponse).setStatus(HttpStatus.SC_NOT_FOUND);
    }

    @Test
    void testHandleConflictException() {
        ConflictException exception = new ConflictException("Resource already exists");
        when(mockRequest.getHeader("X-Correlation-ID")).thenReturn("test-id");

        ApiResponse<?> response = service.handleException(exception, mockRequest, mockResponse);

        assertFalse(response.isSuccess());
        assertEquals("CONFLICT", response.getCode());
        verify(mockResponse).setStatus(HttpStatus.SC_CONFLICT);
    }

    @Test
    void testHandleDependencyFailureException() {
        DependencyFailureException exception = new DependencyFailureException("Database connection failed");
        when(mockRequest.getHeader("X-Correlation-ID")).thenReturn("test-id");

        ApiResponse<?> response = service.handleException(exception, mockRequest, mockResponse);

        assertFalse(response.isSuccess());
        assertEquals("DEPENDENCY_FAILURE", response.getCode());
        verify(mockResponse).setStatus(HttpStatus.SC_SERVICE_UNAVAILABLE);
    }

    @Test
    void testHandleGenericException() {
        Exception exception = new RuntimeException("Unexpected error");
        when(mockRequest.getHeader("X-Correlation-ID")).thenReturn("test-id");

        ApiResponse<?> response = service.handleException(exception, mockRequest, mockResponse);

        assertFalse(response.isSuccess());
        assertEquals("SERVER_ERROR", response.getCode());
        assertTrue(response.getMessage().contains("correlation ID"));
        assertFalse(response.getMessage().contains("Unexpected error"));
        verify(mockResponse).setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);
    }

    @Test
    void testCorrelationIdInResponse() {
        ValidationException exception = new ValidationException("Invalid input");
        String expectedId = "unique-request-id-456";
        when(mockRequest.getHeader("X-Correlation-ID")).thenReturn(expectedId);

        ApiResponse<?> response = service.handleException(exception, mockRequest, mockResponse);

        assertEquals(expectedId, response.getCorrelationId());
    }
}
