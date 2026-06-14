# App Store Service Interface Map

This document maps each route operation to its generated handler and service
method name. It is a handoff artifact for later implementation agents.

## sdkwork-appstore-catalog-service

| operationId | routeCrate | handler | serviceCrate | serviceMethod | TODO |
| --- | --- | --- | --- | --- | --- |
| `appstore.catalog.home.retrieve` | `sdkwork-router-catalog-app-api` | `catalog_home_retrieve` | `sdkwork-appstore-catalog-service` | `catalog_home_retrieve` | Implemented|
| `appstore.catalog.categories.list` | `sdkwork-router-catalog-app-api` | `catalog_categories_list` | `sdkwork-appstore-catalog-service` | `catalog_categories_list` | Implemented|
| `appstore.catalog.categories.retrieve` | `sdkwork-router-catalog-app-api` | `catalog_categories_retrieve` | `sdkwork-appstore-catalog-service` | `catalog_categories_retrieve` | Implemented|
| `appstore.catalog.collections.list` | `sdkwork-router-catalog-app-api` | `catalog_collections_list` | `sdkwork-appstore-catalog-service` | `catalog_collections_list` | Implemented|
| `appstore.catalog.collections.retrieve` | `sdkwork-router-catalog-app-api` | `catalog_collections_retrieve` | `sdkwork-appstore-catalog-service` | `catalog_collections_retrieve` | Implemented|
| `appstore.catalog.featured.list` | `sdkwork-router-catalog-app-api` | `catalog_featured_list` | `sdkwork-appstore-catalog-service` | `catalog_featured_list` | Implemented|
| `appstore.catalog.charts.retrieve` | `sdkwork-router-catalog-app-api` | `catalog_charts_retrieve` | `sdkwork-appstore-catalog-service` | `catalog_charts_retrieve` | Implemented|
| `appstore.catalog.listings.search` | `sdkwork-router-catalog-app-api` | `catalog_listings_search` | `sdkwork-appstore-catalog-service` | `catalog_listings_search` | Implemented|
| `appstore.catalog.collections.create` | `sdkwork-router-catalog-backend-api` | `catalog_collections_create` | `sdkwork-appstore-catalog-service` | `catalog_collections_create` | Implemented|
| `appstore.catalog.collections.update` | `sdkwork-router-catalog-backend-api` | `catalog_collections_update` | `sdkwork-appstore-catalog-service` | `catalog_collections_update` | Implemented|
| `appstore.catalog.collections.items.upsert` | `sdkwork-router-catalog-backend-api` | `catalog_collections_items_upsert` | `sdkwork-appstore-catalog-service` | `catalog_collections_items_upsert` | Implemented|
| `appstore.catalog.featured.upsert` | `sdkwork-router-catalog-backend-api` | `catalog_featured_upsert` | `sdkwork-appstore-catalog-service` | `catalog_featured_upsert` | Implemented|
| `appstore.catalog.categories.create` | `sdkwork-router-catalog-backend-api` | `catalog_categories_create` | `sdkwork-appstore-catalog-service` | `catalog_categories_create` | Implemented|
| `appstore.catalog.categories.update` | `sdkwork-router-catalog-backend-api` | `catalog_categories_update` | `sdkwork-appstore-catalog-service` | `catalog_categories_update` | Implemented|
| `appstore.metrics.listings.retrieve` | `sdkwork-router-metrics-backend-api` | `metrics_listings_retrieve` | `sdkwork-appstore-catalog-service` | `metrics_listings_retrieve` | Implemented|
| `appstore.catalog.public.featured.list` | `sdkwork-router-catalog-open-api` | `catalog_public_featured_list` | `sdkwork-appstore-catalog-service` | `catalog_public_featured_list` | Implemented|

## sdkwork-appstore-compliance-service

