# Crates

Rust implementation crates for SDKWork App Store.

## Planned Layers

- `sdkwork-api-appstore-standalone-gateway` - HTTP process host.
- `sdkwork-appstore-service-host` - in-process service composition, no HTTP routes.
- `sdkwork-appstore-*-service` - business use-case services.
- `sdkwork-appstore-repository-sqlx` - SQLx repository implementations for `appstore_*` tables.
- `sdkwork-routes-*-{app-api,backend-api,open-api}` - HTTP route adapters and route manifest sources.
- `sdkwork-appstore-analytics-worker` - metric and chart projection jobs.

## Integration Boundaries

The service host owns dependency adapter metadata under
`sdkwork-appstore-service-host/src/integrations/`. These modules describe
required and planned integration surfaces only; they do not construct SDK
clients yet.

- `appbase` - IAM/session/context dependency.
- `platform` - registered app registration and manifest projection dependency.
- `drive` - media, uploader, and release artifact dependency.
- `comments` - reviews, ratings, favorites, and visit history dependency.
- `commerce` - paid app/IAP product reference dependency.
- `notifications` - provider/event delivery integration.
- `search` - catalog index projection integration.
- `market_channels` - Apple, Google, enterprise, and external market connector ports.

Business crates should depend on service ports or injected adapters. They must
not copy dependency-owned APIs or call raw HTTP to fill missing SDK methods.

## Crate Inventory

- `sdkwork-api-appstore-standalone-gateway`
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
- `sdkwork-routes-appstore-catalog-app-api`
- `sdkwork-routes-listing-app-api`
- `sdkwork-routes-release-app-api`
- `sdkwork-routes-library-app-api`
- `sdkwork-routes-publisher-app-api`
- `sdkwork-routes-compliance-app-api`
- `sdkwork-routes-moderation-backend-api`
- `sdkwork-routes-appstore-catalog-backend-api`
- `sdkwork-routes-listing-backend-api`
- `sdkwork-routes-publisher-backend-api`
- `sdkwork-routes-market-backend-api`
- `sdkwork-routes-metrics-backend-api`
- `sdkwork-routes-release-open-api`
- `sdkwork-routes-appstore-catalog-open-api`
- `sdkwork-routes-listing-open-api`
- `sdkwork-routes-automation-open-api`

All crates are implemented with domain models, service logic, repository ports, route handlers, and integration connectors. See `IMPLEMENTATION_TODO.md` for detailed status.
