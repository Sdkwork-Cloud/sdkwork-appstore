# Authored API Contracts

HTTP contract sources for `sdkwork-appstore`. These files are review inputs; SDK families materialize authority OpenAPI under `sdks/`.

| Surface | Path | Prefix | Authority |
| --- | --- | --- | --- |
| App API | `app-api/store/openapi.yaml` | `/app/v3/api` | `sdkwork-appstore-app-api` |
| Backend API | `backend-api/store/openapi.yaml` | `/backend/v3/api` | `sdkwork-appstore-backend-api` |
| Open API | `open-api/store/openapi.yaml` | `/store/v3/api` | `sdkwork-appstore-open-api` |
| Events | `async/events/appstore-events.yaml` | n/a | `appstore.store.*` |

Rules:

- Do not add IAM login routes; use `sdkwork-appbase-app-sdk`.
- Operation IDs must appear in `docs/api/operation-catalog.md`.
- List endpoints use cursor pagination (`cursor`, `limit`).

Materialization command (implementation phase): `tools/appstore_openapi_materialize.mjs`
