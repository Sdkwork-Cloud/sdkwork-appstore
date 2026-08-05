import {
  createDomainsClient,
  type DomainsClientConfig,
  type SdkworkCloudrouterAppDomainsClient,
} from '@sdkwork/appstore-listing-acquire-core';
import { appstoreTokenManager } from '@/bootstrap/iamRuntime';
import { getEnvironment } from '@/bootstrap/environment';

let commerceDomainsClient: SdkworkCloudrouterAppDomainsClient | null = null;

export function getCommerceDomainsClient(): SdkworkCloudrouterAppDomainsClient {
  if (!commerceDomainsClient) {
    const env = getEnvironment();
    const config: DomainsClientConfig = {
      baseUrl: import.meta.env.VITE_APPBASE_API_URL || env.appbaseBaseUrl,
      tokenManager: appstoreTokenManager,
    };
    commerceDomainsClient = createDomainsClient(config);
  }
  return commerceDomainsClient;
}

export function resetCommerceDomainsClient(): void {
  commerceDomainsClient = null;
}
