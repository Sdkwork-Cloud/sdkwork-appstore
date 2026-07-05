# sdkwork-appstore-standalone-gateway

Unified HTTP entrypoint for the SDKWork App Store backend in standalone deployment mode.

## Responsibilities

- Bootstrap database lifecycle via `sdkwork-appstore-database-host` (init + auto-migrate)
- Apply `sdkwork-web-framework` request context, IAM adapter, and infra routes (`/healthz`, `/readyz`)
- Mount app-api business routes with `SdkWorkApiResponse` / `ProblemDetail` mapping through `sdkwork-appstore-routes-common`
- Wire domain services to SQLx repositories

## Run

```bash
export SDKWORK_APPSTORE_DATABASE_URL="sqlite://./.data/appstore.db"
# Optional: sdkwork-drive (artifact/media validation + download URLs)
export APPSTORE_DRIVE_BASE_URL="http://127.0.0.1:18080"
export APPSTORE_DRIVE_SERVICE_AUTH_TOKEN="<service-auth-token>"
export APPSTORE_DRIVE_SERVICE_ACCESS_TOKEN="<service-access-token>"
# Optional: sdkwork-platform (registered app validation on listing create)
export APPSTORE_PLATFORM_BASE_URL="http://127.0.0.1:18080"
export APPSTORE_PLATFORM_SERVICE_AUTH_TOKEN="<service-auth-token>"
cargo run -p sdkwork-appstore-standalone-gateway
```

Default listen port: `18090` (`PORT` env override).

### sdkwork-drive (server adapter)

```bash
export APPSTORE_DRIVE_BASE_URL="http://127.0.0.1:18080"
export APPSTORE_DRIVE_SERVICE_AUTH_TOKEN="<service-auth-token>"
export APPSTORE_DRIVE_SERVICE_ACCESS_TOKEN="<service-access-token>"  # uploader requires dual tokens
# optional:
export APPSTORE_DRIVE_SPACE_ID="<drive-space-id>"
export APPSTORE_DRIVE_ENABLED=1
```

Client uploads (PC/H5 publisher flows) use `@sdkwork/drive-app-sdk` with `driveAppApiBaseUrl` in runtime config.

## Architecture Notes

- Route crates (`sdkwork-routes-*`) own handler logic and OpenAPI manifests; gateway merges their Axum routers.
- File uploads go through `sdkwork-drive` (`@sdkwork/drive-app-sdk` on clients; `DriveIntegrationAdapter` on server). App Store APIs store Drive references only.
- Set `APPSTORE_DRIVE_ENABLED=0` or omit `APPSTORE_DRIVE_BASE_URL` to run without drive validation (dev-only; not for production).
- RPC / `sdkwork-discovery` is not required until split-service RPC deployment is introduced.
- Standalone gateway repositories currently require SQLite (`APPSTORE_DATABASE_URL`); Postgres dialect is tracked separately.

## Verification

```bash
pnpm run verify
```
