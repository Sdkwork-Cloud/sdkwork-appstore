import type { HomeFeedData } from './home-feed-data';

export interface HomeFeedResponse {
  code: 0;
  data: unknown & { item: HomeFeedData; };
  /** Server-owned request correlation id. */
  traceId: string;
}
