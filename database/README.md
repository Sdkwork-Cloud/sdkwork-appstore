# APPSTORE Database Module

Canonical lifecycle assets for `sdkwork-appstore` per `DATABASE_FRAMEWORK_SPEC.md`.

- moduleId: `appstore`
- serviceCode: `APPSTORE`
- tablePrefix: `appstore_`

## Commands

```bash
pnpm run db:materialize:contract
pnpm run db:validate
pnpm run db:bootstrap
```

Legacy SQL: `specs/database/migrations/0001_appstore_foundation.sql` → `database/ddl/baseline/postgres/0001_appstore_legacy_baseline.sql`

Runtime bootstrap: `pnpm run db:bootstrap` via `sdkwork-database-cli` (Node-only repo; no Rust host crate).