| operationId | routeCrate | handler | serviceCrate | serviceMethod | TODO |
| --- | --- | --- | --- | --- | --- |
| `appstore.compliance.profile.retrieve` | `sdkwork-router-compliance-app-api` | `compliance_profile_retrieve` | `sdkwork-appstore-compliance-service` | `compliance_profile_retrieve` | Implemented|
| `appstore.compliance.profile.update` | `sdkwork-router-compliance-app-api` | `compliance_profile_update` | `sdkwork-appstore-compliance-service` | `compliance_profile_update` | Implemented|
| `appstore.compliance.permissions.update` | `sdkwork-router-compliance-app-api` | `compliance_permissions_update` | `sdkwork-appstore-compliance-service` | `compliance_permissions_update` | Implemented|

## sdkwork-appstore-library-service

| operationId | routeCrate | handler | serviceCrate | serviceMethod | TODO |
| --- | --- | --- | --- | --- | --- |
| `appstore.library.items.list` | `sdkwork-router-library-app-api` | `library_items_list` | `sdkwork-appstore-library-service` | `library_items_list` | Implemented|
| `appstore.library.items.retrieve` | `sdkwork-router-library-app-api` | `library_items_retrieve` | `sdkwork-appstore-library-service` | `library_items_retrieve` | Implemented|
| `appstore.library.install` | `sdkwork-router-library-app-api` | `library_install` | `sdkwork-appstore-library-service` | `library_install` | Implemented|
| `appstore.library.uninstall` | `sdkwork-router-library-app-api` | `library_uninstall` | `sdkwork-appstore-library-service` | `library_uninstall` | Implemented|
| `appstore.library.updates.check` | `sdkwork-router-library-app-api` | `library_updates_check` | `sdkwork-appstore-library-service` | `library_updates_check` | Implemented|
| `appstore.wishlist.items.list` | `sdkwork-router-library-app-api` | `wishlist_items_list` | `sdkwork-appstore-library-service` | `wishlist_items_list` | Implemented|
| `appstore.wishlist.items.add` | `sdkwork-router-library-app-api` | `wishlist_items_add` | `sdkwork-appstore-library-service` | `wishlist_items_add` | Implemented|
| `appstore.wishlist.items.remove` | `sdkwork-router-library-app-api` | `wishlist_items_remove` | `sdkwork-appstore-library-service` | `wishlist_items_remove` | Implemented|
| `appstore.downloadGrants.create` | `sdkwork-router-library-app-api` | `download_grants_create` | `sdkwork-appstore-library-service` | `download_grants_create` | Implemented|
| `appstore.downloadGrants.consume` | `sdkwork-router-library-app-api` | `download_grants_consume` | `sdkwork-appstore-library-service` | `download_grants_consume` | Implemented|

## sdkwork-appstore-listing-service

