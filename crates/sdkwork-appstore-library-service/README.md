# sdkwork-appstore-library-service

Business service/use-case crate for App Store library workflows.

## Boundary

- Owns only this crate's SDKWork responsibility.
- Must preserve authored OpenAPI, database registry, and SDK family boundaries.
- Must not call raw HTTP, parse credential headers manually, or bypass generated/dependency SDKs.

## Implementation Status

All operations implemented with async hexagonal architecture:

| Operation | Method |
|---|---|
| appstore.library.items.list | library_items_list |
| appstore.library.items.retrieve | library_items_retrieve |
| appstore.library.install | library_install |
| appstore.library.uninstall | library_uninstall |
| appstore.library.updates.check | library_updates_check |
| appstore.wishlist.items.list | wishlist_items_list |
| appstore.wishlist.items.create | wishlist_items_add |
| appstore.wishlist.items.delete | wishlist_items_remove |
| appstore.downloadGrants.create | download_grants_create |
| appstore.downloadGrants.consume | download_grants_consume |
