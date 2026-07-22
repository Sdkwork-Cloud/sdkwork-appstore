import type { PageInfo } from './page-info';
import type { PublicFeaturedSlot } from './public-featured-slot';

export interface PublicFeaturedListResponse {
  code: 0;
  data: unknown & { items: PublicFeaturedSlot[]; pageInfo: PageInfo; };
  /** Server-owned request correlation id. */
  traceId: string;
}
