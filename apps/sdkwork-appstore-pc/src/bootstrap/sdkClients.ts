import { SdkClientFactory } from '@sdkwork/appstore-pc-core';

export function initializeSdkClients() {
  return SdkClientFactory.createClient();
}
