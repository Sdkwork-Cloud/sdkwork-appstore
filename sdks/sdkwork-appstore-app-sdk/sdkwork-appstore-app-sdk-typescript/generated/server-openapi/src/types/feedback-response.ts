import type { Feedback } from './feedback';

export interface FeedbackResponse {
  code: 0;
  data: unknown & { item: Feedback; };
  /** Server-owned request correlation id. */
  traceId: string;
}
