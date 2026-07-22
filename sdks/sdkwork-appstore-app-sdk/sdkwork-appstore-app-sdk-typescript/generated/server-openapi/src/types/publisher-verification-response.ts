import type { PublisherVerification } from './publisher-verification';

export interface PublisherVerificationResponse {
  code: 0;
  data: unknown & { item: PublisherVerification; };
  /** Server-owned request correlation id. */
  traceId: string;
}
