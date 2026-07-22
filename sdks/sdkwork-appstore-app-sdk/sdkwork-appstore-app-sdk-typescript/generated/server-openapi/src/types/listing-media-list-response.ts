import type { ListingMedia } from './listing-media';
import type { PageInfo } from './page-info';

export interface ListingMediaListResponse {
  code: 0;
  data: unknown & { items: ListingMedia[]; pageInfo: PageInfo; };
  /** Server-owned request correlation id. */
  traceId: string;
}
