import { HttpClient, createHttpClient } from './http/client';
import type { SdkworkBackendConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

import { ModerationApi, createModerationApi } from './api/moderation';
import { CatalogApi, createCatalogApi } from './api/catalog';
import { ListingsApi, createListingsApi } from './api/listings';
import { PublishersApi, createPublishersApi } from './api/publishers';
import { MetricsApi, createMetricsApi } from './api/metrics';
import { AnalyticsApi, createAnalyticsApi } from './api/analytics';
import { MarketApi, createMarketApi } from './api/market';

export class SdkworkAppstoreBackendClient {
  private httpClient: HttpClient;

  public readonly moderation: ModerationApi;
  public readonly catalog: CatalogApi;
  public readonly listings: ListingsApi;
  public readonly publishers: PublishersApi;
  public readonly metrics: MetricsApi;
  public readonly analytics: AnalyticsApi;
  public readonly market: MarketApi;

  constructor(config: SdkworkBackendConfig) {
    this.httpClient = createHttpClient(config);
    this.moderation = createModerationApi(this.httpClient);

    this.catalog = createCatalogApi(this.httpClient);

    this.listings = createListingsApi(this.httpClient);

    this.publishers = createPublishersApi(this.httpClient);

    this.metrics = createMetricsApi(this.httpClient);

    this.analytics = createAnalyticsApi(this.httpClient);

    this.market = createMarketApi(this.httpClient);
  }
  setAuthToken(token: string): this {
    this.httpClient.setAuthToken(token);
    return this;
  }

  setAccessToken(token: string): this {
    this.httpClient.setAccessToken(token);
    return this;
  }

  setTokenManager(manager: AuthTokenManager): this {
    this.httpClient.setTokenManager(manager);
    return this;
  }

  get http(): HttpClient {
    return this.httpClient;
  }
}

export function createClient(config: SdkworkBackendConfig): SdkworkAppstoreBackendClient {
  return new SdkworkAppstoreBackendClient(config);
}

export default SdkworkAppstoreBackendClient;
