package com.hiero.ecom.core.validation;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Component(
    label = "Hiero eCommerce Validation Service",
    description = "Provides validation utilities for API requests and data"
)
@Service(ValidationService.class)
public class ValidationService {
    
    private static final Logger LOG = LoggerFactory.getLogger(ValidationService.class);
    
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern PHONE_PATTERN = 
        Pattern.compile("^\\+?[1-9]\\d{1,14}$");
    
    public boolean isEmail(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }
    
    public boolean isPhoneNumber(String phone) {
        if (phone == null || phone.isEmpty()) {
            return false;
        }
        return PHONE_PATTERN.matcher(phone).matches();
    }
    
    public boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }
    
    public boolean isPositiveNumber(Number number) {
        if (number == null) {
            return false;
        }
        return number.doubleValue() > 0;
    }
    
    public List<String> validateRequired(String... values) {
        List<String> errors = new ArrayList<>();
        for (int i = 0; i < values.length; i++) {
            if (!isNotEmpty(values[i])) {
                errors.add("Field at index " + i + " is required");
            }
        }
        return errors;
    }
    
    public boolean isValidLength(String value, int minLength, int maxLength) {
        if (value == null) {
            return false;
        }
        int length = value.length();
        return length >= minLength && length <= maxLength;
    }
}
