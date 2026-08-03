import type { AppTemplateUsageResult } from './app-template-usage-result';

export interface AppTemplateUsageResponse {
  code: 0;
  data: unknown & { item: AppTemplateUsageResult; };
  /** Server-owned request correlation id. */
  traceId: string;
}
