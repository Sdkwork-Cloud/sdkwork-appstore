import { StoreApiResult, ReleaseStatus, PaginatedResponse } from './types';

export interface ReleaseChannel {
  id: string;
  channelCode: string;
  channelType: string;
  channelStatus: string;
  audienceScope: string;
}

export interface Release {
  id: string;
  releaseNo: string;
  listingId: string;
  channelId: string;
  versionName: string;
  versionCode: string;
  buildNumber?: string;
  releaseStatus: ReleaseStatus;
  minimumOsVersion?: string;
  submittedAt?: string;
  approvedAt?: string;
  publishedAt?: string;
  retiredAt?: string;
}

export interface ReleaseNoteLocalization {
  id: string;
  locale: string;
  releaseNotes: string;
}

export interface ReleaseArtifact {
  id: string;
  artifactNo: string;
  platform: string;
  architecture: string;
  packageFormat: string;
  artifactStatus: string;
  driveNodeId: string;
  fileSizeBytes: string;
  contentType: string;
  checksumSha256: string;
  minOsVersion?: string;
}

export interface ReleaseRollout {
  id: string;
  rolloutStrategy: string;
  rolloutStatus: string;
  targetPercentage: number;
  currentPercentage: number;
  startedAt?: string;
  completedAt?: string;
  pausedAt?: string;
}

export interface DownloadGrant {
  id: string;
  grantNo: string;
  listingId: string;
  releaseId: string;
  artifactId: string;
  grantStatus: string;
  grantReason: string;
  expiresAt: string;
  consumedAt?: string;
  downloadCount: number;
  maxDownloadCount: number;
}

export interface ReleaseCreateRequest {
  listingId: string;
  channelCode: string;
  versionName: string;
  versionCode: string;
  buildNumber?: string;
  minimumOsVersion?: string;
}

export interface ReleaseUpdateRequest {
  minimumOsVersion?: string;
  releaseStatus?: string;
}

export interface ReleaseNotesUpsertRequest {
  locale: string;
  releaseNotes: string;
}

export interface ArtifactAttachRequest {
  platform: string;
  architecture: string;
  packageFormat: string;
  driveNodeId: string;
  fileSizeBytes: string;
  checksumSha256: string;
  contentType?: string;
  minOsVersion?: string;
  mediaResourceId?: string;
}

export interface RolloutUpdateRequest {
  rolloutStrategy: string;
  targetPercentage: number;
  regionFilter?: string[];
  deviceFilter?: Record<string, unknown>;
}

export interface CheckUpdateRequest {
  plusAppKey: string;
  channelCode: string;
  installedVersionCode: string;
  platform: string;
  architecture?: string;
}

export interface CheckUpdateData {
  hasUpdate: boolean;
  releaseId?: string;
  versionName?: string;
  versionCode?: string;
  artifactId?: string;
}

export interface ResolveDownloadData {
  downloadUrl: string;
  expiresAt: string;
  checksumSha256: string;
  fileSizeBytes: string;
}

export type ReleaseResponse = StoreApiResult<Release>;
export type ReleaseArtifactResponse = StoreApiResult<ReleaseArtifact>;
export type ReleaseRolloutResponse = StoreApiResult<ReleaseRollout>;
export type DownloadGrantResponse = StoreApiResult<DownloadGrant>;
export type CheckUpdateResponse = StoreApiResult<CheckUpdateData>;
export type ResolveDownloadResponse = StoreApiResult<ResolveDownloadData>;
