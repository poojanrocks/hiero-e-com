package com.hiero.ecom.core.validation;

import org.junit.Before;
import org.junit.Test;
import java.util.List;
import static org.junit.Assert.*;

public class ValidationServiceTest {
    
    private ValidationService validationService;
    
    @Before
    public void setUp() {
        validationService = new ValidationService();
    }
    
    @Test
    public void testIsEmailValid() {
        assertTrue(validationService.isEmail("test@example.com"));
        assertTrue(validationService.isEmail("user.name+tag@example.co.uk"));
        assertFalse(validationService.isEmail("invalid-email"));
        assertFalse(validationService.isEmail(null));
        assertFalse(validationService.isEmail(""));
    }
    
    @Test
    public void testIsPhoneNumber() {
        assertTrue(validationService.isPhoneNumber("+1234567890"));
        assertTrue(validationService.isPhoneNumber("14155552368"));
        assertFalse(validationService.isPhoneNumber("123"));
        assertFalse(validationService.isPhoneNumber(null));
        assertFalse(validationService.isPhoneNumber(""));
    }
    
    @Test
    public void testIsNotEmpty() {
        assertTrue(validationService.isNotEmpty("value"));
        assertFalse(validationService.isNotEmpty(""));
        assertFalse(validationService.isNotEmpty("   "));
        assertFalse(validationService.isNotEmpty(null));
    }
    
    @Test
    public void testIsPositiveNumber() {
        assertTrue(validationService.isPositiveNumber(5));
        assertTrue(validationService.isPositiveNumber(5.5));
        assertFalse(validationService.isPositiveNumber(0));
        assertFalse(validationService.isPositiveNumber(-5));
        assertFalse(validationService.isPositiveNumber(null));
    }
    
    @Test
    public void testIsValidLength() {
        assertTrue(validationService.isValidLength("hello", 1, 10));
        assertTrue(validationService.isValidLength("hello", 5, 10));
        assertFalse(validationService.isValidLength("hello", 6, 10));
        assertFalse(validationService.isValidLength("hello", 1, 4));
        assertFalse(validationService.isValidLength(null, 1, 10));
    }
    
    @Test
    public void testValidateRequired() {
        List<String> errors = validationService.validateRequired("value1", "value2", "");
        assertEquals(1, errors.size());
        
        errors = validationService.validateRequired(null, "", "  ");
        assertEquals(3, errors.size());
    }
}
