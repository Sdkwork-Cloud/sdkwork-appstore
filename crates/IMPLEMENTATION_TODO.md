# SDKWork App Store Implementation Status

Active alignment tracker for `sdkwork-appstore` against `sdkwork-specs`.

Last updated: 2026-07-06

## Framework Integration

| Framework | Status | Notes |
| --- | --- | --- |
| `sdkwork-web-framework` | Integrated | Standalone gateway wraps Axum router; IAM + route manifest validation; `SdkWorkApiResponse` / `ProblemDetail` via `routes-common` |
| `sdkwork-database` | Integrated (SQLite) | `sdkwork-appstore-database-host` lifecycle + `db:*` scripts; extension schema `0002` synced to `database/contract/schema.yaml` |
| `sdkwork-utils` | Integrated | Rust envelope helpers; TypeScript record helpers in PC/H5 commons via `@sdkwork/utils` |
| `sdkwork-discovery` | Deferred | HTTP-only unified-process gateway; adopt when RPC split-services land |
| `sdkwork-drive` | Integrated | PC/H5 `@sdkwork/drive-app-sdk` upload helpers; Rust `drive_adapter` + `drive_uploader` |
| `sdkwork-appbase` | Integrated | Publisher console bootstraps via appbase shell; app-sdk composition validated by check:app-sdk-consumers |
| `sdkwork-platform` | Integrated | Platform context resolver wired in standalone gateway preflight; IAM dual-token context propagation |

## API Operations (95+)

| Area | Status |
| --- | --- |
| Catalog (home, categories, collections, charts, search) | Implemented |
| Catalog extensions (recommendations, events, search history/trending) | Implemented |
| Listing lifecycle + extensions (similar, developer other, editorial, release history) | Implemented |
| Compliance (profile, permissions, IAP preview) | Implemented |
| Moderation (queue, decisions, appeals) | Implemented |
| Analytics (publisher + operator dashboards) | Implemented |
| Library, release, publisher, market | Implemented |

Gateway Axum routes match `http_route_manifest.rs` (parity test passing).

| Component | Status | Notes |
| --- | --- | --- |
| Analytics worker | Implemented | Scheduled listing metrics, chart snapshots, trending term projections |
| App SDK composed client | Implemented | Catalog/listing extension methods in `composed/client.ts` |
| Publisher console core | Implemented | `@sdkwork/appstore-publisher-console-core` shared service/hooks for PC + H5 |

## Client Surfaces

| Surface | Dev command | Status |
| --- | --- | --- |
| PC browser | `pnpm dev` (pc app root) | Publisher in `@sdkwork/appstore-pc-console-publisher`; zh-CN settings/notifications; IAM profile on login |
| H5 mobile web | `pnpm dev` (h5 app root) | Publisher in `@sdkwork/appstore-h5-console-publisher` (zh-CN); 5-tab nav; IAM settings card |

## Verification

```bash
pnpm install
pnpm check
pnpm verify
cargo test --workspace
```

Last verified: PC/H5 `pnpm build` + governance checks — 2026-07-06.

## Remaining Production Items

- Postgres SQLx repository dialect + gateway pool selection (today: SQLite in standalone gateway)
- External connectors: comments (reviews UI), commerce checkout, notifications push, search federation, market_channels sync
- Production LCP / CDN performance validation (requires deployed environment)
- PC publisher console: remaining English copy in detail forms (stats labels, listing manage sections)
