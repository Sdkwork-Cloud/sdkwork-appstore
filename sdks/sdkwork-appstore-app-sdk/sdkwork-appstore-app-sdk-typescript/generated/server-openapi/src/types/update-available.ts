export interface UpdateAvailable {
  appKey: string;
  platform: string;
  installedVersionCode: string;
  latestVersionCode: string;
  latestVersionName: string;
  releaseId: string;
  artifactId?: string;
  fileSizeBytes?: string;
}
