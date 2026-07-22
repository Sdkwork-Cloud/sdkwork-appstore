export interface MarketReleaseSyncRequest {
  syncMode: 'PULL_STATUS' | 'PUSH_METADATA' | 'PUSH_RELEASE' | 'RECONCILE';
  externalStatus?: Record<string, unknown>;
  note?: string;
}
