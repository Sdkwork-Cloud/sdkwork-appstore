export interface ReleaseArtifactAttachRequest {
  platform: string;
  architecture: string;
  packageFormat: string;
  driveNodeId: string;
  checksumSha256: string;
  fileSizeBytes: string;
  contentType?: string;
  mediaResourceId?: string;
  minOsVersion?: string;
}
