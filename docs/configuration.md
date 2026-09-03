# Environment and Configuration

## Environments
| Environment | Purpose | AEM Run Mode |
|-------------|---------|--------------|
| dev | Local development | author, publish |
| qa | Shared testing | author, publish |
| staging | Pre-production | author, publish |
| prod | Production | author, publish |

## Configuration Files
- AEM OSGi configuration: `ui.config/src/main/content/jcr_root/apps/hiero-ecom/osgiconfig/config/`
- Per-run-mode overrides in subdirectories: `config.author`, `config.publish`, `config.dev`

## Environment Variables
Values that vary by environment are injected via environment variables (e.g., `$[env:VAR_NAME]`):
- `SEARCH_API_KEY`
- `SQL_CONNECTION_STRING`
- `EXTERNAL_API_BASE_URL`

## Secrets Management
- Secrets are never committed to the repository
- Use cloud provider secrets manager (e.g., AWS Secrets Manager, Azure Key Vault)
- Inject via environment variables in the deployment pipeline

## Example OSGi Configuration
```json
{
  "service.api.base.url": "http://localhost:8080/api/v1",
  "search.api.key": "${env:SEARCH_API_KEY}",
  "db.connection.string": "${env:SQL_CONNECTION_STRING}"
}
```

## Steps to Configure a New Environment
1. Create a new run mode folder under `ui.config/src/main/content/jcr_root/apps/hiero-ecom/osgiconfig/config.<env>`
2. Add OSGi configuration files for each service
3. Set environment variables in the deployment pipeline
4. Deploy