| operationId | routeCrate | handler | serviceCrate | serviceMethod | TODO |
| --- | --- | --- | --- | --- | --- |
| `appstore.listings.retrieve` | `sdkwork-router-listing-app-api` | `listings_retrieve` | `sdkwork-appstore-listing-service` | `listings_retrieve` | Implemented|
| `appstore.listings.media.list` | `sdkwork-router-listing-app-api` | `listings_media_list` | `sdkwork-appstore-listing-service` | `listings_media_list` | Implemented|
| `appstore.listings.releases.list` | `sdkwork-router-listing-app-api` | `listings_releases_list` | `sdkwork-appstore-listing-service` | `listings_releases_list` | Implemented|
| `appstore.listings.create` | `sdkwork-router-listing-app-api` | `listings_create` | `sdkwork-appstore-listing-service` | `listings_create` | Implemented|
| `appstore.listings.update` | `sdkwork-router-listing-app-api` | `listings_update` | `sdkwork-appstore-listing-service` | `listings_update` | Implemented|
| `appstore.listings.localization.upsert` | `sdkwork-router-listing-app-api` | `listings_localization_upsert` | `sdkwork-appstore-listing-service` | `listings_localization_upsert` | Implemented|
| `appstore.listings.media.attach` | `sdkwork-router-listing-app-api` | `listings_media_attach` | `sdkwork-appstore-listing-service` | `listings_media_attach` | Implemented|
| `appstore.listings.media.remove` | `sdkwork-router-listing-app-api` | `listings_media_remove` | `sdkwork-appstore-listing-service` | `listings_media_remove` | Implemented|
| `appstore.listings.categories.bind` | `sdkwork-router-listing-app-api` | `listings_categories_bind` | `sdkwork-appstore-listing-service` | `listings_categories_bind` | Implemented|
| `appstore.listings.regions.update` | `sdkwork-router-listing-app-api` | `listings_regions_update` | `sdkwork-appstore-listing-service` | `listings_regions_update` | Implemented|
| `appstore.listings.submissions.create` | `sdkwork-router-listing-app-api` | `listings_submissions_create` | `sdkwork-appstore-listing-service` | `listings_submissions_create` | Implemented|
| `appstore.listings.admin.list` | `sdkwork-router-listing-backend-api` | `listings_admin_list` | `sdkwork-appstore-listing-service` | `listings_admin_list` | Implemented|
| `appstore.listings.admin.retrieve` | `sdkwork-router-listing-backend-api` | `listings_admin_retrieve` | `sdkwork-appstore-listing-service` | `listings_admin_retrieve` | Implemented|
| `appstore.listings.admin.visibility.update` | `sdkwork-router-listing-backend-api` | `listings_admin_visibility_update` | `sdkwork-appstore-listing-service` | `listings_admin_visibility_update` | Implemented|
| `appstore.listings.public.retrieve` | `sdkwork-router-listing-open-api` | `listings_public_retrieve` | `sdkwork-appstore-listing-service` | `listings_public_retrieve` | Implemented|

## sdkwork-appstore-market-service

| operationId | routeCrate | handler | serviceCrate | serviceMethod | TODO |
| --- | --- | --- | --- | --- | --- |
| `appstore.marketChannels.list` | `sdkwork-router-market-backend-api` | `market_channels_list` | `sdkwork-appstore-market-service` | `market_channels_list` | Implemented|
| `appstore.marketChannels.create` | `sdkwork-router-market-backend-api` | `market_channels_create` | `sdkwork-appstore-market-service` | `market_channels_create` | Implemented|
| `appstore.marketChannels.update` | `sdkwork-router-market-backend-api` | `market_channels_update` | `sdkwork-appstore-market-service` | `market_channels_update` | Implemented|
| `appstore.marketReleases.list` | `sdkwork-router-market-backend-api` | `market_releases_list` | `sdkwork-appstore-market-service` | `market_releases_list` | Implemented|
| `appstore.marketReleases.sync` | `sdkwork-router-market-backend-api` | `market_releases_sync` | `sdkwork-appstore-market-service` | `market_releases_sync` | Implemented|

## sdkwork-appstore-moderation-service

| operationId | routeCrate | handler | serviceCrate | serviceMethod | TODO |
| --- | --- | --- | --- | --- | --- |
| `appstore.moderation.queue.list` | `sdkwork-router-moderation-backend-api` | `moderation_queue_list` | `sdkwork-appstore-moderation-service` | `moderation_queue_list` | Implemented|
| `appstore.moderation.reviews.retrieve` | `sdkwork-router-moderation-backend-api` | `moderation_reviews_retrieve` | `sdkwork-appstore-moderation-service` | `moderation_reviews_retrieve` | Implemented|
| `appstore.moderation.reviews.assign` | `sdkwork-router-moderation-backend-api` | `moderation_reviews_assign` | `sdkwork-appstore-moderation-service` | `moderation_reviews_assign` | Implemented|
| `appstore.moderation.decisions.create` | `sdkwork-router-moderation-backend-api` | `moderation_decisions_create` | `sdkwork-appstore-moderation-service` | `moderation_decisions_create` | Implemented|

