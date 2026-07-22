import {
  createAppStoreOpenClient,
  type ApiKeyCredentialProvider,
  type AppStoreOpenClient,
} from '@sdkwork/appstore-sdk';
import { getEnvironment } from '@/bootstrap/environment';

let credentialProvider: ApiKeyCredentialProvider | undefined;
let client: AppStoreOpenClient | undefined;

export function configureOpenApiCredentialProvider(
  provider: ApiKeyCredentialProvider | undefined,
): void {
  credentialProvider = provider;
  client = undefined;
}

export function getOpenStoreClient(): AppStoreOpenClient {
  if (!client) {
    client = createAppStoreOpenClient({
      baseUrl: getEnvironment().appstoreOpenApiBaseUrl,
      credentialProvider,
    });
  }
  return client;
}

export function resetOpenStoreClient(): void {
  client = undefined;
}
