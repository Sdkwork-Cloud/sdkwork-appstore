> Migrated from `docs/requirements/REQ-2026-appstore-foundation.md` on 2026-06-24.
> Owner: SDKWork maintainers

# REQ-2026-APPSTORE-FOUNDATION

Status: accepted  
Owner: sdkwork-appstore  
Date: 2026-06-12  
Specs: REQUIREMENTS_SPEC.md, DOMAIN_SPEC.md, APP_MANIFEST_SPEC.md

## Problem

SDKWork needs a first-class application marketplace comparable to Apple App Store and Google Play: publisher workflows, listing metadata, multi-platform releases, discovery surfaces, user libraries, moderation, compliance disclosures, and update distribution �?without forking IAM, comments, Drive, or commerce ownership.

## Goals

1. Define L2 persistence and API contracts for appstore capabilities under local domain `appstore` extending standard `ecosystem`.
2. Support registered app-anchored listings with manifest-aligned release artifacts across web, mobile, desktop, and mini-program surfaces.
3. Expose three HTTP surfaces (open, app, backend) with generated SDK families.
4. Integrate reviews/ratings through `sdkwork-comments`, media through `sdkwork-drive`, auth through `sdkwork-appbase`.
5. Enable staged rollout, regional availability, charts/collections, and update checks.

## Non-Goals (this phase)

- Frontend `apps/` implementation (handled elsewhere).
- Payment settlement and IAP purchase flows (commerce integration stub only).
- Full Java SaaS implementation (contracts first; Rust/Java parity planned).
- Production deployment topology.

## Personas

| Persona | Primary surface | Core jobs |
| --- | --- | --- |
| End user | app-api | Browse, install, update, wishlist, review |
| Publisher/developer | app-api | Manage listings, submit releases, view analytics |
| Store operator | backend-api | Moderate, feature, manage taxonomy, audit |
| Update client / CI | open-api | Check updates, resolve artifacts, automate publish |

## Capability Requirements

### Publisher

- Create publisher profile bound to organization and owner user.
- Invite publisher members with roles (owner, admin, developer, analyst).
- Track business verification states.

### Listing

- Bind one listing to one registered app (`app_id`, `app_key`).
- Localize title, subtitle, descriptions, keywords per locale.
- Attach icon, screenshots, preview video via Drive-backed media.
- Assign categories and tags; declare regional availability.
- Link comments thread for public reviews.

### Release

- Manage channels: production, beta, internal.
- Publish version name/code/build with manifest snapshot.
- Attach platform/architecture artifacts (AAB/APK/IPA/MSI/DMG/HAP/web bundle).
- Support phased rollout percentage and pause/resume.

### Catalog

- Browse categories, editorial collections, featured slots, charts.
- Search listings with locale-aware ranking inputs.
- Project public storefront only for `published` + visible listings.

### Library

- Record install/update/uninstall events per user/device/platform.
- Maintain user library and wishlist.
- Issue time-bound download grants for artifact retrieval.

### Moderation & compliance

- Submission queue with SLA priority.
- Immutable moderation decisions with policy references.
- Privacy nutrition labels, content rating questionnaire, permission disclosures.

### Analytics

- Daily listing metrics and chart snapshots (read models).

## Non-Functional Requirements

| NFR | Target |
| --- | --- |
| Tenant isolation | All queries scoped by `tenant_id`; org scope where applicable |
| Idempotency | All mutating publisher/submission/install APIs |
| Contract level | API L2 minimum; moderation/download L3 |
| Parity | Rust local/private shares paths and operationIds; Java SaaS parity is deferred |
| Pagination | Cursor-based for list endpoints |
| Audit | Moderation decisions and download grants immutable |

## Acceptance Criteria

- [x] `database/contract/schema.yaml` and migration SQL align (`pnpm run db:validate`).
- [ ] OpenAPI contracts exist for app, backend, and open surfaces with locked prefixes.
- [ ] `docs/api/operation-catalog.md` lists every planned operationId.
- [ ] SDK manifests trace to API authorities under `sdks/`.
- [ ] Architecture ADR accepted with dependency boundaries documented.
- [ ] No IAM login endpoints duplicated in appstore APIs.
- [ ] Reviews/ratings delegated to comments integration fields only.

## Traceability

| Requirement | Database | API tag | SDK namespace |
| --- | --- | --- | --- |
| Publisher | `appstore_publisher*` | `publishers` | `store.publishers` |
| Listing | `appstore_listing*` | `listings` | `store.listings` |
| Release | `appstore_release*` | `releases` | `store.releases` |
| Catalog | `appstore_catalog*` | `catalog` | `store.catalog` |
| Library | `appstore_user_*` | `library` | `store.library` |
| Moderation | `appstore_moderation*` | `moderation` | `store.moderation` |
| Compliance | `appstore_compliance*` | `compliance` | `store.compliance` |

