# SDKWork App Store

Professional application marketplace for the SDKWork ecosystem, aligned with industry-grade
store patterns (Apple App Store, Google Play) while following SDKWork standards.

## Scope

This repository owns the **appstore** bounded context:

- Publisher onboarding and verification
- Store listings, localization, and media
- Release/version lifecycle, artifacts, rollout, and update checks
- Catalog discovery (categories, collections, charts, featured, search)
- User library, wishlist, and download grants
- Moderation and compliance (privacy labels, content ratings, permissions)
- Store analytics snapshots

It does **not** own:

- IAM login/session (`sdkwork-appbase`)
- PlusApp registration projection (`platform` / app manifest pipeline)
- Comment threads, star ratings, favorites (`sdkwork-comments`)
- Paid checkout and IAP settlement (`sdkwork-commerce`, integration only)
- Binary bytes (`sdkwork-drive`)

## Standard Layout

```text
sdkwork-appstore/
  apis/                 # Authored HTTP/event contracts
  crates/               # Rust services, repositories, route crates (implementation phase)
  docs/                 # Architecture, ADRs, requirements, API/SDK design notes
  sdks/                 # SDK families and generation inputs
  specs/                # Domain, database registry, component spec
  tools/                # Generation and verification scripts (implementation phase)
```

Frontend application roots live under `apps/` and are developed in a separate process.

## Canonical Names

| Concept | Value |
| --- | --- |
| Product repository | `sdkwork-appstore` |
| Local domain | `appstore` extends standard `ecosystem` |
| Database prefix | `appstore_` |
| Open API prefix | `/store/v3/api` |
| App API prefix | `/app/v3/api` |
| Backend API prefix | `/backend/v3/api` |
| Open API authority | `sdkwork-appstore-open-api` |
| App API authority | `sdkwork-appstore-app-api` |
| Backend API authority | `sdkwork-appstore-backend-api` |
| Public SDK family | `sdkwork-appstore-sdk` |
| App SDK family | `sdkwork-appstore-app-sdk` |
| Backend SDK family | `sdkwork-appstore-backend-sdk` |

## Design Entry Points

- Architecture: `docs/architecture/appstore-architecture.md`
- ADR: `docs/architecture/decisions/ADR-20260612-appstore-foundation.md`
- Requirements: `docs/requirements/REQ-2026-appstore-foundation.md`
- Database registry: `specs/database/schema-registry.yaml`
- Database migration: `specs/database/migrations/0001_appstore_foundation.sql`
- API operation catalog: `docs/api/operation-catalog.md`
- SDK design: `docs/sdk/sdk-design.md`
- Integration capabilities: `docs/integration/appstore-integration-capabilities.md`
- Rust crate map: `crates/README.md`
- Implementation handoff TODO: `crates/IMPLEMENTATION_TODO.md`

## Implementation Status

The backend implementation is complete with all 8 service crates, 8 SQLx repositories, 16 route crates, API server, service host, and analytics worker fully implemented. All business logic, domain models, repository persistence, and route handlers are in place.

Integration capabilities are represented as service-host connector traits and API-server preflight validation. Required integrations (`appbase`, `platform`, `drive`, `comments`) have provider ports and adapter configs; optional integrations (`commerce`, `notifications`, `search`, `market_channels`) have connector trait definitions ready for concrete SDK-backed implementations.

## Standards

Follow `../sdkwork-specs/README.md`. Key specs for this repository:

- `DOMAIN_SPEC.md`, `DATABASE_SPEC.md`, `API_SPEC.md`, `SDK_SPEC.md`
- `SDK_WORKSPACE_GENERATION_SPEC.md`, `SDKWORK_WORKSPACE_SPEC.md`
- `APP_MANIFEST_SPEC.md`, `DRIVE_SPEC.md`, `MEDIA_RESOURCE_SPEC.md`
- `IAM_LOGIN_INTEGRATION_SPEC.md`, `EVENT_SPEC.md`, `SECURITY_SPEC.md`

## Documentation Canon

- [docs/README.md](docs/README.md)
- [docs/product/prd/PRD.md](docs/product/prd/PRD.md)
- [docs/architecture/tech/TECH_ARCHITECTURE.md](docs/architecture/tech/TECH_ARCHITECTURE.md)

