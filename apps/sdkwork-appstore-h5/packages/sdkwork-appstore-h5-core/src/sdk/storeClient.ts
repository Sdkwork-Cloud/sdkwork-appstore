import { createAppStoreClient, type AppStoreClient, type TokenManager } from '@sdk/composed/client';
import { getEnvironment } from '../environment/config';

let storeClient: AppStoreClient | null = null;

const tokenManager: TokenManager = {
  getAuthToken: () => localStorage.getItem('auth-token') || undefined,
  getAccessToken: () => localStorage.getItem('access-token') || undefined,
};

export function getStoreClient(): AppStoreClient {
  if (!storeClient) {
    const env = getEnvironment();
    storeClient = createAppStoreClient({
      baseUrl: env.appstoreAppApiBaseUrl,
      tokenManager,
    });
  }
  return storeClient;
}

export function setAuthToken(token: string): void {
  localStorage.setItem('auth-token', token);
}

export function setAccessToken(token: string): void {
  localStorage.setItem('access-token', token);
}

export function clearTokens(): void {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('access-token');
  storeClient = null;
}
