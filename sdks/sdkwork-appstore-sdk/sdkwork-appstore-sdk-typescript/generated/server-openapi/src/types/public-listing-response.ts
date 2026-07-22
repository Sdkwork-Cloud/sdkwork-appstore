import type { PublicListing } from './public-listing';

export interface PublicListingResponse {
  code: 0;
  data: unknown & { item: PublicListing; };
  /** Server-owned request correlation id. */
  traceId: string;
}
