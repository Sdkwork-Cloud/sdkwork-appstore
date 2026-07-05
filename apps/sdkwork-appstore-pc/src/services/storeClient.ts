import { createAppStoreClient, type AppStoreClient } from '@sdkwork/appstore-app-sdk';
import { appstoreTokenManager } from '@/bootstrap/iamRuntime';
import { getEnvironment } from '@/bootstrap/environment';

let client: AppStoreClient | null = null;

export function getStoreClient(): AppStoreClient {
  if (!client) {
    const env = getEnvironment();
    client = createAppStoreClient({
      baseUrl: import.meta.env.VITE_APPSTORE_API_URL || env.appstoreAppApiBaseUrl,
      openApiBaseUrl: import.meta.env.VITE_APPSTORE_OPEN_API_URL || env.appstoreOpenApiBaseUrl,
      tokenManager: appstoreTokenManager,
    });
  }
  return client;
}

export function resetStoreClient(): void {
  client = null;
}

export function setAuthToken(token: string) {
  appstoreTokenManager.setAuthToken(token);
  localStorage.setItem('auth-token', token);
  resetStoreClient();
}

export function setAccessToken(token: string) {
  appstoreTokenManager.setAccessToken(token);
  localStorage.setItem('access-token', token);
  resetStoreClient();
}

export function clearTokens() {
  appstoreTokenManager.clearTokens();
  localStorage.removeItem('auth-token');
  localStorage.removeItem('access-token');
  localStorage.removeItem('refresh-token');
  resetStoreClient();
}

export function isAuthenticated(): boolean {
  return !!appstoreTokenManager.getAuthToken();
}

export { appstoreTokenManager };
