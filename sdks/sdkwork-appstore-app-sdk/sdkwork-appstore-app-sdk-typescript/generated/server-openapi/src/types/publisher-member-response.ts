import type { PublisherMember } from './publisher-member';

export interface PublisherMemberResponse {
  code: 0;
  data: unknown & { item: PublisherMember; };
  /** Server-owned request correlation id. */
  traceId: string;
}
