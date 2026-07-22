export interface LibraryUpdatesCheckRequest {
  items: { appKey: string; platform: string; installedVersionCode: string; }[];
}
