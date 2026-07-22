#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const sdkgen = resolve(repoRoot, '../sdkwork-sdk-generator/bin/sdkgen.js');

const families = [
  {
    input: 'sdks/sdkwork-appstore-app-sdk/openapi/sdkwork-appstore-app-api.sdkgen.yaml',
    output:
      'sdks/sdkwork-appstore-app-sdk/sdkwork-appstore-app-sdk-typescript/generated/server-openapi',
    name: 'sdkwork-appstore-app-sdk',
    type: 'app',
    packageName: '@sdkwork/appstore-app-sdk',
    apiPrefix: '/app/v3/api',
    clientName: 'SdkworkAppstoreAppClient',
  },
  {
    input:
      'sdks/sdkwork-appstore-backend-sdk/openapi/sdkwork-appstore-backend-api.sdkgen.yaml',
    output:
      'sdks/sdkwork-appstore-backend-sdk/sdkwork-appstore-backend-sdk-typescript/generated/server-openapi',
    name: 'sdkwork-appstore-backend-sdk',
    type: 'backend',
    packageName: '@sdkwork/appstore-backend-sdk',
    apiPrefix: '/backend/v3/api',
    clientName: 'SdkworkAppstoreBackendClient',
  },
  {
    input: 'sdks/sdkwork-appstore-sdk/openapi/sdkwork-appstore-open-api.sdkgen.yaml',
    output: 'sdks/sdkwork-appstore-sdk/sdkwork-appstore-sdk-typescript/generated/server-openapi',
    name: 'sdkwork-appstore-sdk',
    type: 'custom',
    packageName: '@sdkwork/appstore-sdk',
    apiPrefix: '/store/v3/api',
    clientName: 'SdkworkAppstoreOpenClient',
  },
];

for (const family of families) {
  const args = [
    sdkgen,
    'generate',
    '--input',
    resolve(repoRoot, family.input),
    '--output',
    resolve(repoRoot, family.output),
    '--name',
    family.name,
    '--type',
    family.type,
    '--language',
    'typescript',
    '--package-name',
    family.packageName,
    '--api-prefix',
    family.apiPrefix,
    '--standard-profile',
    'sdkwork-v3',
    '--fixed-sdk-version',
    '0.1.0',
    '--client-name',
    family.clientName,
    '--emit-control-plane',
  ];
  const result = spawnSync(process.execPath, args, { cwd: repoRoot, stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('Appstore app, backend, and open SDK families generated.');
