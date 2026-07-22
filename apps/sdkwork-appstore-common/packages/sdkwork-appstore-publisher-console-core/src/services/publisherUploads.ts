import type { DriveUploaderProgress } from '@sdkwork/drive-app-sdk';

export interface UploadListingMediaParams {
  file: File;
  organizationId: string;
  listingId: string;
  mediaRole: 'ICON' | 'SCREENSHOT' | 'PREVIEW_VIDEO' | 'FEATURE_GRAPHIC';
  platformScope?: string;
  locale?: string;
  onProgress?: (progress: DriveUploaderProgress) => void;
}

export interface UploadReleaseArtifactParams {
  file: File;
  organizationId: string;
  releaseId: string;
  platform: string;
  architecture: string;
  packageFormat: string;
  onProgress?: (progress: DriveUploaderProgress) => void;
}

export interface PublisherUploadHandlers {
  uploadListingMedia: (params: UploadListingMediaParams) => Promise<unknown>;
  uploadReleaseArtifact: (params: UploadReleaseArtifactParams) => Promise<unknown>;
}

let uploadHandlers: PublisherUploadHandlers | null = null;

/** Inject Drive upload helpers from the app root (sdkwork-drive + store attach APIs). */
export function configurePublisherUploads(handlers: PublisherUploadHandlers): void {
  uploadHandlers = handlers;
}

export function getPublisherUploads(): PublisherUploadHandlers {
  if (!uploadHandlers) {
    throw new Error(
      'Publisher uploads are not configured. Call configurePublisherUploads() during app bootstrap.',
    );
  }
  return uploadHandlers;
}
