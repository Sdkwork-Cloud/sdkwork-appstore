export interface UserLibraryItem {
  id: string;
  listingId: string;
  appKey: string;
  libraryStatus: string;
  installedReleaseId?: string;
  installedVersionCode?: string;
  installSource: string;
  platform: string;
  architecture?: string;
  deviceId?: string;
  installedAt?: string;
  removedAt?: string;
}
