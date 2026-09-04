package com.hiero.ecom.core.validation;

import com.hiero.ecom.core.api.ApiError;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component(service = ValidationService.class)
public class ValidationServiceImpl implements ValidationService {
    private static final Logger LOG = LoggerFactory.getLogger(ValidationServiceImpl.class);

    private final Validator validator = javax.validation.Validation.buildDefaultValidatorFactory().getValidator();

    @Override
    public List<ApiError.ValidationError> validate(Object object) {
        List<ApiError.ValidationError> errors = new ArrayList<>();
        if (object == null) {
            errors.add(new ApiError.ValidationError("object", "Object cannot be null", null));
            return errors;
        }

        Set<ConstraintViolation<Object>> violations = validator.validate(object);
        for (ConstraintViolation<Object> violation : violations) {
            errors.add(new ApiError.ValidationError(
                violation.getPropertyPath().toString(),
                violation.getMessage(),
                violation.getInvalidValue()
            ));
        }
        return errors;
    }

    @Override
    public boolean isValid(Object object) {
        return validate(object).isEmpty();
    }

    @Override
    public void validateAndThrow(Object object, String correlationId) throws ValidationService.ValidationException {
        List<ApiError.ValidationError> errors = validate(object);
        if (!errors.isEmpty()) {
            LOG.warn("Validation failed: {} errors [correlationId={}]", errors.size(), correlationId);
            throw new ValidationService.ValidationException(errors, correlationId);
        }
    }
}
