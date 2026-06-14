# sdkwork-appstore-repository-sqlx

SQLx repository implementation skeleton for appstore_* tables.

## Boundary

- Owns only this crate's SDKWork responsibility.
- Must preserve authored OpenAPI, database registry, and SDK family boundaries.
- Must not call raw HTTP, parse credential headers manually, or bypass generated/dependency SDKs.

## Implementation Status

- Publisher repository port implemented with async trait (find, insert, update, member, verification CRUD).
- Row types defined for publisher, publisher_member, publisher_verification.
- Row mapper converts between DB rows and domain models.
- Schema constants for all appstore_* tables defined.
- Tenant and organization predicates enforced on all queries.
