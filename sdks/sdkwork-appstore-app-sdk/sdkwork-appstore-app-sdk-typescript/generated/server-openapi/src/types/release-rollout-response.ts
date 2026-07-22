import type { ReleaseRollout } from './release-rollout';

export interface ReleaseRolloutResponse {
  code: 0;
  data: unknown & { item: ReleaseRollout; };
  /** Server-owned request correlation id. */
  traceId: string;
}
