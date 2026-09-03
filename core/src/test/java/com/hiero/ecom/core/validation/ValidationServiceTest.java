package com.hiero.ecom.core.validation;

import com.hiero.ecom.core.api.ApiError;
import org.junit.jupiter.api.Test;

import javax.validation.constraints.NotBlank;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ValidationServiceTest {

    @Test
    public void testValidObject() {
        ValidationService service = new ValidationServiceImpl();
        TestObject validObject = new TestObject("test");
        assertTrue(service.isValid(validObject));
        assertTrue(service.validate(validObject).isEmpty());
    }

    @Test
    public void testInvalidObjectWithNull() {
        ValidationService service = new ValidationServiceImpl();
        List<ApiError.ValidationError> errors = service.validate(null);
        assertFalse(errors.isEmpty());
        assertEquals("object", errors.get(0).getField());
    }

    @Test
    public void testValidationException() {
        ValidationService service = new ValidationServiceImpl();
        TestObject invalidObject = new TestObject(null);
        String correlationId = "test-corr-id";

        assertThrows(ValidationService.ValidationException.class, () -> {
            service.validateAndThrow(invalidObject, correlationId);
        });
    }

    public static class TestObject {
        @NotBlank(message = "Name is required")
        private String name;

        public TestObject(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }
}
