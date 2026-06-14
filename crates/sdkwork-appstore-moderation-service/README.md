# sdkwork-appstore-moderation-service

Business service/use-case crate for App Store moderation workflows.

## Boundary

- Owns only this crate's SDKWork responsibility.
- Must preserve authored OpenAPI, database registry, and SDK family boundaries.
- Must not call raw HTTP, parse credential headers manually, or bypass generated/dependency SDKs.

## Implementation Status

All operations implemented with async hexagonal architecture:

| Operation | Method |
|---|---|
| appstore.moderation.queue.list | moderation_queue_list |
| appstore.moderation.reviews.retrieve | moderation_reviews_retrieve |
| appstore.moderation.reviews.assign | moderation_reviews_assign |
| appstore.moderation.decisions.create | moderation_decisions_create |
