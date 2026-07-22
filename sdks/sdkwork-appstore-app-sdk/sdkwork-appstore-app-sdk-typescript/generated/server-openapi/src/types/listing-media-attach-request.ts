export interface ListingMediaAttachRequest {
  mediaRole: 'ICON' | 'SCREENSHOT' | 'PREVIEW_VIDEO' | 'FEATURE_GRAPHIC';
  mediaResourceId: string;
  platformScope?: string;
  locale?: string;
}
