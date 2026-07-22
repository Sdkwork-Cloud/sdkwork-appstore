import type { ListingMedia } from './listing-media';

export interface ListingMediaResponse {
  code: 0;
  data: unknown & { item: ListingMedia; };
  /** Server-owned request correlation id. */
  traceId: string;
}
