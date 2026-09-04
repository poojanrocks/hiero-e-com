package com.hiero.ecom.core.db;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(
    name = "Hiero eCommerce Database Configuration",
    description = "Configuration for database connection pooling and access"
)
public @interface DatabaseConfig {

    @AttributeDefinition(
        name = "JDBC URL",
        description = "JDBC connection URL for the database",
        type = AttributeType.STRING
    )
    String jdbcUrl() default "jdbc:mysql://localhost:3306/hiero_ecom";

    @AttributeDefinition(
        name = "Database Username",
        description = "Username for database authentication",
        type = AttributeType.STRING
    )
    String dbUsername() default "root";

    @AttributeDefinition(
        name = "Database Password",
        description = "Password for database authentication",
        type = AttributeType.PASSWORD
    )
    String dbPassword() default "";

    @AttributeDefinition(
        name = "Maximum Pool Size",
        description = "Maximum number of connections in the pool",
        type = AttributeType.INTEGER
    )
    int getMaxPoolSize() default 10;

    @AttributeDefinition(
        name = "Minimum Idle Connections",
        description = "Minimum number of idle connections to maintain",
        type = AttributeType.INTEGER
    )
    int getMinIdleConnections() default 2;

    @AttributeDefinition(
        name = "Connection Timeout (seconds)",
        description = "Maximum time to wait for a connection from the pool",
        type = AttributeType.INTEGER
    )
    int getConnectionTimeoutSeconds() default 30;

    @AttributeDefinition(
        name = "Idle Timeout (seconds)",
        description = "Maximum time a connection can remain idle before being closed",
        type = AttributeType.INTEGER
    )
    int getIdleTimeoutSeconds() default 600;

    @AttributeDefinition(
        name = "Connection Validation Query",
        description = "SQL query to validate connection health",
        type = AttributeType.STRING
    )
    String getValidationQuery() default "SELECT 1";
}
