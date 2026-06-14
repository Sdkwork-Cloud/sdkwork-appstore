# sdkwork-appstore-service-host

In-process service container skeleton for local/private/native App Store runtimes.

## Boundary

- Owns only this crate's SDKWork responsibility.
- Must preserve authored OpenAPI, database registry, and SDK family boundaries.
- Must not call raw HTTP, parse credential headers manually, or bypass generated/dependency SDKs.

## Implementation Status

- Integration registry with 8 capability definitions (appbase, platform, drive, comments, commerce, notifications, search, market_channels).
- Connector traits defined for comments, commerce, notifications, search, and market_channels.
- Service container and bootstrap wiring implemented.
- Adapter config loading from environment variables.
