export interface ReleaseCreateRequest {
  channelCode: string;
  versionName: string;
  versionCode: string;
  buildNumber?: string;
  minimumOsVersion?: string;
}
