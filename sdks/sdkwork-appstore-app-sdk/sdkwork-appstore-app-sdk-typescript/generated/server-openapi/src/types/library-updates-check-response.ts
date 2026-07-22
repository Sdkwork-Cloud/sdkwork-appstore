import type { PageInfo } from './page-info';
import type { UpdateAvailable } from './update-available';

export interface LibraryUpdatesCheckResponse {
  code: 0;
  data: unknown & { items: UpdateAvailable[]; pageInfo: PageInfo; };
  /** Server-owned request correlation id. */
  traceId: string;
}
