export interface AutomationSubmissionCreateRequest {
  appKey: string;
  submissionType: string;
  release: { channelCode: string; versionName: string; versionCode: string; };
  artifacts?: { platform: string; architecture: string; packageFormat: string; driveNodeId: string; checksumSha256: string; fileSizeBytes?: string; }[];
}
