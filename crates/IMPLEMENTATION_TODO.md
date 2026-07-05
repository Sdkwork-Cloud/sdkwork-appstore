# SDKWork App Store Implementation Status

Active alignment tracker for `sdkwork-appstore` against `sdkwork-specs`.

Last updated: 2026-07-06

## Framework Integration

| Framework | Status | Notes |
| --- | --- | --- |
| `sdkwork-web-framework` | Integrated | Standalone gateway wraps Axum router; IAM + route manifest validation; `SdkWorkApiResponse` / `ProblemDetail` via `routes-common` |
| `sdkwork-database` | Integrated | SQLite + PostgreSQL via `sdkwork-appstore-database-host`; dialect placeholder adaptation in `sdkwork-appstore-repository-sqlx` |
| `sdkwork-utils` | Integrated | Rust envelope helpers; TypeScript record helpers in PC/H5 commons via `@sdkwork/utils` |
| `sdkwork-discovery` | Deferred | HTTP-only unified-process gateway; adopt when RPC split-services land |
| `sdkwork-drive` | Integrated | PC/H5 `@sdkwork/drive-app-sdk` upload helpers; Rust `drive_adapter` + `drive_uploader` |
| `sdkwork-comments` | Integrated | PC/H5 `@sdkwork/comments-app-sdk` listing reviews via `comments_thread_id` |
| `sdkwork-appbase` | Integrated | Publisher console bootstraps via appbase shell; app-sdk composition validated by check:app-sdk-consumers |
| `sdkwork-platform` | Integrated | Platform context resolver wired in standalone gateway preflight; IAM dual-token context propagation |

## API Operations (95+)

All catalog, listing, library, publisher, moderation, compliance, analytics, and market operations implemented end-to-end (gateway + SQLx repositories + composed SDK + PC/H5 surfaces).

| Component | Status | Notes |
| --- | --- | --- |
| Analytics worker | Implemented | Scheduled listing metrics, chart snapshots, trending term projections |
| App SDK composed client | Implemented | Catalog/listing extension methods in `composed/client.ts` |
| Publisher console core | Implemented | `@sdkwork/appstore-publisher-console-core` shared service/hooks |
| PC publisher UI | Implemented | `@sdkwork/appstore-pc-console-publisher` (zh-CN) |
| H5 publisher UI | Implemented | `@sdkwork/appstore-h5-console-publisher` (zh-CN mobile) |

## Client Surfaces

| Surface | Dev command | Status |
| --- | --- | --- |
| PC browser | `pnpm dev` (pc app root) | zh-CN shell; IAM profile; publisher console package |
| H5 mobile web | `pnpm dev` (h5 app root) | 5-tab nav; zh-CN publisher + settings IAM card |

## Verification

```bash
pnpm install
pnpm check
pnpm verify
cargo test --workspace
```

Last verified: 2026-07-06 — PC/H5 `pnpm build`, governance checks, comments SDK integration.

## Database (SQLite + PostgreSQL)

| Item | Status |
| --- | --- |
| Dialect SQL adaptation | Implemented (`repository-sqlx/db/dialect.rs`) |
| Unified `AppstoreSqlxDb` pool | Implemented |
| `BindValue` reference / optional binds | Implemented (Postgres + SQLite) |
| Gateway `APPSTORE_DATABASE_URL` | SQLite default; PostgreSQL via `postgres://` URL |
| PostgreSQL CI matrix | Optional follow-up |

## Remaining Production Items

- External connectors: commerce checkout, notifications push, search federation, market_channels sync
- Production LCP / CDN performance validation (requires deployed environment)
- Optional: dedicated PostgreSQL CI matrix job (dialect code paths exist; default dev remains SQLite)
