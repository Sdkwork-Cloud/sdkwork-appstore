export interface LibraryInstallRequest {
  listingId: string;
  platform: string;
  architecture?: string;
  deviceId?: string;
}
