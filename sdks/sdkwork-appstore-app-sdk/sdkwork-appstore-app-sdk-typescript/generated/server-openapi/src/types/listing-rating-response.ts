import type { ListingRating } from './listing-rating';

export interface ListingRatingResponse {
  code: 0;
  data: unknown & { item: ListingRating; };
  /** Server-owned request correlation id. */
  traceId: string;
}
