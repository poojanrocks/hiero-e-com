package com.hiero.ecom.core.db;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Hiero eCommerce Database Configuration")
public @interface DatabaseConfig {

    @AttributeDefinition(
        name = "Database URL",
        description = "JDBC connection URL (e.g., jdbc:mysql://localhost:3306/ecom)"
    )
    String db_url() default "jdbc:mysql://localhost:3306/hiero_ecom";

    @AttributeDefinition(
        name = "Database Username",
        description = "Database user for connection"
    )
    String db_username() default "root";

    @AttributeDefinition(
        name = "Database Password",
        description = "Database password (should be externalized in production)"
    )
    String db_password() default "";

    @AttributeDefinition(
        name = "Maximum Pool Size",
        description = "Maximum number of connections in the pool",
        min = "1",
        max = "100"
    )
    int pool_max_size() default 20;

    @AttributeDefinition(
        name = "Minimum Idle Connections",
        description = "Minimum number of idle connections to maintain",
        min = "0",
        max = "100"
    )
    int pool_min_idle() default 5;

    @AttributeDefinition(
        name = "Connection Timeout (ms)",
        description = "Maximum time to wait for a connection from the pool",
        min = "1000",
        max = "60000"
    )
    long connection_timeout() default 10000L;

    @AttributeDefinition(
        name = "Idle Timeout (ms)",
        description = "Maximum idle time before connection is closed",
        min = "10000",
        max = "600000"
    )
    long idle_timeout() default 300000L;

    @AttributeDefinition(
        name = "Max Lifetime (ms)",
        description = "Maximum lifetime of a connection",
        min = "30000",
        max = "3600000"
    )
    long max_lifetime() default 1800000L;

    @AttributeDefinition(
        name = "Enable Validation",
        description = "Enable connection validation via test query"
    )
    boolean validation_enabled() default true;

    @AttributeDefinition(
        name = "Validation Query",
        description = "SQL query to validate connections (e.g., 'SELECT 1')"
    )
    String validation_query() default "SELECT 1";
}
