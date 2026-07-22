export interface ReleaseRolloutUpdateRequest {
  rolloutStrategy: 'FULL' | 'STAGED' | 'PAUSE';
  targetPercentage: number;
  regionFilter?: string[];
  deviceFilter?: Record<string, unknown>;
}
