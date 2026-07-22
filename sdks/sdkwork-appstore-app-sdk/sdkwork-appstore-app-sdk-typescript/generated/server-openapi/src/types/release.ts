export interface Release {
  id: string;
  releaseNo: string;
  listingId: string;
  channelId: string;
  versionName: string;
  versionCode: string;
  buildNumber?: string;
  releaseStatus: string;
  minimumOsVersion?: string;
  submittedAt?: string;
  approvedAt?: string;
  publishedAt?: string;
  retiredAt?: string;
}
