import { StoreApiResult, PaginatedResponse } from './types';

export interface UserLibraryItem {
  id: string;
  listingId: string;
  appId: string;
  appKey: string;
  libraryStatus: 'installed' | 'uninstalled';
  installedReleaseId?: string;
  installedVersionCode?: string;
  installSource: string;
  platform: string;
  architecture?: string;
  deviceId?: string;
  installedAt?: string;
  removedAt?: string;
}

export interface UserWishlistItem {
  id: string;
  listingId: string;
  wishlistStatus: 'active' | 'removed';
  createdAt: string;
}

export interface InstallEvent {
  id: string;
  eventNo: string;
  listingId: string;
  releaseId?: string;
  eventType: 'install' | 'uninstall' | 'update' | 'reinstall';
  platform: string;
  occurredAt: string;
}

export interface UpdateAvailable {
  listingId: string;
  currentVersionCode?: string;
  latestVersionCode: string;
  latestVersionName: string;
  releaseId: string;
}

export interface LibraryInstallRequest {
  listingId: string;
  platform: string;
  architecture?: string;
  deviceId?: string;
}

export interface LibraryUpdatesCheckRequest {
  platform: string;
  items: { listingId: string; installedVersionCode: string }[];
}

export type LibraryItemListResponse = StoreApiResult<PaginatedResponse<UserLibraryItem>>;
export type LibraryItemResponse = StoreApiResult<UserLibraryItem>;
export type WishlistItemListResponse = StoreApiResult<PaginatedResponse<UserWishlistItem>>;
export type WishlistItemResponse = StoreApiResult<UserWishlistItem>;
export type LibraryInstallResponse = StoreApiResult<{ libraryItem: UserLibraryItem; installEvent: InstallEvent }>;
export type LibraryUpdatesCheckResponse = StoreApiResult<UpdateAvailable[]>;
