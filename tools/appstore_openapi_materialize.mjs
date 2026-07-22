import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const checkOnly = process.argv.includes('--check');
const alignScript = resolve(repoRoot, '../sdkwork-specs/tools/align-openapi-response-envelope.mjs');

const targets = [
  {
    source: 'apis/app-api/store/openapi.yaml',
    targets: [
      'sdks/sdkwork-appstore-app-sdk/openapi/sdkwork-appstore-app-api.openapi.yaml',
      'sdks/sdkwork-appstore-app-sdk/openapi/sdkwork-appstore-app-api.sdkgen.yaml',
    ],
    legacyEnvelope: 'StoreApiResult',
  },
  {
    source: 'apis/backend-api/store/openapi.yaml',
    targets: [
      'sdks/sdkwork-appstore-backend-sdk/openapi/sdkwork-appstore-backend-api.openapi.yaml',
      'sdks/sdkwork-appstore-backend-sdk/openapi/sdkwork-appstore-backend-api.sdkgen.yaml',
    ],
    legacyEnvelope: 'StoreApiResult',
  },
  {
    source: 'apis/open-api/store/openapi.yaml',
    targets: [
      'sdks/sdkwork-appstore-sdk/openapi/sdkwork-appstore-open-api.openapi.yaml',
      'sdks/sdkwork-appstore-sdk/openapi/sdkwork-appstore-open-api.sdkgen.yaml',
    ],
    legacyEnvelope: 'StoreApiResult',
  },
];

for (const { source, targets: outputTargets, legacyEnvelope } of targets) {
  const sourcePath = resolve(source);
  if (!checkOnly) {
    execFileSync(
      process.execPath,
      [alignScript, '--file', sourcePath, '--legacy-envelope', legacyEnvelope],
      { stdio: 'inherit' },
    );
  }

  const sourceText = await readFile(sourcePath, 'utf8');
  for (const target of outputTargets) {
    const targetPath = resolve(target);
    if (checkOnly) {
      const materializedText = await readFile(targetPath, 'utf8');
      if (sourceText !== materializedText) {
        throw new Error(`${targetPath} is stale; run pnpm run api:materialize`);
      }
      console.log(`api materialize check passed for ${target}`);
      continue;
    }

    await mkdir(resolve(target, '..'), { recursive: true });
    await writeFile(targetPath, sourceText);
    console.log(`materialized ${targetPath} from ${source}`);
  }
}
