> Migrated from `docs/sdk/sdk-design.md` on 2026-06-24.
> Owner: SDKWork maintainers

# SDKWork App Store SDK Design

Version: 0.1.0  
Related: SDK_SPEC.md, SDK_WORKSPACE_GENERATION_SPEC.md, APP_SDK_INTEGRATION_SPEC.md

## SDK Family Overview

| SDK family | API authority | Prefix | Primary consumers |
| --- | --- | --- | --- |
| `sdkwork-appstore-sdk` | `sdkwork-appstore-open-api` | `/store/v3/api` | Update clients, CI/CD, public integrations |
| `sdkwork-appstore-app-sdk` | `sdkwork-appstore-app-api` | `/app/v3/api` | Store UI, publisher console (user-facing) |
| `sdkwork-appstore-backend-sdk` | `sdkwork-appstore-backend-api` | `/backend/v3/api` | Operator admin, internal automation |

All three families share stem `appstore` and domain semantics `appstore`.

## Generation Pipeline

```text
apis/{surface}/store/openapi.yaml
        �?
        �? tools/appstore_openapi_materialize.mjs
sdks/sdkwork-appstore-*-sdk/openapi/sdkwork-appstore-*-api.openapi.yaml
        �?
        �? tools/appstore_sdk_generate.mjs  �? sdkgen
sdks/sdkwork-appstore-*-sdk/sdkwork-appstore-*-sdk-typescript/generated/server-openapi/
```

Rules:

- Generator: `@sdkwork/sdk-generator` / `sdkgen` only.
- Never hand-edit `generated/server-openapi/`.
- Semantic facades (if needed) live in `composed/` outside generated output.

## Declared SDK Dependencies

| Dependency | Purpose | Consumption |
| --- | --- | --- |
| `sdkwork-iam-app-sdk` | IAM session, organization context | AuthGate, TokenManager |
| `sdkwork-comments-app-sdk` | Reviews, ratings, favorites | Listing detail, thread binding |
| `sdkwork-drive-app-sdk` | Upload icons, screenshots, binaries | Publisher console media flows |

Optional future dependency:

| Dependency | Purpose |
| --- | --- |
| `sdkwork-commerce (deleted)-app-sdk` | Paid listing purchase and IAP metadata |

## Client Construction

Apps initialize store SDK clients through runtime config (`CONFIG_SPEC.md`):

```typescript
// Illustrative composed facade boundary �?generated in implementation phase
import { createAppStoreAppClient } from "@sdkwork/appstore-app-sdk/composed";

const storeClient = createAppStoreAppClient({
  baseUrl: runtimeConfig.appstoreAppApiBaseUrl,
  tokenManager,
});
```

Config keys (to be added to app manifests):

| Key | Surface |
| --- | --- |
| `appstoreOpenApiBaseUrl` | open-api |
| `appstoreAppApiBaseUrl` | app-api |
| `appstoreBackendApiBaseUrl` | backend-admin only |

## Namespace Mapping

Generated TypeScript namespaces follow operationId trees:

| operationId prefix | SDK namespace |
| --- | --- |
| `appstore.catalog.*` | `client.store.catalog.*` |
| `appstore.listings.*` | `client.store.listings.*` |
| `appstore.publishers.*` | `client.store.publishers.*` |
| `appstore.releases.*` | `client.store.releases.*` |
| `appstore.library.*` | `client.store.library.*` |
| `appstore.moderation.*` | `client.store.moderation.*` (backend SDK only) |

## Surface Boundaries

| Consumer | Allowed SDK | Forbidden |
| --- | --- | --- |
| Store PC/H5/mobile app | `sdkwork-appstore-app-sdk` | backend SDK, raw HTTP |
| Publisher console (user-facing) | `sdkwork-appstore-app-sdk` | backend SDK |
| Operator admin UI | `sdkwork-appstore-backend-sdk` | n/a |
| Embedded app updater | `sdkwork-appstore-sdk` | app/backend SDK for auth unless dual use documented |
| Tauri/desktop host | `sdkwork-appstore-sdk` + appbase | local HTTP forks |

## Flutter / Mobile Native Targets

Materialize additional generator inputs:

- `sdkwork-appstore-app-api.flutter.sdkgen.yaml`
- `sdkwork-appstore-open-api.flutter.sdkgen.yaml`

Kotlin/Swift packages generated for Android/iOS store clients in implementation phase.

## Verification (implementation phase)

```powershell
pnpm run sdk:check
pnpm run test:appstore-contracts
```

Contract tests must prove:

- All operationIds in `docs/api/operation-catalog.md` exist in materialized OpenAPI.
- Prefix lock validation passes.
- No auth login operations appear in store authorities.
- SDK dependencies resolve without raw HTTP fallbacks.

## Assembly Metadata

Each SDK family root requires `sdk-manifest.json` (see `sdks/sdkwork-appstore-*-sdk/`).

