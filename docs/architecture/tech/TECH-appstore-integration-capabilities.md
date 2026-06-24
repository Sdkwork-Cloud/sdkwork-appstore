> Migrated from `docs/integration/appstore-integration-capabilities.md` on 2026-06-24.
> Owner: SDKWork maintainers

This document records the integration capability map for SDKWork App Store. The
App Store domain owns `appstore_*` data, `appstore.*` operations, and
`appstore.store.*` events. Dependency-owned APIs remain in their owning SDK
families and are consumed through SDKWork SDKs, composed wrappers, service ports,
or explicit upstream dependency surfaces.

## Boundary Rules

- All dependency integrations (appbase, Drive, comments, commerce) are consumed through provider port traits or connector traits defined in service crates.
- Appbase IAM, Drive upload/storage, comments/review threads, and commerce checkout/settlement remain outside App Store generated API authorities.
- Startup preflight validates required dependency adapter configurations (base URLs, API keys) before serving traffic.
- Dependency API exports are explicit; App Store SDK families remain owner-only.

## Capability Matrix

| Capability | Owner | App Store role | Runtime surface | Phase 1 policy |
| --- | --- | --- | --- | --- |
| `appbase` | `sdkwork-appbase` | IAM sessions, tenant, organization, user, request, and operator context. | app-api/backend-api dependency SDK or appbase Rust runtime. | Required; no local auth/session routes. |
| `platform` | `sdkwork-appbase` | PlusApp registration, app identity, manifest projection, workspace visibility. | appbase/platform dependency SDK or service port. | Required for publishable apps; references `plus_app_id`, `plus_app_key`, and `manifest_snapshot_json`. |
| `drive` | `sdkwork-drive` | Icons, screenshots, preview videos, install artifacts, release binaries, and moderation evidence media. | Drive app/backend SDK, Drive uploader, or server-side Drive service facade. | Required for rich listings and releases; App Store stores Drive references only. |
| `comments` | `sdkwork-comments` | Review threads, rating summaries, favorites, visit history, and abuse-report linkage. | comments app/backend SDK or service port. | Required for social proof; App Store stores `comments_thread_id` and cached aggregates. |
| `commerce` | `sdkwork-commerce` | Paid apps, in-app purchase product references, entitlement billing linkage. | commerce SDK or service port. | Optional in phase 1; no checkout, settlement, invoice, or payment routes in App Store. |
| `notifications` | SDKWork notification/event provider | Review decisions, release approval, install/update lifecycle, publisher alerts. | event bus, notification SDK, or provider adapter. | Planned; emit appstore events first, bind provider later. |
| `search` | SDKWork search/index provider | Catalog search, ranking projections, keyword indexing, category discovery. | search SDK, index writer, or async projection worker. | Planned; phase 1 uses App Store DB snapshots and deterministic ranking fields. |
| `market_channels` | App Store owned connector boundary | Apple App Store, Google Play, private enterprise channels, and external marketplace release projection. | connector service ports under App Store ownership; external provider SDKs later. | Planned; use `appstore_market_channel` and `appstore_market_release`, no connector implementation yet. |

## Surface Responsibilities

`appbase` supplies identity and context. App Store services consume typed
request/operator context and must not parse raw authorization headers, create
session endpoints, or infer tenants from request payloads.

`platform` supplies PlusApp lifecycle and manifest projection. App Store keeps
the store-facing listing, release, and catalog workflow while platform remains
the owner of app registration and runtime manifest authority.

`drive` owns upload, storage, media metadata, download grants, and artifact
lifecycle. App Store references Drive nodes/resources in listing and release
records instead of storing files or presign state.

`comments` owns user-generated review threads and social interaction primitives.
App Store can cache rating aggregates for sorting and display, but write-side
review behavior remains comments-owned.

`commerce` owns checkout, payment, invoices, settlement, refunds, and paid
entitlement financial state. App Store may link paid app or IAP product IDs, but
does not own money movement.

`notifications` is a delivery integration for state changes. App Store emits
domain events and later maps those events to notification templates and
audiences through a provider SDK.

`search` is a projection integration. App Store owns source catalog facts while
the search provider owns index operations and query infrastructure after the
projection adapter is implemented.

`market_channels` is an App Store connector boundary for external app markets.
The current database tables model channel metadata and release projection state;
future agents should add provider-specific connectors behind service ports.

## Implementation Status

- All required dependencies are bound through `sdkwork-appstore-service-host::integrations` connector traits and `sdkwork-appstore-api-server::bootstrap::adapters` configuration.
- Integration connector traits are defined for: comments, commerce, notifications, search, market_channels.
- Provider port traits are defined for each service: publisher, listing, release, catalog, library, moderation, compliance, market.
- Preflight validation checks required dependency adapter configurations before serving traffic.
- `specs/component.spec.json` should be updated when dependency SDKs become executable and verified.

