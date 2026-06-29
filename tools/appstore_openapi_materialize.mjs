import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const alignScript = resolve(repoRoot, '../sdkwork-specs/tools/align-openapi-response-envelope.mjs');

const targets = [
  {
    source: 'apis/app-api/store/openapi.yaml',
    target: 'sdks/sdkwork-appstore-app-sdk/openapi/sdkwork-appstore-app-api.openapi.yaml',
    legacyEnvelope: 'StoreApiResult',
  },
  {
    source: 'apis/backend-api/store/openapi.yaml',
    target: 'sdks/sdkwork-appstore-backend-sdk/openapi/sdkwork-appstore-backend-api.openapi.yaml',
    legacyEnvelope: 'StoreApiResult',
  },
  {
    source: 'apis/open-api/store/openapi.yaml',
    target: 'sdks/sdkwork-appstore-sdk/openapi/sdkwork-appstore-open-api.openapi.yaml',
    legacyEnvelope: 'StoreApiResult',
  },
];

for (const { source, target, legacyEnvelope } of targets) {
  const sourcePath = resolve(source);
  execFileSync(
    process.execPath,
    [alignScript, '--file', sourcePath, '--legacy-envelope', legacyEnvelope],
    { stdio: 'inherit' },
  );

  const targetPath = resolve(target);
  await mkdir(resolve(target, '..'), { recursive: true });
  await writeFile(targetPath, await readFile(sourcePath, 'utf8'));
  console.log(`materialized ${targetPath} from ${source}`);
}
