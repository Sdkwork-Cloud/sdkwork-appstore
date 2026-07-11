# SDKWork App Store Common

Shared, non-runnable package root for SDKWork App Store.

## Purpose

This root owns cross-architecture TypeScript packages used by both PC and H5 App Store surfaces.

## Packages

| Package | Purpose |
| --- | --- |
| `@sdkwork/appstore-library-core` | User library state and update helpers. |
| `@sdkwork/appstore-listing-acquire-core` | Listing acquire, checkout, install state, and pricing helpers. |
| `@sdkwork/appstore-listing-support-core` | Listing support/report helpers. |
| `@sdkwork/appstore-notification-core` | Notification service helpers. |
| `@sdkwork/appstore-publisher-console-core` | Publisher console services and hooks shared by PC and H5. |
| `@sdkwork/appstore-search-core` | Search terms and listing hit contracts. |

## Boundaries

- This root is not a runnable client surface.
- PC-only UI packages stay under `../sdkwork-appstore-pc/packages/`.
- H5-only UI packages stay under `../sdkwork-appstore-h5/packages/`.
- Claw Router dependency SDKs are consumed from the sibling `sdkwork-clawrouter` composed package through repository-root workspace membership, not through a local proxy package.
- Global standards are linked through local component specs; do not copy global `*_SPEC.md` files here.

## Verification

```bash
pnpm --filter @sdkwork/appstore-publisher-console-core typecheck
```
