import type { AppTemplate } from './app-template';

export interface AppTemplateResponse {
  code: 0;
  data: unknown & { item: AppTemplate; };
  /** Server-owned request correlation id. */
  traceId: string;
}
