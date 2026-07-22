import type { ListingDetail } from './listing-detail';

export interface ListingResponse {
  code: 0;
  data: unknown & { item: ListingDetail; };
  /** Server-owned request correlation id. */
  traceId: string;
}
