import type { PublicRelease } from './public-release';

export interface PublicReleaseResponse {
  code: 0;
  data: unknown & { item: PublicRelease; };
  /** Server-owned request correlation id. */
  traceId: string;
}
