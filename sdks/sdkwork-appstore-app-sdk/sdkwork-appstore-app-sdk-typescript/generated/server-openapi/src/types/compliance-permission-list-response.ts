import type { CompliancePermissionDisclosure } from './compliance-permission-disclosure';
import type { PageInfo } from './page-info';

export interface CompliancePermissionListResponse {
  code: 0;
  data: unknown & { items: CompliancePermissionDisclosure[]; pageInfo: PageInfo; };
  /** Server-owned request correlation id. */
  traceId: string;
}
