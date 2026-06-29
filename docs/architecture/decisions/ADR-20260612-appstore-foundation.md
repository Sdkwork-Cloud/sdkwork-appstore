# ADR-20260612-appstore-foundation

Status: accepted  
Requirement: REQ-2026-APPSTORE-FOUNDATION  
Owner: sdkwork-appstore  
Date: 2026-06-12  
Specs: ARCHITECTURE_DECISION_SPEC.md, DOMAIN_SPEC.md, API_SPEC.md, DATABASE_SPEC.md, SDK_SPEC.md

## Context

`sdkwork-appstore` starts as an empty repository. SDKWork already defines `ecosystem` as the canonical domain for marketplace and app store capabilities in `DOMAIN_SPEC.md`, with planned appbase UI packages (`sdkwork-market-pc-react`, `sdkwork-plugin-pc-react`). Comments, Drive, IAM, and commerce are separate bounded contexts with L2/L3 maturity.

We need a store backend that mirrors professional marketplace patterns (Apple App Store Connect + storefront, Google Play Console + Play Store) without collapsing unrelated domains into one database.

## Decision

### 0. Phase strategy

- **Phase 1** is Rust route crates + services + SQLx repository + OpenAPI materialization.
- **Phase 2** is SDK generation and contract verification.
- **Java SaaS parity** is deferred and is not part of the current implementation scope.

### 1. Domain and ownership

- **Primary domain:** `ecosystem`
- **Repository product name:** `sdkwork-appstore`
- **Database prefix:** `appstore_`
- **Write ownership:** `sdkwork-appstore` services own store listing, release, catalog, library, moderation, and compliance tables.

### 2. Platform identity boundary

- PlusApp registration remains in **platform** / manifest pipeline (`APP_MANIFEST_SPEC.md`).
- Store listings reference `plus_app_id` and `plus_app_key` but do not duplicate manifest storage.
- Release artifacts store a `manifest_snapshot_json` for audit, while authoritative install metadata stays manifest-driven.

### 3. Integration boundaries

| Capability | Owner | Integration mode |
| --- | --- | --- |
| Auth/session | sdkwork-appbase | SDK dependency; no local auth routes |
| Reviews/ratings | sdkwork-comments | `comments_thread_id` + comments SDK |
| Media/binaries | sdkwork-drive | `drive_node_id`, `media_resource_id` |
| Paid apps/IAP | sdkwork-commerce (deleted) | Optional `commerce_product_id`; no checkout in store API |
| Notifications | sdkwork-appbase / messaging | Events only in phase 1 |

### 4. Runtime topology

```mermaid
flowchart TB
  subgraph clients [Clients - separate apps process]
    PC[PC Store UI]
    Mobile[Mobile Store UI]
    Console[Publisher Console UI]
    Admin[Operator Admin UI]
  end

  subgraph appstore [sdkwork-appstore]
    GW[sdkwork-appstore-standalone-gateway]
    SH[sdkwork-appstore-service-host]
    subgraph services [Domain services]
      PS[publisher-service]
      LS[listing-service]
      RS[release-service]
      CS[catalog-service]
      LIB[library-service]
      MS[moderation-service]
      CPS[compliance-service]
    end
    subgraph repos [SQLx repositories]
      R1[appstore-repository-sqlx]
    end
    AW[analytics-worker]
  end

  subgraph deps [Dependency platforms]
    IAM[sdkwork-iam]
    DRV[sdkwork-drive]
    CMT[sdkwork-comments]
    CMRC[sdkwork-commerce (deleted)]
  end

  PC --> GW
  Mobile --> GW
  Console --> GW
  Admin --> GW
  GW --> SH
  SH --> services
  services --> repos
  AW --> repos
  services --> IAM
  services --> DRV
  services --> CMT
  services -. optional .-> CMRC
```

Phase 1 delivers **contracts and crate map** only. Implementation mounts route crates:

| Route crate | Surface | Capability |
| --- | --- | --- |
| `sdkwork-routes-catalog-app-api` | app-api | catalog, search |
| `sdkwork-routes-listing-app-api` | app-api | listings, submissions |
| `sdkwork-routes-release-app-api` | app-api | releases (publisher) |
| `sdkwork-routes-library-app-api` | app-api | library, wishlist |
| `sdkwork-routes-publisher-app-api` | app-api | publisher profile |
| `sdkwork-routes-moderation-backend-api` | backend-api | moderation |
| `sdkwork-routes-catalog-backend-api` | backend-api | collections, featured |
| `sdkwork-routes-listing-backend-api` | backend-api | operator listing admin |
| `sdkwork-routes-release-open-api` | open-api | update check, artifact resolve |

### 5. API prefix lock

| Surface | Prefix | Authority |
| --- | --- | --- |
| Open API | `/store/v3/api` | `sdkwork-appstore-open-api` |
| App API | `/app/v3/api` | `sdkwork-appstore-app-api` |
| Backend API | `/backend/v3/api` | `sdkwork-appstore-backend-api` |

Operation IDs use `appstore.<resource>.<action>` vocabulary.

### 6. SDK families

| Family | Consumers |
| --- | --- |
| `sdkwork-appstore-sdk` | Update clients, public integrations, CI publish |
| `sdkwork-appstore-app-sdk` | Store apps, publisher console (user-facing) |
| `sdkwork-appstore-backend-sdk` | Operator admin, automation |

Declared SDK dependencies: `sdkwork-iam-app-sdk`, `sdkwork-comments-app-sdk`, `sdkwork-drive-app-sdk`.

### 7. Eventing

Domain events use prefix `appstore.store.*` with outbox pattern (implementation phase). Examples:

- `appstore.store.listing.published`
- `appstore.store.release.approved`
- `appstore.store.install.recorded`

## Alternatives

| Option | Why rejected |
| --- | --- |
| New domain `appstore` separate from `ecosystem` | Breaks DOMAIN_SPEC catalog; duplicates marketplace semantics |
| Store listings without PlusApp anchor | Cannot align with APP_MANIFEST_SPEC and multi-surface releases |
| Embed reviews in store tables | Violates sdkwork-comments ownership; duplicates moderation |
| Single monolithic `store` table with JSON blobs | Fails DATABASE_SPEC query columnization and L2 isolation |
| Open API at `/open/v3/api` | Less clear domain lock; `/store/v3/api` matches product identity |

## Consequences

**Benefits**

- Clear alignment with Apple/Google store separation: console metadata vs public storefront vs binary delivery.
- Reuses mature SDKWork foundations without forking IAM or comments.
- Generated SDKs give frontend/other processes stable integration seams.

**Costs**

- Cross-service orchestration for publish workflow (listing + release + compliance + moderation).
- Chart/search read models require worker projection latency.
- Java/Rust dual implementation tax for L3 moderation and download grants.

## Verification

- Schema registry �?migration SQL static review.
- OpenAPI prefix and operationId lint (implementation: `pnpm run sdk:check`).
- Dependency boundary test: no `/app/v3/api/auth/*` routes in appstore manifests.
- Contract test placeholders under `tests/` (implementation phase).

## Supersedes / Superseded By

None.
