# sdkwork-appstore-listing-service

Business service/use-case crate for App Store listing workflows.

## Boundary

- Owns only this crate's SDKWork responsibility.
- Must preserve authored OpenAPI, database registry, and SDK family boundaries.
- Must not call raw HTTP, parse credential headers manually, or bypass generated/dependency SDKs.

## Implementation Status

All operations implemented with async hexagonal architecture:

| Operation | Method |
|---|---|
| appstore.listings.retrieve | listings_retrieve |
| appstore.listings.media.list | listings_media_list |
| appstore.listings.releases.list | listings_releases_list |
| appstore.listings.create | listings_create |
| appstore.listings.update | listings_update |
| appstore.listings.localization.update | listings_localization_upsert |
| appstore.listings.media.create | listings_media_attach |
| appstore.listings.media.delete | listings_media_remove |
| appstore.listings.categories.update | listings_categories_bind |
| appstore.listings.regions.update | listings_regions_update |
| appstore.listings.submissions.create | listings_submissions_create |
| appstore.listings.admin.list | listings_admin_list |
| appstore.listings.admin.retrieve | listings_admin_retrieve |
| appstore.listings.admin.visibility.update | listings_admin_visibility_update |
| appstore.listings.public.retrieve | listings_public_retrieve |
