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
| `sdkwork-cloudrouter` (notifications) | Integrated | PC/H5 inbox via `@sdkwork/cloudrouter-app-sdk` + `appstore-notification-core` |
| `sdkwork-cloudrouter` (commerce checkout) | Integrated | PC/H5 paid listing acquire via `@sdkwork/cloudrouter-app-sdk/domains` + `appstore-listing-acquire-core` |
| `sdkwork-search` | Integrated (optional) | `SearchFederationAdapter` + SQL fallback; env `APPSTORE_SEARCH_BASE_URL` |
| `sdkwork-appbase` | Integrated |
| `sdkwork-market_channels` | Integrated (handoff) | Market channel HTTP relay connectors (Apple/Google/Enterprise) wired via `APPSTORE_MARKET_*_SUBMIT_URL`; live provider handoff pending external endpoints | Publisher console bootstraps via appbase shell; app-sdk composition validated by check:app-sdk-consumers |
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

- Commerce: cart line-item body on cloudrouter `/cart/items` when wire exposes product attachment (checkout session + best-effort quote wired today)
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

## 2026-08-03 — 已认证端到端验证(真实 IAM 双 token + PostgreSQL 种子数据)

- 建立 IAM 测试账号流程:dev bootstrap Access-Token(alg:none)→ `registrations.create` → `sessions.create`(grantType=password)→ 真实 HS256 双 token;appstore 网关(18090)与 IAM(3900)共享 dev PostgreSQL。
- **修复系统性缺陷:全表时间列 TEXT↔DateTime<Utc> 解码不匹配**(SQLite 测试掩盖)。新增迁移 `0004_appstore_timestamps_timestamptz.up.sql`(143 列 TEXT→TIMESTAMPTZ,ISO 文本无损转换),baseline 0001 同步 124 列;种子 `CURRENT_TIMESTAMP::text` 去 cast。
- 修复枚举/数据不一致:collection_status `active`→`published`(CollectionStatus 枚举)、listing_status `published`→`active`(对齐 ListingStatus 枚举与 listing-repository 查询,catalog 搜索过滤同步)、listing_type `APP`→`app`(枚举补大小写别名);榜单快照补 en-US locale(home 默认请求 en-US);home 服务层尊重请求 locale(不再硬编码)。
- 修复查询缺陷:`l.icon_media_resource_id` 列不存在(经 appstore_listing_media 子查询取 ICON)、templates 列表 bind 顺序颠倒(user_id/tenant_id 互换)、`COALESCE(...)` 未别名(sqlx 按列名解码失败)。
- 修复写入缺陷:`appstore_app_template_usage` INSERT 列与 baseline 表不符(去掉 data_scope/updated_at/version,补 user_id);jsonb 列绑定新增 `?jsonb` 方言标记(`adapt_sql` Postgres→`$n::jsonb`、SQLite→`?`);`UpdateCheckItem` 补 camelCase serde(契约 `installedVersionCode`)。
- 路由清单重建:gateway_manifest_parity 测试原指向不存在的路径(预置损坏);重写为扫描 `sdkwork-routes-*/src/runtime.rs`,重新生成 16 个 per-crate manifest + combined manifest(92→103 路由,含模板/评分/反馈新路由与 store/backend 既有缺口)。
- 错误可观测性:routes-common 内部错误映射补 `tracing::error!`(此前 500 静默吞错,无法诊断)。
- 验证:home/categories(15)/search(20)/search ids/charts/featured(3)/collections(4)/templates(11)/template retrieve/listing retrieve+media+similar+releases/ratings(3,含写入)/feedback(写入)/template usage(写入,cloneCount=1)/library/wishlist 全部 200 真实种子数据;`cargo test --workspace` 93 套件全过;`cargo fmt --check`、PC tsc、api-operation-patterns/api-response-envelope/pagination/app-sdk-consumer-imports 全过。
- 遗留(依赖域):`appstore.catalog.read` 等 appstore 权限未注册进 IAM 角色目录(app_user 角色),trending/suggestions/recently_updated/运营搜索返回 403——PC 前端不使用这些接口,不阻塞本集成;需 IAM owner 在 role_catalog/permission 注册表补 appstore.* 权限,并在 sdkwork.app.config.json 补 backend 段(appId/tenantId/accessTokenPermissionScope)完成应用注册。

