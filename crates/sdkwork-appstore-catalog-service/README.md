# sdkwork-appstore-catalog-service

Business service/use-case crate for App Store catalog workflows.

## Boundary

- Owns only this crate's SDKWork responsibility.
- Must preserve authored OpenAPI, database registry, and SDK family boundaries.
- Must not call raw HTTP, parse credential headers manually, or bypass generated/dependency SDKs.

## Implementation Status

All operations implemented with async hexagonal architecture:

| Operation | Method |
|---|---|
| appstore.catalog.home.retrieve | catalog_home_retrieve |
| appstore.catalog.categories.list | catalog_categories_list |
| appstore.catalog.categories.retrieve | catalog_categories_retrieve |
| appstore.catalog.collections.list | catalog_collections_list |
| appstore.catalog.collections.retrieve | catalog_collections_retrieve |
| appstore.catalog.featured.list | catalog_featured_list |
| appstore.catalog.charts.retrieve | catalog_charts_retrieve |
| appstore.catalog.listings.list | catalog_listings_search |
| appstore.catalog.collections.create | catalog_collections_create |
| appstore.catalog.collections.update | catalog_collections_update |
| appstore.catalog.collections.items.update | catalog_collections_items_upsert |
| appstore.catalog.featured.update | catalog_featured_upsert |
| appstore.catalog.categories.create | catalog_categories_create |
| appstore.catalog.categories.update | catalog_categories_update |
| appstore.metrics.listings.retrieve | metrics_listings_retrieve |
| appstore.catalog.public.featured.list | catalog_public_featured_list |
