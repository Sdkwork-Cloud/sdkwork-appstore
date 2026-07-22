# sdkwork-appstore-publisher-service

Business service/use-case crate for App Store publisher workflows.

## Boundary

- Owns only this crate's SDKWork responsibility.
- Must preserve authored OpenAPI, database registry, and SDK family boundaries.
- Must not call raw HTTP, parse credential headers manually, or bypass generated/dependency SDKs.

## Implementation Status

All operations implemented with async hexagonal architecture:

| Operation | Method |
|---|---|
| appstore.publishers.me.retrieve | publishers_me_retrieve |
| appstore.publishers.create | publishers_create |
| appstore.publishers.update | publishers_update |
| appstore.publishers.members.list | publishers_members_list |
| appstore.publishers.members.create | publishers_members_invite |
| appstore.publishers.verifications.create | publishers_verifications_submit |
| appstore.publishers.admin.verify | publishers_admin_verify |
