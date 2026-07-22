export interface ReleaseCheckUpdateRequest {
  appKey: string;
  platform: string;
  architecture?: string;
  installedVersionCode: string;
  channelCode: string;
  deviceId?: string;
  regionCode?: string;
}
