# SDKWork App Store PC Application

## SDKWORK Soul

Read `../../sdkwork-specs/SOUL.md` before executing tasks in this root. Follow specs before memory, dictionary before context, stop on ambiguity, and evidence before completion.

## Application Identity

- Product: `sdkwork-appstore`
- Surface: PC (browser web, desktop, tablet)
- Architecture: `APP_PC_ARCHITECTURE_SPEC.md`
- UI Standard: `APP_PC_REACT_UI_SPEC.md`
- SDK Surface: `sdkwork-appstore-app-sdk` (app-api only)

## Package Taxonomy

| Package | Role |
|---|---|
| `sdkwork-appstore-pc-core` | Runtime/bootstrap, SDK clients, IAM, TokenManager |
| `sdkwork-appstore-pc-commons` | Shared UI primitives, utilities, i18n fragments |
| `sdkwork-appstore-pc-shell` | App shell, route assembly, layout, navigation |
| `sdkwork-appstore-pc-catalog` | Catalog discovery (home, categories, collections, charts) |
| `sdkwork-appstore-pc-listing` | Listing detail, media, submissions |
| `sdkwork-appstore-pc-release` | Release management, artifacts, rollout |
| `sdkwork-appstore-pc-library` | User library, wishlist, install events |
| `sdkwork-appstore-pc-publisher` | Publisher console, member management |
| `sdkwork-appstore-pc-search` | Search functionality |
| `sdkwork-appstore-pc-console-core` | Console shell, navigation |
| `sdkwork-appstore-pc-console-publisher` | Publisher management console |

## SDK Boundary

- UI packages MUST use `sdkwork-appstore-app-sdk` only
- UI packages MUST NOT use backend SDK or raw HTTP
- SDK clients are constructed in `src/bootstrap/sdkClients.ts` and injected

## Build & Run

```bash
pnpm install
pnpm dev          # Browser dev server
pnpm build        # Production build
pnpm test         # Run tests
```
