export interface MarketChannelUpdateRequest {
  channelStatus?: string;
  externalStoreCode?: string;
  apiCapability?: Record<string, unknown>;
  config?: Record<string, unknown>;
}
