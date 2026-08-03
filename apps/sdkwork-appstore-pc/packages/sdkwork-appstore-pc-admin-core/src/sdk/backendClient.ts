import {
  createClient,
  type SdkworkAppstoreBackendClient,
} from '@sdkwork/appstore-backend-sdk';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

/**
 * Backend-admin SDK client factory.
 *
 * The `@sdkwork/appstore-backend-sdk` import stays inside this backend-admin
 * package boundary; the application bootstrap only consumes this factory and
 * never imports the backend SDK itself.
 */
export function createAppstorePcAdminBackendClient(options: {
  baseUrl: string;
  tokenManager: AuthTokenManager;
}): SdkworkAppstoreBackendClient {
  return createClient({
    authMode: 'dual-token',
    baseUrl: normalizeBackendBaseUrl(options.baseUrl),
    platform: 'pc',
    tokenManager: options.tokenManager,
  });
}

function normalizeBackendBaseUrl(baseUrl: string): string {
  const normalized = baseUrl.replace(/\/+$/u, '');
  const apiPrefix = '/backend/v3/api';
  if (!normalized.endsWith(apiPrefix)) {
    return normalized;
  }
  return normalized.slice(0, -apiPrefix.length) || '/';
}
