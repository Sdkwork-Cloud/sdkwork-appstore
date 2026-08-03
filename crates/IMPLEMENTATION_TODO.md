# SDKWork App Store Implementation Status

Active alignment tracker for `sdkwork-appstore` against `sdkwork-specs`.

Last updated: 2026-08-03

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

## Database (PostgreSQL Authority)

| Item | Status |
| --- | --- |
| Dialect SQL adaptation | Implemented (`repository-sqlx/db/dialect.rs`) |
| Unified `AppstoreSqlxDb` pool | Implemented |
| `BindValue` reference / optional binds | Implemented (Postgres + SQLite) |
| Gateway `SDKWORK_DATABASE_*` | Canonical workspace PostgreSQL profile; SQLite server fallback removed |
| PostgreSQL CI matrix | Required release evidence |

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

## 2026-08-03 — PC 前后端联调完成(storefront 全流程)

- App API 扩展至 68 个操作(61 + 7):`appstore.catalog.templates.list/retrieve/create`、`appstore.catalog.templates.usage.create`、`appstore.catalog.feedback.create`、`appstore.listings.ratings.list/update`;`catalog.listings.list` 支持 `ids` 查询参数;`ListingSummary` 新增 `developerName/description/currentVersion/fileSizeBytes/whatsNewSummary/releasedAt`;`UpdateAvailable` 新增 `releaseNotes/releasedAt`。
- 新增迁移 `0003_appstore_rating_feedback.up.sql`(`appstore_listing_rating`、`appstore_feedback`);修复迁移 `0002` 命名(`.up.sql` 约定,此前 5 张表从未应用);contract 注册 49 表。
- 种子数据补齐(zh-CN):47 个 storefront 应用 + 本地化 + 媒体 + 发布版本与版本说明、4 个编辑合集、3 个精选位、top/free/paid 榜单快照、10 个热搜词、11 个模板/插件、演示用户库/收藏/评分。
- 后端依赖升级:repository-sqlx/assembly/analytics-worker 迁移 sqlx 0.9(对齐 sdkwork-database 工作区);executor 动态 SQL 包装 `AssertSqlSafe`。
- PC 前端:9 个 service 全部改为 bootstrap 注入的 service port(AppStore/Templates/Plugins/Console/Install/Admin/AIHub),对接 `@sdkwork/appstore-app-sdk`(含新 composed facade 方法)+ `@sdkwork/comments-app-sdk`(评论/点赞)+ `@sdkwork/agents-app-sdk`(模型目录);AdminMonitor 经 `sdkwork-appstore-pc-admin-core`(backend-admin 边界)接入 backend SDK;域外能力(API 凭证/安全策略/集群节点/系统审计)按规范 fail-closed 明确报错。
- 验证:PC `tsc`/`test`/`build` 通过;`cargo test --workspace` 通过;`cargo fmt --check` 通过;check-app-sdk-consumer-imports / check-pagination / check-api-response-envelope / check-api-operation-patterns / check-frontend-composition 全部通过;standalone 网关 18090 运行正常,68 个 app-api 路由 + 35 个 backend/open 路由全部挂载。
