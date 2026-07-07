# SDKWork App Store Implementation Status

Active alignment tracker for `sdkwork-appstore` against `sdkwork-specs`.

Last updated: 2026-07-07

## Framework Integration

| Framework | Status | Notes |
| --- | --- | --- |
| `sdkwork-web-framework` | Integrated | Standalone gateway wraps Axum router; IAM + route manifest validation; `SdkWorkApiResponse` / `ProblemDetail` via `routes-common` |
| `sdkwork-database` | Integrated | SQLite + PostgreSQL via `sdkwork-appstore-database-host`; dialect placeholder adaptation in `sdkwork-appstore-repository-sqlx` |
| `sdkwork-utils` | Integrated | Rust envelope helpers; TypeScript record helpers in PC/H5 commons via `@sdkwork/utils` |
| `sdkwork-discovery` | Deferred | HTTP-only unified-process gateway; adopt when RPC split-services land |
| `sdkwork-drive` | Integrated | PC/H5 `@sdkwork/drive-app-sdk` upload helpers; Rust `drive_adapter` + `drive_uploader` |
| `sdkwork-comments` | Integrated | PC/H5 `@sdkwork/comments-app-sdk` listing reviews via `comments_thread_id` |
| `sdkwork-clawrouter` (notifications) | Integrated | PC/H5 inbox via `@sdkwork/clawrouter-app-sdk` + `appstore-notification-core` |
| `sdkwork-clawrouter` (commerce checkout) | Integrated | PC/H5 paid listing acquire via `@sdkwork/clawrouter-app-sdk/domains` + `appstore-listing-acquire-core` |
| `sdkwork-search` | Integrated (optional) | `SearchFederationAdapter` + SQL fallback; env `APPSTORE_SEARCH_BASE_URL` |
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
| Listing acquire (paid checkout UX) | Implemented | `@sdkwork/appstore-listing-acquire-core`; PC/H5 listing detail ownership + checkout branch |
| Search UX core | Implemented | `@sdkwork/appstore-search-core`; PC/H5 zh-CN search mappers |
| Library updates UX core | Implemented | `@sdkwork/appstore-library-core`; PC/H5 updates page shared mapper |
| Listing support UX core | Implemented | `@sdkwork/appstore-listing-support-core`; PC/H5 listing report via support/mailto channel |
| Library actions core | Implemented | `@sdkwork/appstore-library-core`; PC/H5 uninstall + wishlist remove wired to app-api |
| Search index projection | Implemented | `SearchProjectionAdapter` on moderation approve; remove on storefront hide (optional env) |
| Market channel HTTP connectors | Implemented | Apple/Google/Enterprise relay via `APPSTORE_MARKET_*_SUBMIT_URL` |

## Client Surfaces

| Surface | Dev command | Status |
| --- | --- | --- |
| PC browser | `pnpm dev` (pc app root) | zh-CN shell; IAM profile; publisher console package |
| H5 mobile web | `pnpm dev` (h5 app root) | 5-tab nav; zh-CN library/report/settings |

## Verification

```bash
pnpm install
pnpm check
pnpm verify
cargo test --workspace
```

Last verified: 2026-07-07 — PC/H5 `pnpm build`, library uninstall/wishlist + H5 report flow, governance checks.

## Database (SQLite + PostgreSQL)

| Item | Status |
| --- | --- |
| Dialect SQL adaptation | Implemented (`repository-sqlx/db/dialect.rs`) |
| Unified `AppstoreSqlxDb` pool | Implemented |
| `BindValue` reference / optional binds | Implemented (Postgres + SQLite) |
| Gateway `APPSTORE_DATABASE_URL` | SQLite default; PostgreSQL via `postgres://` URL |
| PostgreSQL CI matrix | Optional follow-up |

## Remaining Production Items

- Commerce: cart line-item body on clawrouter `/cart/items` when wire exposes product attachment (checkout session + best-effort quote wired today)
- Listing abuse API: optional dedicated `appstore.compliance.reports.submit` when moderation intake table is added (PC/H5 report UX uses support/mailto today)
- Production LCP / CDN performance validation (requires deployed environment)
- Optional: dedicated PostgreSQL CI matrix job (dialect code paths exist; default dev remains SQLite)

### Optional integration env

| Variable | Purpose |
| --- | --- |
| `APPSTORE_SEARCH_BASE_URL` | Enable sdkwork-search federation for catalog `listings.search` |
| `APPSTORE_SEARCH_CAPABILITY_IDS` | Comma-separated search capability scope filter |
| `APPSTORE_SEARCH_PROJECTION_ENABLED` | Upsert published listings into sdkwork-search backend index |
| `APPSTORE_SEARCH_BACKEND_BASE_URL` | sdkwork-search backend API base for document projection |
| `APPSTORE_SEARCH_INDEX_ID` | Target search index id for listing documents |
| `APPSTORE_MARKET_PROVIDER_ENABLED` | Enable external market channel provider bridge |
| `APPSTORE_MARKET_APPLE_SUBMIT_URL` | Apple App Store HTTP relay submit endpoint |
| `APPSTORE_MARKET_GOOGLE_SUBMIT_URL` | Google Play HTTP relay submit endpoint |
| `VITE_APPSTORE_ABUSE_REPORT_EMAIL` | PC/H5 client fallback platform abuse report mailbox |
