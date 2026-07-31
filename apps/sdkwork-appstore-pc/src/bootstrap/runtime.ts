import { AppRuntime } from '@sdkwork/appstore-pc-core';
import { loadEnvironment } from './environment';
import { initializeIamRuntime } from './iamRuntime';
import { initializeSdkClients } from './sdkClients';

export function bootstrapApplication() {
  const env = loadEnvironment();
  const runtime = AppRuntime.getInstance();
  runtime.init();
  const iam = initializeIamRuntime();
  const sdks = initializeSdkClients();

  return { env, iam, sdks };
}
