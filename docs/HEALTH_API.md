# Health Endpoint API

## Overview

The health endpoint provides operational visibility into application and database status for support engineers.

## Endpoint

```
GET /api/health
```

## Request

### Headers

- `X-Correlation-ID` (optional): Unique correlation ID for tracking requests. If not provided, a new UUID is generated.

### Example

```bash
curl -H "X-Correlation-ID: req-12345" http://localhost:4502/api/health
```

## Response

### Success Response (HTTP 200)

```json
{
  "status": "UP",
  "timestamp": 1693489234567,
  "responseTime": 25,
  "correlationId": "req-12345",
  "database": {
    "status": "UP",
    "responseTime": 12
  },
  "application": {
    "status": "UP",
    "uptime": 1693489200000
  }
}
```

### Degraded Response (HTTP 200)

```json
{
  "status": "DEGRADED",
  "timestamp": 1693489234567,
  "responseTime": 5012,
  "correlationId": "req-12345",
  "database": {
    "status": "UNAVAILABLE",
    "lastError": "DatabaseService not available"
  },
  "application": {
    "status": "UP",
    "uptime": 1693489200000
  }
}
```

### Error Response (HTTP 503)

```json
{
  "status": "DOWN",
  "timestamp": 1693489234567,
  "responseTime": 45,
  "correlationId": "req-12345",
  "database": {
    "status": "DOWN",
    "responseTime": 40,
    "lastError": "Connection test failed"
  },
  "application": {
    "status": "DOWN",
    "uptime": 1693489200000
  }
}
```

### Server Error Response (HTTP 500)

```json
{
  "error": "Internal Server Error"
}
```

## Status Values

### Overall Status
- `UP`: Application and database are healthy
- `DEGRADED`: Application is running but one or more dependencies are unavailable
- `DOWN`: Application or critical dependencies are down

### Database Status
- `UP`: Database is connected and responding
- `DOWN`: Database connection test failed
- `UNAVAILABLE`: DatabaseService is not available in the OSGi container

### Application Status
- `UP`: Application is running normally
- `DOWN`: Application has encountered a fatal error

## Response Fields

- `status`: Overall application status
- `timestamp`: Unix timestamp in milliseconds when the check was performed
- `responseTime`: Total health check duration in milliseconds
- `correlationId`: Request correlation ID for tracking (included in logs)
- `database`: Database health details
- `application`: Application health details
- `lastError`: Error description (only present if status is not UP)

## Structured Logging

All requests to the health endpoint are logged with:

- **Correlation ID**: Unique request identifier from header or generated
- **Response Time**: Duration of health check in milliseconds
- **Status**: Overall health status
- **No PII**: No sensitive user data, credentials, or full request payloads are logged

### Log Format

```
INFO: Health endpoint [status=UP, httpStatus=200, responseTime=25ms, correlationId=req-12345]
INFO: Health check completed [status=UP, responseTime=25ms, correlationId=req-12345]
```

## Configuration

Logging levels can be configured in OSGi configuration:

```json
{
  "logLevel": "INFO",
  "includeThreadName": true,
  "includeDuration": true
}
```

### Configuration Properties

- `logLevel`: Log level for health check operations (DEBUG, INFO, WARN, ERROR)
- `includeThreadName`: Include thread name in log messages
- `includeDuration`: Include response time in log messages

## Usage Examples

### Check Overall Health

```bash
curl -v http://localhost:4502/api/health
```

### Check Health with Custom Correlation ID

```bash
curl -H "X-Correlation-ID: my-request-id" http://localhost:4502/api/health
```

### Parse JSON Response

```bash
curl -s http://localhost:4502/api/health | jq '.database.status'
```

### Monitor Endpoint in Script

```bash
#!/bin/bash
RESPONSE=$(curl -s http://localhost:4502/api/health)
STATUS=$(echo $RESPONSE | jq -r '.status')

if [ "$STATUS" != "UP" ]; then
  echo "Alert: Application health is $STATUS"
  echo "Database status: $(echo $RESPONSE | jq -r '.database.status')"
fi
```

## See Also

- [Structured Logging](./LOGGING.md)
- [Correlation ID](./CORRELATION.md)
- Architecture Decision Records: ADR-003, ADR-005, ADR-010, ADR-011, ADR-012, ADR-013, ADR-014, ADR-015
