import type { ComplianceProfile } from './compliance-profile';

export interface ComplianceProfileResponse {
  code: 0;
  data: unknown & { item: ComplianceProfile; };
  /** Server-owned request correlation id. */
  traceId: string;
}
