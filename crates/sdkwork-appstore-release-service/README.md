# sdkwork-appstore-release-service

Business service/use-case crate for App Store release workflows.

## Boundary

- Owns only this crate's SDKWork responsibility.
- Must preserve authored OpenAPI, database registry, and SDK family boundaries.
- Must not call raw HTTP, parse credential headers manually, or bypass generated/dependency SDKs.

## Implementation Status

All operations implemented with async hexagonal architecture:

| Operation | Method |
|---|---|
| appstore.releases.create | releases_create |
| appstore.releases.retrieve | releases_retrieve |
| appstore.releases.update | releases_update |
| appstore.releases.notes.upsert | releases_notes_upsert |
| appstore.releases.artifacts.attach | releases_artifacts_attach |
| appstore.releases.rollout.update | releases_rollout_update |
| appstore.releases.retire | releases_retire |
| appstore.releases.checkUpdate | releases_check_update |
| appstore.artifacts.resolveDownload | artifacts_resolve_download |
| appstore.releases.public.retrieve | releases_public_retrieve |
| appstore.publish.automation.submissions.create | publish_automation_submissions_create |
