import type { CatalogFeaturedSlot } from './catalog-featured-slot';
import type { PageInfo } from './page-info';

export interface FeaturedListResponse {
  code: 0;
  data: unknown & { items: CatalogFeaturedSlot[]; pageInfo: PageInfo; };
  /** Server-owned request correlation id. */
  traceId: string;
}
