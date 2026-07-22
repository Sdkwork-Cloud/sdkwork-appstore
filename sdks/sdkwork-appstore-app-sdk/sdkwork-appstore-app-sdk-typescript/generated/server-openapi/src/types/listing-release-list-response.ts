import type { PageInfo } from './page-info';
import type { Release } from './release';

export interface ListingReleaseListResponse {
  code: 0;
  data: unknown & { items: Release[]; pageInfo: PageInfo; };
  /** Server-owned request correlation id. */
  traceId: string;
}
