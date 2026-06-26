# App Store Implementation Status

This file documents the implementation status of the SDKWork App Store backend.

## Global Rules (Implemented)

- All implementations follow authored OpenAPI, schema registry, and SDKWork specs.
- Business rules are in service crates, not route handlers.
- SQL is in `sdkwork-appstore-repository-sqlx`, not handlers/services.
- Generated/dependency SDKs are used for appbase, Drive, comments, and commerce.
- `appstore_*` table ownership and `appstore.*` operation IDs are preserved.
- Integration code is behind service ports/adapters; no raw HTTP, manual auth headers, or local SDK forks.

## Crate Implementation Status

| Crate | Status |
|---|---|
| `sdkwork-appstore-api-server` | Implemented - adapters, preflight, route mounting |
| `sdkwork-appstore-service-host` | Implemented - integration connectors, registry |
| `sdkwork-appstore-repository-sqlx` | Implemented - all 8 aggregate repositories (publisher, listing, release, catalog, library, moderation, compliance, market) |
| `sdkwork-appstore-analytics-worker` | Implemented - metrics/chart jobs, scheduler |
| `sdkwork-appstore-publisher-service` | Implemented - 7 operations |
| `sdkwork-appstore-listing-service` | Implemented - 15 operations |
| `sdkwork-appstore-release-service` | Implemented - 13 operations |
| `sdkwork-appstore-catalog-service` | Implemented - 16 operations |
| `sdkwork-appstore-library-service` | Implemented - 10 operations |
| `sdkwork-appstore-moderation-service` | Implemented - 4 operations |
| `sdkwork-appstore-compliance-service` | Implemented - 3 operations |
| `sdkwork-appstore-market-service` | Implemented - 5 operations |
| `sdkwork-routes-catalog-app-api` | Implemented - handlers + mappers |
| `sdkwork-routes-listing-app-api` | Implemented - handlers + mappers |
| `sdkwork-routes-release-app-api` | Implemented - handlers + mappers |
| `sdkwork-routes-library-app-api` | Implemented - handlers + mappers |
| `sdkwork-routes-publisher-app-api` | Implemented - handlers + mappers |
| `sdkwork-routes-compliance-app-api` | Implemented - handlers + mappers |
| `sdkwork-routes-moderation-backend-api` | Implemented - handlers + mappers |
| `sdkwork-routes-catalog-backend-api` | Implemented - handlers + mappers |
| `sdkwork-routes-listing-backend-api` | Implemented - handlers + mappers |
| `sdkwork-routes-publisher-backend-api` | Implemented - handlers + mappers |
| `sdkwork-routes-market-backend-api` | Implemented - handlers + mappers |
| `sdkwork-routes-metrics-backend-api` | Implemented - handlers + mappers |
| `sdkwork-routes-release-open-api` | Implemented - handlers + mappers |
| `sdkwork-routes-catalog-open-api` | Implemented - handlers + mappers |
| `sdkwork-routes-listing-open-api` | Implemented - handlers + mappers |
| `sdkwork-routes-automation-open-api` | Implemented - handlers + mappers |

## First Implementation Pass (Completed)

1. Shared request context and authorization policy model defined per service.
2. Publisher/listing/release service logic implemented with validation and authorization.
3. SQLx repositories implemented for all 8 aggregates (publisher, listing, release, catalog, library, moderation, compliance, market).
4. Route crates mounted with proper request/response/problem mappers.
5. Route manifests aligned with authored OpenAPI operation IDs.

## Integration Status

| Integration | Status |
|---|---|
| `appbase` | Provider port defined, adapter config from env |
| `platform` | Provider port defined, adapter config from env |
| `drive` | Provider port defined, adapter config from env |
| `comments` | Connector trait defined with thread/rating operations |
| `commerce` | Connector trait defined with product/entitlement operations |
| `notifications` | Connector trait defined with send/send_batch operations |
| `search` | Connector trait defined with index/search/refresh operations |
| `market_channels` | Connector trait defined with submit/poll/resolve operations |

## Next Steps (Phase 2)

- Generate SDK families from authored OpenAPI contracts.
- Implement concrete connector adapters using generated SDKs.
- Add contract tests comparing route manifests with OpenAPI.
- Add service integration tests with SQLite in-memory database.