## sdkwork-appstore-publisher-service

| operationId | routeCrate | handler | serviceCrate | serviceMethod | TODO |
| --- | --- | --- | --- | --- | --- |
| `appstore.publishers.me.retrieve` | `sdkwork-router-publisher-app-api` | `publishers_me_retrieve` | `sdkwork-appstore-publisher-service` | `publishers_me_retrieve` | Implemented|
| `appstore.publishers.create` | `sdkwork-router-publisher-app-api` | `publishers_create` | `sdkwork-appstore-publisher-service` | `publishers_create` | Implemented|
| `appstore.publishers.update` | `sdkwork-router-publisher-app-api` | `publishers_update` | `sdkwork-appstore-publisher-service` | `publishers_update` | Implemented|
| `appstore.publishers.members.list` | `sdkwork-router-publisher-app-api` | `publishers_members_list` | `sdkwork-appstore-publisher-service` | `publishers_members_list` | Implemented|
| `appstore.publishers.members.invite` | `sdkwork-router-publisher-app-api` | `publishers_members_invite` | `sdkwork-appstore-publisher-service` | `publishers_members_invite` | Implemented|
| `appstore.publishers.verifications.submit` | `sdkwork-router-publisher-app-api` | `publishers_verifications_submit` | `sdkwork-appstore-publisher-service` | `publishers_verifications_submit` | Implemented|
| `appstore.publishers.admin.verify` | `sdkwork-router-publisher-backend-api` | `publishers_admin_verify` | `sdkwork-appstore-publisher-service` | `publishers_admin_verify` | Implemented|

## sdkwork-appstore-release-service

| operationId | routeCrate | handler | serviceCrate | serviceMethod | TODO |
| --- | --- | --- | --- | --- | --- |
| `appstore.releases.create` | `sdkwork-router-release-app-api` | `releases_create` | `sdkwork-appstore-release-service` | `releases_create` | Implemented|
| `appstore.releases.retrieve` | `sdkwork-router-release-app-api` | `releases_retrieve` | `sdkwork-appstore-release-service` | `releases_retrieve` | Implemented|
| `appstore.releases.update` | `sdkwork-router-release-app-api` | `releases_update` | `sdkwork-appstore-release-service` | `releases_update` | Implemented|
| `appstore.releases.notes.upsert` | `sdkwork-router-release-app-api` | `releases_notes_upsert` | `sdkwork-appstore-release-service` | `releases_notes_upsert` | Implemented|
| `appstore.releases.artifacts.attach` | `sdkwork-router-release-app-api` | `releases_artifacts_attach` | `sdkwork-appstore-release-service` | `releases_artifacts_attach` | Implemented|
| `appstore.releases.rollout.update` | `sdkwork-router-release-app-api` | `releases_rollout_update` | `sdkwork-appstore-release-service` | `releases_rollout_update` | Implemented|
| `appstore.releases.retire` | `sdkwork-router-release-app-api` | `releases_retire` | `sdkwork-appstore-release-service` | `releases_retire` | Implemented|
| `appstore.releases.checkUpdate` | `sdkwork-router-release-open-api` | `releases_check_update` | `sdkwork-appstore-release-service` | `releases_check_update` | Implemented|
| `appstore.artifacts.resolveDownload` | `sdkwork-router-release-open-api` | `artifacts_resolve_download` | `sdkwork-appstore-release-service` | `artifacts_resolve_download` | Implemented|
| `appstore.releases.public.retrieve` | `sdkwork-router-release-open-api` | `releases_public_retrieve` | `sdkwork-appstore-release-service` | `releases_public_retrieve` | Implemented|
| `appstore.publish.automation.submissions.create` | `sdkwork-router-automation-open-api` | `publish_automation_submissions_create` | `sdkwork-appstore-release-service` | `publish_automation_submissions_create` | Implemented|

