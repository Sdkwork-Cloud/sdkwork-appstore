export interface ReleaseRollout {
  id: string;
  rolloutStrategy: string;
  rolloutStatus: string;
  targetPercentage: number;
  currentPercentage: number;
  startedAt?: string;
  completedAt?: string;
  pausedAt?: string;
}