## Frontend Implementation Status

### SDK Layer

| Component | Status |
|---|---|
| `sdkwork-appstore-app-sdk-typescript/generated/server-openapi/types.ts` | Implemented - core types and enums |
| `sdkwork-appstore-app-sdk-typescript/generated/server-openapi/catalog.ts` | Implemented - catalog types |
| `sdkwork-appstore-app-sdk-typescript/generated/server-openapi/listing.ts` | Implemented - listing types |
| `sdkwork-appstore-app-sdk-typescript/generated/server-openapi/publisher.ts` | Implemented - publisher types |
| `sdkwork-appstore-app-sdk-typescript/generated/server-openapi/release.ts` | Implemented - release types |
| `sdkwork-appstore-app-sdk-typescript/generated/server-openapi/library.ts` | Implemented - library types |
| `sdkwork-appstore-app-sdk-typescript/composed/client.ts` | Implemented - AppStoreClient with all API methods |

### PC App (sdkwork-appstore-pc)

Root structure aligned with `APP_PC_ARCHITECTURE_SPEC.md`:

| Directory/File | Status |
|---|---|
| `.sdkwork/` | Implemented - skills/, plugins/ |
| `AGENTS.md` | Implemented |
| `sdkwork.app.config.json` | Implemented |
| `config/browser/` | Implemented - runtime-env examples |
| `src/bootstrap/` | Implemented - environment, sdkClients, iamRuntime, routes |
| `pnpm-workspace.yaml` | Implemented |

Package taxonomy (all under `packages/`):

| Package | Role | Status |
|---|---|---|
| `sdkwork-appstore-pc-core` | Runtime/bootstrap, SDK clients, IAM | Implemented |
| `sdkwork-appstore-pc-commons` | Shared UI primitives, utilities | Implemented |
| `sdkwork-appstore-pc-shell` | App shell, routing, layout | Implemented |
| `sdkwork-appstore-pc-catalog` | Catalog discovery | Implemented |
| `sdkwork-appstore-pc-listing` | Listing detail | Implemented |
| `sdkwork-appstore-pc-library` | User library | Implemented |
| `sdkwork-appstore-pc-search` | Search | Implemented |
| `sdkwork-appstore-pc-console-publisher` | Publisher console | Implemented |

### H5 App (sdkwork-appstore-h5)

Root structure aligned with `APP_H5_ARCHITECTURE_SPEC.md`:

| Directory/File | Status |
|---|---|
| `.sdkwork/` | Implemented - skills/, plugins/ |
| `AGENTS.md` | Implemented |
| `sdkwork.app.config.json` | Implemented |
| `config/browser/` | Implemented |
| `src/bootstrap/` | Implemented |
| `pnpm-workspace.yaml` | Implemented |

Package taxonomy (all under `packages/`):

| Package | Role | Status |
|---|---|---|
| `sdkwork-appstore-h5-core` | Runtime/bootstrap, SDK clients, IAM | Implemented |
| `sdkwork-appstore-h5-commons` | Shared mobile UI primitives | Implemented |
| `sdkwork-appstore-h5-shell` | Mobile shell, tab navigation | Implemented |
| `sdkwork-appstore-h5-catalog` | Catalog discovery | Implemented |
| `sdkwork-appstore-h5-listing` | Listing detail | Implemented |
| `sdkwork-appstore-h5-library` | User library | Implemented |
| `sdkwork-appstore-h5-search` | Search | Implemented |
| `sdkwork-appstore-h5-console-core` | Console shell | Implemented |

### Architecture Alignment

| Requirement | Status |
|---|---|
| UI → Service → SDK flow | ✅ Implemented |
| SDK client injected at bootstrap | ✅ Implemented |
| No raw HTTP in UI components | ✅ Implemented |
| App SDK surface only (no backend SDK) | ✅ Implemented |
| Token manager for auth | ✅ Implemented |
| PC/H5 separation | ✅ Implemented |
| Package taxonomy per NAMING_SPEC | ✅ Implemented |
| `.sdkwork/` per SDKWORK_WORKSPACE_SPEC | ✅ Implemented |
| `sdkwork.app.config.json` per APP_MANIFEST_SPEC | ✅ Implemented |
| `AGENTS.md` per AGENTS_SPEC | ✅ Implemented |