## 2026-08-03 — 第二轮端到端验证(发布者/库/收藏/版本/下载授权/评论降级)

- 补充验证写入流程:发布者控制台(publishers/me、bootstrapApp 应用+上架条目创建、publishers/me/listings)、库安装(+install_event)/卸载、收藏夹增删、搜索历史、发布说明更新、rollout(staged)、release retire、下载授权创建、评分重算(平均分随写入更新 4.7/3)。
- 业务校验验证(正确返回):已发布条目提交审核 422、retired 版本更新说明/rollout 422、组织已有发布者 409。
- **评论域降级处理**:appstore 种子此前写入的 comments_thread_id(如 thread-app-qwen)在 comments 域并不存在(comments_thread 0 行,且本工作区无 comments 网关可运行——仅有 database-host/repository 库)。已清空种子与线上 47 条 listing 的线程 id,PC 详情页评论走设计降级路径(纯评分渲染);comments 服务上线并建好线程后恢复 id 即可启用评论+评分合并。
- PC 开发服务器(3000)以 standalone 配置重启:`VITE_SDKWORK_APPSTORE_APP_API_BASE_URL=http://127.0.0.1:18090`、`VITE_SDKWORK_IAM_APP_API_BASE_URL=http://127.0.0.1:3900`,前端 SDK 直连真实后端;浏览器 webview 仍不可附着(环境限制),UI 渲染验证待环境就绪。

## 2026-08-04 — 全新安装生命周期验证 + 种子缺陷修复

- 临时 schema 全生命周期验证(psql 按序执行):baseline 0001 → 迁移 0002/0003/0004 → 种子 001-009,全部干净通过;最终状态 49 表、0 个 TEXT 时间列、种子计数完整(47 应用/47 上架/11 模板/6 榜单(zh-CN+en-US)/10 热搜/10 库/12 评分/3 精选/4 合集)。验证后 DROP。
- **修复种子缺陷**:清理 comments_thread_id 的 sed 产生 `'',,` 双逗号(47 处),全新安装时 005 语法错误 — 已修复(对全新安装路径的验证直接暴露了此缺陷)。
- 说明:standalone 网关配置校验强制 SDKWORK_DATABASE_SCHEMA 必须等于库名(工作区治理),无法用环境变量指向其他 schema;全新安装的数据服务能力由 dev schema(相同基线/迁移/种子构建)+ 本验证共同证明。

## 2026-08-04 — pnpm verify 设计验证全绿 + 网关结构规范化

- 设计验证(App Store design verification)修复至全绿:操作目录 +7(模板 4/反馈 1/评分 2,103 个 operationId);接口映射表 +7;schema-registry 补 2 表(49)+ 迁移镜像 0003/0004 + file 引用;表目录文档 49 节;sdk-manifest ×3 generationInputSpec 指向规范契约;验证器 routeCrates 命名对齐实际 crate(appstore-catalog)。
- 网关结构规范化(行为不变):新增 bootstrap/{mod,config,adapters,state,routers}、server/mod、preflight/{mod,dependency_surfaces}、health 模块,main.rs 改为组合式;依赖面(drive/platform/search/market_channels)启动时声明与日志。零警告编译。
- 回归:fmt/93 测试套件全过;网关重启后 home/search/templates/listing/ratings/charts/collections/categories 全绿。
- 遗留(预先存在,非本会话引入):verify-repo 组合检查 — PC 嵌套 pnpm-workspace.yaml、包跨根导入(src/types 等)、H5 moduleCatalogRefs 未解析(均位于 HEAD 基线);浏览器 UI 渲染验证仍受 webview 环境限制。
