export interface MarketChannelCreateRequest {
  channelCode: string;
  channelType: 'APPLE_APP_STORE' | 'GOOGLE_PLAY' | 'ENTERPRISE' | 'EXTERNAL';
  provider: string;
  externalStoreCode?: string;
  apiCapability?: Record<string, unknown>;
  config?: Record<string, unknown>;
}
