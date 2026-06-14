import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const targets = [
  {
    source: 'apis/app-api/store/openapi.yaml',
    target: 'sdks/sdkwork-appstore-app-sdk/openapi/sdkwork-appstore-app-api.openapi.yaml',
  },
  {
    source: 'apis/backend-api/store/openapi.yaml',
    target: 'sdks/sdkwork-appstore-backend-sdk/openapi/sdkwork-appstore-backend-api.openapi.yaml',
  },
  {
    source: 'apis/open-api/store/openapi.yaml',
    target: 'sdks/sdkwork-appstore-sdk/openapi/sdkwork-appstore-open-api.openapi.yaml',
  },
];

for (const { source, target } of targets) {
  const targetPath = resolve(target);
  await mkdir(resolve(target, '..'), { recursive: true });
  await writeFile(targetPath, await readFile(resolve(source), 'utf8'));
  console.log(`materialized ${targetPath} from ${source}`);
}
