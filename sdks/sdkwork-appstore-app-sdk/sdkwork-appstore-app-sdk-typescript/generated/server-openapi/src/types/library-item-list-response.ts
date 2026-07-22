import type { PageInfo } from './page-info';
import type { UserLibraryItem } from './user-library-item';

export interface LibraryItemListResponse {
  code: 0;
  data: unknown & { items: UserLibraryItem[]; pageInfo: PageInfo; };
  /** Server-owned request correlation id. */
  traceId: string;
}
