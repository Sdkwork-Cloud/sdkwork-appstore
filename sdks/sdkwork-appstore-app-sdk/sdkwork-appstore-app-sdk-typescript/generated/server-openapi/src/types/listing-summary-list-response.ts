import type { ListingSummary } from './listing-summary';

export interface ListingSummaryListResponse {
  code: 0;
  data: unknown & { items: ListingSummary[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}
