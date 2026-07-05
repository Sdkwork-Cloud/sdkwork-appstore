import {
  createAppStoreClient,
  type AppStoreClient,
  type TokenManager,
} from '@sdkwork/appstore-app-sdk';
import { getEnvironment } from '../environment/config';

let client: AppStoreClient | null = null;

const tokenManager: TokenManager = {
  getAuthToken: () => localStorage.getItem('auth-token') || undefined,
  getAccessToken: () => localStorage.getItem('access-token') || undefined,
};

export function getStoreClient(): AppStoreClient {
  if (!client) {
    const env = getEnvironment();
    client = createAppStoreClient({
      baseUrl: env.appstoreAppApiBaseUrl,
      openApiBaseUrl: env.appstoreOpenApiBaseUrl,
      tokenManager,
    });
  }
  return client;
}

export function setAuthToken(token: string): void {
  localStorage.setItem('auth-token', token);
  client = null;
}

export function setAccessToken(token: string): void {
  localStorage.setItem('access-token', token);
  client = null;
}

export function clearTokens(): void {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('access-token');
  client = null;
}
