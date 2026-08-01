# Repository Guidelines

## SDKWORK Soul

Read `../../../sdkwork-specs/SOUL.md` before PC application work. Apply exact local contracts and selected global specifications before inspecting implementation details.

## SDKWORK Standards

The canonical standards index is `../../../sdkwork-specs/README.md`; `../../../sdkwork-specs/AGENTS_SPEC.md` governs this entrypoint. Load only the task-specific standards selected by the index and this file.

## Application Identity

Read `sdkwork.app.config.json` for application identity, release, media, and packaging metadata. Runtime and deployment values belong in `etc/sdkwork.deployment.config.json` and the typed runtime configuration adapter.

## Local Dictionary Structure

- `specs/`: application-level component and composition contracts.
- `packages/*/specs/`: independently authored PC module contracts.
- `src/bootstrap/`: runtime configuration, IAM, global TokenManager, and SDK client composition.
- `packages/`: app, console, backend-admin, shell, feature, and host modules.
- `etc/`: source-controlled runtime and deployment configuration.
- `tests/`: application architecture and contract tests.

## Spec Resolution Order

Use dynamic progressive loading before implementation files: read this file, `../../AGENTS.md`, the nearest `specs/component.spec.json`, the applicable row in `../../../sdkwork-specs/README.md`, and only then the selected implementation files. Language-specific specs load on demand only.

## Required Specs By Task Type

TypeScript or React changes load `CODE_STYLE_SPEC.md`, `NAMING_SPEC.md`, and, on demand only, `TYPESCRIPT_CODE_SPEC.md`, `FRONTEND_CODE_SPEC.md`, and the applicable PC/UI specification. SDK integration loads `APP_SDK_INTEGRATION_SPEC.md`; IAM work loads `IAM_SPEC.md`, `IAM_LOGIN_INTEGRATION_SPEC.md`, `SECURITY_SPEC.md`, and `PRIVACY_SPEC.md`; composition work loads `COMPONENT_SPEC.md`, `COMPOSABLE_ARCHITECTURE_SPEC.md`, and `APP_COMPOSITION_SPEC.md`. Package command work loads `PNPM_SCRIPT_SPEC.md`; packaging workflow changes load `GITHUB_WORKFLOW_SPEC.md`.

## Code Style Rules

Keep the current PC visual design as the product baseline. UI modules consume injected service ports; only bootstrap constructs SDK clients and owns the global TokenManager. App and user-console surfaces must not import backend SDKs. Backend SDKs are restricted to the explicit `backend-admin` composition. Do not add raw HTTP, manual auth headers, browser-owned secrets, local DTO forks, or fake-success paths.

## Build, Test, and Verification

Run the narrowest PC checks first: `pnpm typecheck`, `pnpm test`, and `pnpm build`. SDK changes also run `node ../../../sdkwork-specs/tools/check-app-sdk-consumer-imports.mjs --workspace ../..`; composition changes run the component, frontend-composition, permission-composition, and composition-resolver checks.

## Agent Execution Rules

Appstore owns marketplace catalog, publisher, listing, release, library, moderation, and store analytics. IAM, Drive, Comments, commerce, Agents, Skills, and MCP remain dependency-owned and are consumed through approved SDKs or composed facades. Do not modify database schema, migrations, generated SDK output, release policy, or destructive filesystem state without human review.

## Task-Specific Standards

List and search work additionally loads `PAGINATION_SPEC.md` and runs `node ../../../sdkwork-specs/tools/check-pagination.mjs --workspace ../..`. Source configuration work loads `SOURCE_CONFIG_SPEC.md`, `CONFIG_SPEC.md`, `ENVIRONMENT_SPEC.md`, and `DEPLOYMENT_SPEC.md`. API contract work loads `API_SPEC.md` and runs its operation and response-envelope checks.

## Human Review Rules

Human review is required for breaking public API/SDK changes, security exceptions, database or migration changes, generated SDK ownership changes, release policy changes, and destructive filesystem work.
