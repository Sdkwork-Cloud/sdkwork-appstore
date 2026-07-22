# sdkwork-routes-appstore-catalog-backend-api

Rust HTTP route adapter skeleton for catalog backend-api operations.

## Boundary

- Owns only this crate's SDKWork responsibility.
- Must preserve authored OpenAPI, database registry, and SDK family boundaries.
- Must not call raw HTTP, parse credential headers manually, or bypass generated/dependency SDKs.

## Implementation Status

Route handlers, request/response/problem mappers implemented. Delegates business logic to service crates via typed request context.
