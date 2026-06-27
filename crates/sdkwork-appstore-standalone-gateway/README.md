# sdkwork-appstore-standalone-gateway

Runnable HTTP process skeleton for mounting appstore route crates.

## Boundary

- Owns only this crate's SDKWork responsibility.
- Must preserve authored OpenAPI, database registry, and SDK family boundaries.
- Must not call raw HTTP, parse credential headers manually, or bypass generated/dependency SDKs.

## Implementation Status

- Adapter config with 8 dependency bindings (appbase, platform, drive, comments, commerce, notifications, search, market_channels).
- Preflight validation for required and optional dependency surfaces.
- Route mounting plan for app-api, backend-api, and open-api surfaces.
- Server config with port bindings for all three surfaces.
