# sdkwork-appstore-market-service

Business service/use-case crate for App Store market workflows.

## Boundary

- Owns only this crate's SDKWork responsibility.
- Must preserve authored OpenAPI, database registry, and SDK family boundaries.
- Must not call raw HTTP, parse credential headers manually, or bypass generated/dependency SDKs.

## Implementation Status

All operations implemented with async hexagonal architecture:

| Operation | Method |
|---|---|
| appstore.marketChannels.list | market_channels_list |
| appstore.marketChannels.create | market_channels_create |
| appstore.marketChannels.update | market_channels_update |
| appstore.marketReleases.list | market_releases_list |
| appstore.marketReleases.sync | market_releases_sync |
