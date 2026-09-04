package com.hiero.ecom.core.handler;

import com.hiero.ecom.core.api.ApiError;
import com.hiero.ecom.core.api.ApiResponse;
import com.hiero.ecom.core.exceptions.ApiException;
import com.hiero.ecom.core.exceptions.DependencyFailureException;
import com.hiero.ecom.core.exceptions.ValidationException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.apache.http.HttpStatus;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Service to handle exceptions and map to standardized API responses.
 * Logs correlation IDs without exposing stack traces to clients.
 */
@Component(service = ExceptionHandlerService.class, immediate = true)
public class ExceptionHandlerService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ExceptionHandlerService.class);
    private static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    private static final String CORRELATION_ID_ATTRIBUTE = "correlationId";

    /**
     * Get or create correlation ID for the request.
     */
    public String getOrCreateCorrelationId(SlingHttpServletRequest request) {
        String correlationId = request.getHeader(CORRELATION_ID_HEADER);
        if (correlationId == null || correlationId.isEmpty()) {
            Object attr = request.getAttribute(CORRELATION_ID_ATTRIBUTE);
            correlationId = attr != null ? attr.toString() : UUID.randomUUID().toString();
        }
        return correlationId;
    }

    /**
     * Handle API exception and return standardized error response.
     */
    public <T> ApiResponse<T> handleException(Exception exception, SlingHttpServletRequest request,
            SlingHttpServletResponse response) {
        String correlationId = getOrCreateCorrelationId(request);

        if (exception instanceof ApiException) {
            return handleApiException((ApiException) exception, response, correlationId);
        } else {
            return handleGenericException(exception, response, correlationId);
        }
    }

    @SuppressWarnings("unchecked")
    private <T> ApiResponse<T> handleApiException(ApiException exception, SlingHttpServletResponse response,
            String correlationId) {
        response.setStatus(exception.getHttpStatus());
        response.setHeader(CORRELATION_ID_HEADER, correlationId);

        LOGGER.warn("API Exception [{}] [{}]: {}", correlationId, exception.getErrorCode(), exception.getMessage());

        if (exception instanceof ValidationException && !exception.getFieldErrors().isEmpty()) {
            List<ApiError> fieldErrors = new ArrayList<>();
            for (Map.Entry<String, String> error : exception.getFieldErrors().entrySet()) {
                fieldErrors.add(new ApiError(error.getKey(), error.getValue(), "FIELD_ERROR"));
            }
            return (ApiResponse<T>) ApiResponse.error(exception.getErrorCode(), exception.getMessage(), fieldErrors,
                    correlationId);
        } else if (exception instanceof DependencyFailureException) {
            LOGGER.error("Dependency failure [{}]: {}", correlationId, exception.getMessage(), exception);
        }

        return (ApiResponse<T>) ApiResponse.error(exception.getErrorCode(), exception.getMessage(),
                exception.getHttpStatus(), correlationId);
    }

    @SuppressWarnings("unchecked")
    private <T> ApiResponse<T> handleGenericException(Exception exception, SlingHttpServletResponse response,
            String correlationId) {
        response.setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);
        response.setHeader(CORRELATION_ID_HEADER, correlationId);

        LOGGER.error("Unexpected error [{}]", correlationId, exception);

        return (ApiResponse<T>) ApiResponse.error("SERVER_ERROR",
                "An unexpected error occurred. Please contact support with correlation ID: " + correlationId,
                HttpStatus.SC_INTERNAL_SERVER_ERROR, correlationId);
    }
}
