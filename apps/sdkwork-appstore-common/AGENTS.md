# Repository Guidelines

## SDKWORK Soul

Read `../../../sdkwork-specs/SOUL.md` before executing tasks in this root.

## SDKWORK Standards

Canonical SDKWORK specs path from this application root:

- `../../../sdkwork-specs/README.md`
- `../../../sdkwork-specs/SOUL.md`
- `../../../sdkwork-specs/AGENTS_SPEC.md`
- `../../../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../../../sdkwork-specs/COMPONENT_SPEC.md`

## Application Identity

This root is `sdkwork-appstore-common`: a shared, non-runnable package root for SDKWork App Store. Runnable app identity lives in `../sdkwork-appstore-pc/sdkwork.app.config.json` and `../sdkwork-appstore-h5/sdkwork.app.config.json`.

## Local Dictionary Structure

- `README.md`: common root index.
- `AGENTS.md`: local agent entrypoint.
- `.sdkwork/`: source-controlled workspace metadata for local skills/plugins.
- `specs/component.spec.json`: common root component contract.
- `packages/`: cross-architecture shared packages.

## Execution Rules

- Keep shared packages cross-architecture and UI-host independent.
- Do not move PC-only or H5-only React surfaces into this root.
- Do not copy global `sdkwork-specs` bodies locally; link them through component specs.
- Run package-level verification before reporting shared package changes complete.
