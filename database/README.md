# APPSTORE Database Module

Canonical lifecycle assets for `sdkwork-appstore` per `DATABASE_FRAMEWORK_SPEC.md`.

- moduleId: `appstore`
- serviceCode: `APPSTORE`
- tablePrefix: `appstore_`

## Commands

```bash
pnpm run db:validate
pnpm run db:plan
pnpm run db:init
pnpm run db:migrate
pnpm run db:seed
pnpm run db:status
pnpm run db:drift:check
```

## Migration status

Legacy SQL was consolidated into `ddl/baseline/postgres/0001_*_legacy_baseline.sql` for bootstrap review.
Author contract-first tables in `contract/schema.yaml`, then split baseline into versioned `migrations/` pairs.

Imported legacy sources:
- `specs/database/migrations/0001_appstore_foundation.sql`

Runtime services MUST create pools through `sdkwork-database-sqlx` and register `DefaultDatabaseModule` at bootstrap.
