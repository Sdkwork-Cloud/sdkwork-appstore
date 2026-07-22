export interface PublicRelease {
  id: string;
  listingId: string;
  releaseNo: string;
  versionName: string;
  versionCode: string;
  buildNumber?: string;
  releaseStatus: string;
  minimumOsVersion?: string;
  publishedAt?: string;
}
