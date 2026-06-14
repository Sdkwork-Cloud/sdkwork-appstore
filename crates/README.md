# Crates

Rust implementation crates for SDKWork App Store.

## Planned Layers

- `sdkwork-appstore-api-server` - HTTP process host.
- `sdkwork-appstore-service-host` - in-process service composition, no HTTP routes.
- `sdkwork-appstore-*-service` - business use-case services.
- `sdkwork-appstore-repository-sqlx` - SQLx repository implementations for `appstore_*` tables.
- `sdkwork-router-*-{app-api,backend-api,open-api}` - HTTP route adapters and route manifest sources.
- `sdkwork-appstore-analytics-worker` - metric and chart projection jobs.

## Integration Boundaries

The service host owns dependency adapter metadata under
`sdkwork-appstore-service-host/src/integrations/`. These modules describe
required and planned integration surfaces only; they do not construct SDK
clients yet.

- `appbase` - IAM/session/context dependency.
- `platform` - PlusApp registration and manifest projection dependency.
- `drive` - media, uploader, and release artifact dependency.
- `comments` - reviews, ratings, favorites, and visit history dependency.
- `commerce` - paid app/IAP product reference dependency.
- `notifications` - provider/event delivery integration.
- `search` - catalog index projection integration.
- `market_channels` - Apple, Google, enterprise, and external market connector ports.

Business crates should depend on service ports or injected adapters. They must
not copy dependency-owned APIs or call raw HTTP to fill missing SDK methods.

## Crate Inventory

- `sdkwork-appstore-api-server`
- `sdkwork-appstore-service-host`
- `sdkwork-appstore-repository-sqlx`
- `sdkwork-appstore-analytics-worker`
- `sdkwork-appstore-publisher-service`
- `sdkwork-appstore-listing-service`
- `sdkwork-appstore-release-service`
- `sdkwork-appstore-catalog-service`
- `sdkwork-appstore-library-service`
- `sdkwork-appstore-moderation-service`
- `sdkwork-appstore-compliance-service`
- `sdkwork-appstore-market-service`
- `sdkwork-router-catalog-app-api`
- `sdkwork-router-listing-app-api`
- `sdkwork-router-release-app-api`
- `sdkwork-router-library-app-api`
- `sdkwork-router-publisher-app-api`
- `sdkwork-router-compliance-app-api`
- `sdkwork-router-moderation-backend-api`
- `sdkwork-router-catalog-backend-api`
- `sdkwork-router-listing-backend-api`
- `sdkwork-router-publisher-backend-api`
- `sdkwork-router-market-backend-api`
- `sdkwork-router-metrics-backend-api`
- `sdkwork-router-release-open-api`
- `sdkwork-router-catalog-open-api`
- `sdkwork-router-listing-open-api`
- `sdkwork-router-automation-open-api`

All crates are implemented with domain models, service logic, repository ports, route handlers, and integration connectors. See `IMPLEMENTATION_TODO.md` for detailed status.
