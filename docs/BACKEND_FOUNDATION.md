# Backend Foundation and API Layer

This document describes the common AEM backend services and API conventions used across catalog, search, PDP, and cart features.

## Architecture Overview

The backend foundation provides:

1. **Common Response/Error Model** - Standardized API responses and error handling
2. **Database Access Layer** - Pooled database connections with HikariCP
3. **Validation Framework** - JSR-303 Bean Validation integration
4. **Request Correlation** - Request tracking without exposing sensitive data
5. **Structured Logging** - Consistent logging with correlation IDs
6. **Health Checks** - System and dependency monitoring

## API Response Format

### Success Response

```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "id": "123",
    "name": "Product Name"
  },
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": 1693476800000
}
```

### Error Response

```json
{
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Invalid request parameters",
  "validationErrors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "rejectedValue": "invalid-email"
    }
  ],
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": 1693476800000
}
```

## Database Configuration

Database connections are managed through OSGi configuration at:
`/apps/hiero-ecom/osgiconfig/config/com.hiero.ecom.core.db.DatabaseConfig~hiero-ecom.cfg.json`

### Configurable Parameters

- `jdbcUrl` - Database connection URL
- `dbUsername` - Database user
- `dbPassword` - Database password (encrypted in config)
- `getMaxPoolSize` - Maximum connections (default: 10)
- `getMinIdleConnections` - Minimum idle connections (default: 2)
- `getConnectionTimeoutSeconds` - Connection timeout (default: 30s)
- `getIdleTimeoutSeconds` - Idle connection timeout (default: 600s)
- `getValidationQuery` - Connection validation query (default: `SELECT 1`)

## Request Correlation

All requests are tracked with a correlation ID that can be passed via the `X-Correlation-ID` header. If not provided, a UUID is generated automatically.

### Usage Example

```bash
curl -X GET http://localhost:4502/api/products \
  -H "X-Correlation-ID: 550e8400-e29b-41d4-a716-446655440000"
```

The correlation ID is:
- Injected into the MDC (Mapped Diagnostic Context) for logging
- Included in all responses
- Used for request tracking without exposing internal details

## Validation

Validation is performed using JSR-303 Bean Validation annotations:

```java
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    @Min(value = 0, message = "Price must be positive")
    private BigDecimal price;
}
```

## Health Checks

The health check endpoint provides system status:

```bash
GET /api/health
```

Response:

```json
{
  "healthy": true,
  "dependencies": {
    "database": {
      "status": "UP",
      "responseTime": 2
    }
  }
}
```

HTTP Status Codes:
- 200 - System is healthy
- 503 - System is unhealthy (at least one dependency down)

## Logging

Logging includes:

- Request method, URI, and query string
- Response status code and request duration
- Error messages with correlation ID (without stack traces in client responses)
- All log entries include the correlation ID via MDC

### Log Format

The log output includes correlation ID for tracing:

```
2024-01-15 10:30:45.123 [CorrelationId:550e8400-e29b-41d4-a716-446655440000] INFO  Incoming request [GET] /api/products
2024-01-15 10:30:45.256 [CorrelationId:550e8400-e29b-41d4-a716-446655440000] INFO  Request completed [GET] /api/products - Status: 200 - Duration: 133ms
```

## Error Handling

Standard error codes:

- **400 BAD_REQUEST** - Invalid parameters or malformed request
- **401 UNAUTHORIZED** - Missing or invalid authentication
- **403 FORBIDDEN** - User lacks required permissions
- **404 NOT_FOUND** - Resource not found
- **409 CONFLICT** - Resource already exists or state conflict
- **422 VALIDATION_ERROR** - Request validation failed
- **500 INTERNAL_SERVER_ERROR** - Server error (message sanitized)
- **503 SERVICE_UNAVAILABLE** - Critical dependency unavailable

Internal error details are NOT exposed in responses to prevent information disclosure.

## Usage in Features

Each feature (catalog, search, PDP, cart) should:

1. Extend the common response/error models if needed
2. Use the DatabaseService for all database access
3. Use the ValidationService for request validation
4. Rely on RequestCorrelationFilter and LoggingFilter automatically
5. Return standardized ApiResponse or ApiError objects

## Testing

Unit tests are provided for all core components:

- ApiResponseTest - Success, created, and no-content responses
- ApiErrorTest - Standard error codes and validation errors
- ValidationServiceTest - Valid/invalid objects and null handling
- HealthCheckServiceTest - Healthy and unhealthy system states

Mock implementations are available for testing integration with these services.
