import { createAppStoreClient, type AppStoreClient } from '@sdkwork/appstore-app-sdk';
import { appstoreTokenManager } from '@/bootstrap/iamRuntime';
import { getEnvironment } from '@/bootstrap/environment';

let client: AppStoreClient | null = null;

export function getStoreClient(): AppStoreClient {
  if (!client) {
    const env = getEnvironment();
    client = createAppStoreClient({
      baseUrl: import.meta.env.VITE_APPSTORE_API_URL || env.appstoreAppApiBaseUrl,
      tokenManager: appstoreTokenManager,
    });
  }
  return client;
}

export function resetStoreClient(): void {
  client = null;
}
