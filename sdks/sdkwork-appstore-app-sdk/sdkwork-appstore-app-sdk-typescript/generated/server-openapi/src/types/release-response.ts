import type { Release } from './release';

export interface ReleaseResponse {
  code: 0;
  data: unknown & { item: Release; };
  /** Server-owned request correlation id. */
  traceId: string;
}
