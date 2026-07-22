export interface ReleaseCheckUpdateResponse {
  code: 0;
  data: unknown & { item: { updateAvailable?: boolean; releaseId?: string; versionName?: string; versionCode?: string; mandatory?: boolean; artifactId?: string; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}
