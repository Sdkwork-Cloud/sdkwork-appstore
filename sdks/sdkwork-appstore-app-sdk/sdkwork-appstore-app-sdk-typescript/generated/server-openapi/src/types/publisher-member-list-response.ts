import type { PageInfo } from './page-info';
import type { PublisherMember } from './publisher-member';

export interface PublisherMemberListResponse {
  code: 0;
  data: unknown & { items: PublisherMember[]; pageInfo: PageInfo; };
  /** Server-owned request correlation id. */
  traceId: string;
}
