import type { ListingSubmission } from './listing-submission';

export interface ListingSubmissionResponse {
  code: 0;
  data: unknown & { item: ListingSubmission; };
  /** Server-owned request correlation id. */
  traceId: string;
}
