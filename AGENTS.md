# Repository Guidelines

<!-- SDKWORK-AGENTS-GENERATED: v1 -->

## SDKWORK Soul

Read `../sdkwork-specs/SOUL.md` before executing tasks in this root. Follow specs before memory, dictionary before context, stop on ambiguity, and evidence before completion.

## SDKWORK Standards

Canonical SDKWORK specs path from this root:

- `../sdkwork-specs/README.md`
- `../sdkwork-specs/SOUL.md`
- `../sdkwork-specs/AGENTS_SPEC.md`
- `../sdkwork-specs/CODE_STYLE_SPEC.md`
- `../sdkwork-specs/NAMING_SPEC.md`

Do not copy root standard text into this repository. If these relative paths do not resolve, stop and report the broken workspace layout.

## Application Identity

Application roots under `apps/` carry `sdkwork.app.config.json`. This repository root owns backend contracts, persistence, SDK generation, and Rust services for the appstore capability.

Primary design references:

- `specs/domain.yaml`
- `specs/database/schema-registry.yaml`
- `docs/architecture/appstore-architecture.md`

## Local Dictionary Structure

- `AGENTS.md`: local agent entrypoint and relative SDKWORK spec index.
- `CLAUDE.md`, `GEMINI.md`, `CODEX.md`: tool compatibility shims pointing to `AGENTS.md`.
- `.sdkwork/`: source-controlled workspace metadata (skills, plugins).
- `specs/`: domain record, database registry, component spec.
- `apis/`: authored HTTP and event API contracts.
- `sdks/`: SDK families, OpenAPI authorities, generation manifests.
- `crates/`: Rust route crates, services, repositories (implementation phase).
- `docs/`: architecture, ADRs, requirements, API/SDK design notes.
- `apps/`: client application roots (developed separately).

## Spec Resolution Order

1. Read this `AGENTS.md` and any nearer component-level `AGENTS.md`.
2. Read `sdkwork.app.config.json` when present under an app root.
3. Read local `specs/README.md`, `specs/domain.yaml`, and `specs/component.spec.json`.
4. Read local `.sdkwork/README.md`, `.sdkwork/skills/`, and `.sdkwork/plugins/` when relevant.
5. Read `../sdkwork-specs/README.md` and the task-specific root specs.
6. Inspect implementation files only after the relevant dictionary entries are clear.

## Required Specs By Task Type

- Agent/workflow changes: `../sdkwork-specs/SOUL.md`, `../sdkwork-specs/AGENTS_SPEC.md`, `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`.
- Any code change: `../sdkwork-specs/CODE_STYLE_SPEC.md`, `../sdkwork-specs/NAMING_SPEC.md`, plus only the touched language/framework spec.
- Rust code: `../sdkwork-specs/RUST_CODE_SPEC.md`, `../sdkwork-specs/WEB_BACKEND_SPEC.md`, `../sdkwork-specs/RUST_RPC_SPEC.md` when RPC is touched.
- Java/Spring code: `../sdkwork-specs/JAVA_CODE_SPEC.md`, `../sdkwork-specs/WEB_BACKEND_SPEC.md`.
- TypeScript/Node code: `../sdkwork-specs/TYPESCRIPT_CODE_SPEC.md`.
- Database changes: `../sdkwork-specs/DATABASE_SPEC.md`, local `specs/database/schema-registry.yaml`.
- API changes: `../sdkwork-specs/API_SPEC.md`, local `apis/`.
- SDK changes: `../sdkwork-specs/SDK_SPEC.md`, `../sdkwork-specs/SDK_WORKSPACE_GENERATION_SPEC.md`, local `sdks/`.
- Architecture changes: `../sdkwork-specs/ARCHITECTURE_DECISION_SPEC.md`, `docs/architecture/`.

## Code Style Rules

Read `../sdkwork-specs/CODE_STYLE_SPEC.md` and `../sdkwork-specs/NAMING_SPEC.md` before code changes.

- Local domain: `appstore`, extending standard SDKWork `ecosystem`. Database tables use prefix `appstore_`.
- Operation IDs use `appstore.<capability>.<action>` form.
- Do not hand-edit generated SDK output under `sdks/**/generated/server-openapi/`.

## Build, Test, And Verification

Run commands from this directory unless a command explicitly targets another path.

Implementation-phase verification (to be wired):

- `pnpm run verify`
- `pnpm run sdk:check`
- `cargo fmt --all --check`
- `cargo test --workspace`

Design-phase verification:

- Schema registry matches migration SQL column names and indexes.
- OpenAPI paths use locked prefixes and stable `operationId` values listed in `docs/api/operation-catalog.md`.
- SDK manifests trace to authored contracts under `apis/`.

## Agent Execution Rules

Use the convention dictionary instead of broad context loading. Do not implement frontend packages in this repository unless explicitly requested. Do not duplicate IAM, comments, or commerce ownership. Stop when API authority, SDK family, or table ownership is ambiguous.

## Human Review Rules

Request human review before breaking SDKWORK standards, changing public naming, altering security/auth behavior, changing database migrations, deleting data/files, or changing generated SDK ownership.
