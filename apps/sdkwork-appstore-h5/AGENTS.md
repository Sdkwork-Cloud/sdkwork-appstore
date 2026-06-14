# SDKWork App Store H5 Application

## SDKWORK Soul

Read `../../sdkwork-specs/SOUL.md` before executing tasks in this root.

## Application Identity

- Product: `sdkwork-appstore`
- Surface: H5 (phone-first mobile web, Capacitor)
- Architecture: `APP_H5_ARCHITECTURE_SPEC.md`
- UI Standard: `APP_MOBILE_REACT_UI_SPEC.md`
- SDK Surface: `sdkwork-appstore-app-sdk` (app-api only)

## Package Taxonomy

| Package | Role |
|---|---|
| `sdkwork-appstore-h5-core` | Runtime/bootstrap, SDK clients, IAM, TokenManager |
| `sdkwork-appstore-h5-commons` | Shared mobile UI primitives, utilities |
| `sdkwork-appstore-h5-shell` | Mobile shell, tab navigation, layout |
| `sdkwork-appstore-h5-catalog` | Catalog discovery |
| `sdkwork-appstore-h5-listing` | Listing detail |
| `sdkwork-appstore-h5-library` | User library |
| `sdkwork-appstore-h5-search` | Search |
| `sdkwork-appstore-h5-console-core` | Console shell |

## Build & Run

```bash
pnpm install
pnpm dev          # H5 browser dev
pnpm build        # Production build
```
