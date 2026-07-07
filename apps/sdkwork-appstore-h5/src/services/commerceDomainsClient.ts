import {
  createClient,
  type SdkworkClawrouterAppDomainsClient,
} from '@sdkwork/clawrouter-app-sdk/domains';
import { appstoreTokenManager } from '@/bootstrap/iamRuntime';
import { getEnvironment } from '@/bootstrap/environment';

let commerceDomainsClient: SdkworkClawrouterAppDomainsClient | null = null;

export function getCommerceDomainsClient(): SdkworkClawrouterAppDomainsClient {
  if (!commerceDomainsClient) {
    const env = getEnvironment();
    commerceDomainsClient = createClient({
      baseUrl: import.meta.env.VITE_APPBASE_API_URL || env.appbaseBaseUrl,
      tokenManager: appstoreTokenManager,
    });
  }
  return commerceDomainsClient;
}

export function resetCommerceDomainsClient(): void {
  commerceDomainsClient = null;
}
