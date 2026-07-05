# SDKWork App Store Architecture

Version: 1.0.0  
Status: active????????  
Updated: 2026-07-05  
Related: ADR-20260612-appstore-foundation, REQ-2026-appstore-foundation

## Canonical Documents

???????????**?????????????????**

| ?? | ?? |
| --- | --- |
| ?? PRD | [product/prd/PRD.md](../product/prd/PRD.md) |
| UI/UX ???? | [product/design/UI_DESIGN_SPEC.md](../product/design/UI_DESIGN_SPEC.md) |
| ???? | [architecture/tech/TECH_ARCHITECTURE.md](tech/TECH_ARCHITECTURE.md) |
| API ???? | [api/operation-catalog.md](../api/operation-catalog.md) |
| ?????? | [database/appstore-table-catalog.md](../database/appstore-table-catalog.md) |

## 1. Product Positioning

SDKWork App Store ? SDKWork ???**????????????**??? Apple App Store?Google Play?????????????????????????

| ???? | SDKWork ?? |
| --- | --- |
| App Store / Play Store ?? | Catalog + Listing + Library?app-api? |
| App Store Connect / Play Console | Publisher Console?app-api? |
| App Review / Play Policy | Moderation + Compliance?backend-api? |
| TestFlight / ???? | Release channels + beta_invite + rollout |
| ?? API | Open API check_update + resolve_download |

## 2. Layered Architecture

```text
????apps/sdkwork-appstore-pc | h5?
  ? @sdkwork/appstore-app-sdk
sdkwork-appstore-standalone-gateway
  ?
sdkwork-appstore-service-host
  publisher | listing | release | catalog | library
  moderation | compliance | analytics
  ?                    ?
repository-sqlx     ?? SDK ???IAM/Drive/Comments/Search/...?
  ?
PostgreSQL / SQLite
  ?
sdkwork-appstore-analytics-worker???/??/???
```

## 3. Capability Modules

| ?? | ?? | ????? |
| --- | --- | --- |
| Publisher | publisher-service | `appstore_publisher*` |
| Listing | listing-service | `appstore_listing*` |
| Release | release-service | `appstore_release*` |
| Catalog | catalog-service | `appstore_catalog*` |
| Library | library-service | `appstore_user_*`?`appstore_download_grant` |
| Moderation | moderation-service | `appstore_moderation*` |
| Compliance | compliance-service | `appstore_compliance*` |
| Analytics | analytics-worker | `appstore_listing_metric_snapshot`?chart/trending |
| Market | market-service | `appstore_market_*` |

## 4. Cross-Domain Boundaries

| ? | ?? | appstore ?? |
| --- | --- | --- |
| IAM | appbase | ??????????? |
| ???? | platform | listing ?? app_id |
| ??/?? | drive | ?? drive_id |
| ??/?? | comments | comments_thread_id + ???? |
| ??/IAP | commerce | entitlement ?? + iap_item ?? |
| ???? | search | Phase 2 ???Phase 1 DB ?? |
| ?? | notifications | ?????? |

## 5. Client Applications

| ?? | ?? | ? |
| --- | --- | --- |
| sdkwork-appstore-pc | `apps/sdkwork-appstore-pc` | PC Web ?1280 |
| sdkwork-appstore-h5 | `apps/sdkwork-appstore-h5` | H5 / ?? <768 |

?? PRD ? UI ?????? `docs/product/prd/` ??? `docs/product/design/`?

## 6. Implementation Status

| ?? | ?? | ??? |
| --- | --- | --- |
| ???API/DB/SDK? | ???? | ?? migration ??? |
| ???? | ?? + ???? | ?? 95+ ?? |
| PC/H5 ?? | ?? + ???? | P0 ??????? |
| ???? | ?? token ?? | ??? + ???? |

?? [crates/IMPLEMENTATION_TODO.md](../../crates/IMPLEMENTATION_TODO.md)?
