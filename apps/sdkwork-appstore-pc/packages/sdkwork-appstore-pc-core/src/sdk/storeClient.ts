import {
  createTokenManager,
  createAppStoreClient,
  type AppStoreClient,
} from '@sdkwork/appstore-app-sdk';
import { getEnvironment } from '../environment/config';

let client: AppStoreClient | null = null;

const tokenManager = createTokenManager();

function syncStoredTokens(): void {
  const authToken = localStorage.getItem('auth-token') || undefined;
  const accessToken = localStorage.getItem('access-token') || undefined;
  tokenManager.setTokens({ authToken, accessToken });
}

export function getStoreClient(): AppStoreClient {
  if (!client) {
    const env = getEnvironment();
    syncStoredTokens();
    client = createAppStoreClient({
      baseUrl: env.appstoreAppApiBaseUrl,
      tokenManager,
    });
  }
  return client;
}

export function setAuthToken(token: string): void {
  localStorage.setItem('auth-token', token);
  tokenManager.setAuthToken(token);
  client = null;
}

export function setAccessToken(token: string): void {
  localStorage.setItem('access-token', token);
  tokenManager.setAccessToken(token);
  client = null;
}

export function clearTokens(): void {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('access-token');
  tokenManager.clearTokens();
  client = null;
}
