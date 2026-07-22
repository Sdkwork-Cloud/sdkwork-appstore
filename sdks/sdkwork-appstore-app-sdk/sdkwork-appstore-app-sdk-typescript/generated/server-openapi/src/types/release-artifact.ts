export interface ReleaseArtifact {
  id: string;
  artifactNo: string;
  platform: string;
  architecture: string;
  packageFormat: string;
  artifactStatus: string;
  driveNodeId: string;
  fileSizeBytes: string;
  contentType: string;
  checksumSha256: string;
  minOsVersion?: string;
}
