# sdkwork-appstore-analytics-worker

Background worker skeleton for App Store metric and chart projections.

## Boundary

- Owns only this crate's SDKWork responsibility.
- Must preserve authored OpenAPI, database registry, and SDK family boundaries.
- Must not call raw HTTP, parse credential headers manually, or bypass generated/dependency SDKs.

## Implementation Status

- Listing metrics projection job defined.
- Chart projection job defined.
- Scheduler with configurable interval defined.
- Bootstrap config and repository wiring implemented.
