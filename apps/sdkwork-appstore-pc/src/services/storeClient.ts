import { createAppStoreClient, type AppStoreClient, type TokenManager } from '@sdk/composed/client';

let client: AppStoreClient | null = null;

const tokenManager: TokenManager = {
  getAuthToken: () => localStorage.getItem('auth-token') || undefined,
  getAccessToken: () => localStorage.getItem('access-token') || undefined,
};

export function getStoreClient(): AppStoreClient {
  if (!client) {
    client = createAppStoreClient({
      baseUrl: import.meta.env.VITE_APPSTORE_API_URL || 'http://127.0.0.1:18090',
      tokenManager,
    });
  }
  return client;
}

export function setAuthToken(token: string) {
  localStorage.setItem('auth-token', token);
}

export function setAccessToken(token: string) {
  localStorage.setItem('access-token', token);
}

export function clearTokens() {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('access-token');
}
