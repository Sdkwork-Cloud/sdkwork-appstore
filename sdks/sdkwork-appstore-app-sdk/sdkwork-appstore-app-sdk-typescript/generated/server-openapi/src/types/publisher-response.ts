import type { Publisher } from './publisher';

export interface PublisherResponse {
  code: 0;
  data: unknown & { item: Publisher; };
  /** Server-owned request correlation id. */
  traceId: string;
}
