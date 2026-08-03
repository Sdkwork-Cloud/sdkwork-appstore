import type { AppTemplate } from './app-template';
import type { PageInfo } from './page-info';

export interface AppTemplateListResponse {
  code: 0;
  data: unknown & { items: AppTemplate[]; pageInfo: PageInfo; };
  /** Server-owned request correlation id. */
  traceId: string;
}
