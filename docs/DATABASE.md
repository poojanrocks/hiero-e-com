# Database Configuration and Connection Pooling

## Overview

This document describes the database connectivity layer for the Hiero eCommerce AEM application. It provides managed SQL datasource access with HikariCP connection pooling, repository abstraction, and safe query utilities.

## Architecture

### Components

- **DataSourceFactory**: OSGi component managing HikariCP datasource lifecycle
- **DatabaseService**: OSGi service providing connection management and validation
- **DatabaseRepository**: Interface for repository pattern data access
- **DatabaseRepositoryImpl**: Implementation with parameterized queries and error handling
- **QueryResult**: DTO for query result representation

## Configuration

### Local Development Setup

1. **Ensure MySQL is running:**
   ```bash
   mysql -u root -p
   ```

2. **Create database:**
   ```sql
   CREATE DATABASE hiero_ecom;
   USE hiero_ecom;
   ```

3. **Create sample tables:**
   ```sql
   CREATE TABLE products (
     id BIGINT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     sku VARCHAR(100) UNIQUE,
     price DECIMAL(10, 2),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE cart_items (
     id BIGINT AUTO_INCREMENT PRIMARY KEY,
     session_id VARCHAR(255),
     product_id BIGINT,
     quantity INT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (product_id) REFERENCES products(id)
   );
   ```

### OSGi Configuration

Configuration is defined in:
```
ui.config/src/main/content/jcr_root/apps/hiero-ecom/osgiconfig/config/com.hiero.ecom.core.db.DataSourceFactory~hiero-ecom.cfg.json
```

#### Configuration Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `db_url` | `jdbc:mysql://localhost:3306/hiero_ecom` | JDBC connection URL |
| `db_username` | `root` | Database username |
| `db_password` | `` | Database password |
| `pool_max_size` | `20` | Maximum connections in pool |
| `pool_min_idle` | `5` | Minimum idle connections |
| `connection_timeout` | `10000` | Connection timeout in milliseconds |
| `idle_timeout` | `300000` | Idle timeout in milliseconds (5 min) |
| `max_lifetime` | `1800000` | Maximum connection lifetime in milliseconds (30 min) |
| `validation_enabled` | `true` | Enable connection validation |
| `validation_query` | `SELECT 1` | Query to validate connections |

#### Environment Variable Overrides

For production deployments, use environment variables:

```bash
export DB_USERNAME=ecom_user
export DB_PASSWORD=secure_password
```

Update configuration in AEM Cloud Manager or local `crx-quickstart/launchpad/config`.

## Usage

### Inject DatabaseRepository

```java
@Component
public class ProductService {
    @Reference
    private DatabaseRepository databaseRepository;

    public List<Map<String, Object>> getProducts() throws SQLException {
        QueryResult result = databaseRepository.executeQuery(
            "SELECT * FROM products ORDER BY created_at DESC"
        );
        
        if (!result.isSuccess()) {
            throw new SQLException(result.getErrorMessage());
        }
        
        return result.getRows();
    }
}
```

### Parameterized Queries

Always use parameterized queries to prevent SQL injection:

```java
QueryResult result = databaseRepository.executeQuery(
    "SELECT * FROM products WHERE category = ? AND price > ?",
    "electronics",
    50.00
);
```

### Handle Results

```java
QueryResult result = databaseRepository.executeQuery("SELECT * FROM products WHERE id = ?", 1L);

if (result.isSuccess()) {
    if (result.isEmpty()) {
        // No results found
    } else {
        Map<String, Object> product = result.getRows().get(0);
        Long id = (Long) product.get("id");
        String name = (String) product.get("name");
    }
} else {
    // Handle error
    String error = result.getErrorMessage();
    LOGGER.error("Query failed: {}", error);
}
```

### Update Operations

```java
QueryResult result = databaseRepository.executeUpdate(
    "UPDATE products SET name = ? WHERE id = ?",
    "Updated Product",
    1L
);

if (result.isSuccess()) {
    int affected = result.getRowCount();
    LOGGER.info("{} rows updated", affected);
}
```

## Connection Pooling

HikariCP manages the connection pool automatically:

- **Min Idle**: 5 connections kept ready
- **Max Size**: 20 maximum connections
- **Connection Timeout**: 10 seconds to acquire a connection
- **Idle Timeout**: 5 minutes before idle connections are closed
- **Max Lifetime**: 30 minutes maximum connection age

### Monitoring

Pool status is logged during initialization:
```
DataSource initialized with pool size: 20, minIdle: 5
```

Connection acquisition logs include correlation IDs for tracing:
```
Connection acquired [correlation-id-123]
```

## Error Handling

All database operations return `QueryResult` with status:

```java
if (result.isSuccess()) {
    // Operation succeeded
} else {
    // result.getErrorMessage() contains error details
    // Errors are logged with correlation IDs for debugging
}
```

Errors do NOT expose internal SQL details to clients:
- Client receives: "Query execution failed"
- Server logs full exception with correlation ID for investigation

## Validation

### Connectivity Test

```java
boolean valid = databaseService.validateConnection();
if (!valid) {
    LOGGER.error("Database connection validation failed");
}
```

### Health Check Endpoint

Use `/health` endpoint to verify database connectivity.

## Testing

Run unit tests:
```bash
mvn clean test -Dtest=DatabaseRepositoryTest
```

Tests cover:
- Successful queries with results
- Empty result sets
- Parameterized query execution
- Update operations
- Connection failures
- Resource cleanup

## Security Considerations

1. **Credentials**: Use environment variables or AEM secrets for production passwords
2. **SQL Injection**: Always use parameterized queries via `?` placeholders
3. **Logging**: Sensitive data (passwords, user info) is NEVER logged
4. **Correlation IDs**: All operations include correlation ID for audit trails
5. **Connection Pooling**: Prevents connection exhaustion attacks

## Troubleshooting

### Connection Refused
```
Error: Connection refused. Is the server running on localhost:3306?
```

Ensure MySQL is running and `db_url` is correct.

### Too Many Connections
```
Error: too many connections
```

Adjust `pool_max_size` down or increase MySQL max_connections.

### Query Timeout
```
Error: Query execution failed
```

Check:
- Database is responsive: `mysql -u root -p -e "SELECT 1"`
- Increase `connection_timeout` if network is slow
- Review slow query logs in MySQL

### Idle Connections Not Closing

HikariCP automatically closes idle connections after 5 minutes (`idle_timeout`). If connections persist:
1. Check AEM logs for exceptions
2. Verify MySQL server hasn't crashed
3. Review connection usage pattern

## References

- [HikariCP Documentation](https://github.com/brettwooldridge/HikariCP/wiki/Configuration)
- [JDBC Tutorial](https://docs.oracle.com/javase/tutorial/jdbc/)
- [OSGi Declarative Services](https://osgi.org/specification/osgi.cmpn/7.0.0/service.component.html)
