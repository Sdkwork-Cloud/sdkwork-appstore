import type { ReleaseArtifact } from './release-artifact';

export interface ReleaseArtifactResponse {
  code: 0;
  data: unknown & { item: ReleaseArtifact; };
  /** Server-owned request correlation id. */
  traceId: string;
}
