import type { ListingRating } from './listing-rating';
import type { PageInfo } from './page-info';

export interface ListingRatingListResponse {
  code: 0;
  data: unknown & { items: ListingRating[]; pageInfo: PageInfo; };
  /** Server-owned request correlation id. */
  traceId: string;
}
