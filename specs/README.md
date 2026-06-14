# SDKWork App Store Specs

Local contracts that narrow root standards for this repository.

| File | Purpose |
| --- | --- |
| `component.spec.json` | Repository workspace component manifest |
| `domain.yaml` | Bounded context record for appstore |
| `database/schema-registry.yaml` | Portable table contracts (source of truth before DDL) |
| `database/migrations/` | Versioned SQL migrations derived from registry |

When a local spec conflicts with `../sdkwork-specs/`, the root spec wins unless a governance exception is recorded.
