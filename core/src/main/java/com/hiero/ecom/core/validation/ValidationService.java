package com.hiero.ecom.core.validation;

import com.hiero.ecom.core.api.ApiError;
import org.osgi.annotation.versioning.ProviderType;

import java.util.List;

@ProviderType
public interface ValidationService {

    List<ApiError.ValidationError> validate(Object object);

    boolean isValid(Object object);

    void validateAndThrow(Object object, String correlationId) throws ValidationException;

    class ValidationException extends Exception {
        private final List<ApiError.ValidationError> errors;
        private final String correlationId;

        public ValidationException(List<ApiError.ValidationError> errors, String correlationId) {
            super("Validation failed for " + errors.size() + " field(s)");
            this.errors = errors;
            this.correlationId = correlationId;
        }

        public List<ApiError.ValidationError> getErrors() {
            return errors;
        }

        public String getCorrelationId() {
            return correlationId;
        }
    }
}
