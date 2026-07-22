export interface ArtifactResolveDownloadResponse {
  code: 0;
  data: unknown & { item: { downloadUrl?: string; expiresAt?: string; checksumSha256?: string; fileSizeBytes?: string; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}
