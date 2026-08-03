export interface AppTemplateUsageCreateRequest {
  usageType: 'STAR' | 'FORK' | 'CLONE' | 'ENABLE' | 'DISABLE';
  metadata?: Record<string, unknown>;
}
