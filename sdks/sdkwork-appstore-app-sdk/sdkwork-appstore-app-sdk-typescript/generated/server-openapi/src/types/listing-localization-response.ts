import type { ListingLocalization } from './listing-localization';

export interface ListingLocalizationResponse {
  code: 0;
  data: unknown & { item: ListingLocalization; };
  /** Server-owned request correlation id. */
  traceId: string;
}
