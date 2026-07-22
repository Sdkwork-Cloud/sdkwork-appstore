export interface DownloadGrant {
  id: string;
  grantNo: string;
  listingId: string;
  releaseId: string;
  artifactId: string;
  grantStatus: string;
  grantReason: string;
  expiresAt: string;
  consumedAt?: string;
  downloadCount: number;
  maxDownloadCount: number;
}
