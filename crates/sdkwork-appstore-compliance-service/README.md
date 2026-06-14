# sdkwork-appstore-compliance-service

Business service/use-case crate for App Store compliance workflows.

## Boundary

- Owns only this crate's SDKWork responsibility.
- Must preserve authored OpenAPI, database registry, and SDK family boundaries.
- Must not call raw HTTP, parse credential headers manually, or bypass generated/dependency SDKs.

## Implementation Status

All operations implemented with async hexagonal architecture:

| Operation | Method |
|---|---|
| appstore.compliance.profile.retrieve | compliance_profile_retrieve |
| appstore.compliance.profile.update | compliance_profile_update |
| appstore.compliance.permissions.update | compliance_permissions_update |
