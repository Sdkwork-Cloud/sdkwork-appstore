import { StoreApiResult, MediaResource, PricingModel, ListingStatus, StorefrontVisibility, ReviewStatus, PaginatedResponse } from './types';

export interface ListingSummary {
  id: string;
  appId?: string;
  appKey: string;
  displayName: string;
  subtitle?: string;
  listingSlug: string;
  pricingModel: PricingModel;
  icon?: MediaResource;
  averageRating?: string;
  ratingCount: number;
}

export interface ListingDetail extends ListingSummary {
  listingStatus: ListingStatus;
  reviewStatus: ReviewStatus;
  commentsThreadId?: string;
  currentReleaseId?: string;
  categories: string[];
  localizations: ListingLocalization[];
  media: ListingMedia[];
  storefrontVisibility: StorefrontVisibility;
  downloadCount: number;
  officialWebsiteUrl?: string;
  supportUrl?: string;
  privacyPolicyUrl?: string;
}

export interface ListingLocalization {
  id: string;
  locale: string;
  displayName: string;
  subtitle?: string;
  shortDescription: string;
  fullDescription: string;
  whatsNewSummary?: string;
  keywords: string[];
}

export interface ListingMedia {
  id: string;
  mediaRole: 'icon' | 'screenshot' | 'preview_video' | 'feature_graphic';
  mediaResourceId: string;
  driveNodeId?: string;
  platformScope: string;
  sortOrder: number;
  locale?: string;
}

export interface ListingCategoryBinding {
  id: string;
  categoryId: string;
  isPrimary: boolean;
}

export interface RegionalAvailability {
  id: string;
  regionCode: string;
  availabilityStatus: string;
  effectiveAt: string;
  expiresAt?: string;
}

export interface ListingSubmission {
  id: string;
  submissionNo: string;
  submissionType: string;
  submissionStatus: SubmissionStatus;
  submittedBy: string;
  submittedAt: string;
  releaseId?: string;
}

export type SubmissionStatus = 'submitted' | 'under_review' | 'approved' | 'rejected' | 'withdrawn';

export interface ListingCreateRequest {
  appId: string;
  appKey: string;
  publisherId: string;
  listingSlug?: string;
  pricingModel?: PricingModel;
  defaultLocale: string;
}

export interface ListingUpdateRequest {
  pricingModel?: PricingModel;
  officialWebsiteUrl?: string;
  supportUrl?: string;
  privacyPolicyUrl?: string;
}

export interface ListingLocalizationUpsertRequest {
  locale: string;
  displayName: string;
  subtitle?: string;
  shortDescription: string;
  fullDescription: string;
  whatsNewSummary?: string;
  keywords?: string[];
}

export interface ListingMediaAttachRequest {
  mediaRole: string;
  mediaResourceId: string;
  platformScope?: string;
  locale?: string;
}

export interface ListingCategoriesBindRequest {
  categoryIds: string[];
  primaryCategoryId?: string;
}

export interface ListingSubmissionCreateRequest {
  submissionType: string;
  releaseId?: string;
  idempotencyKey?: string;
}

export type ListingResponse = StoreApiResult<ListingDetail>;
export type ListingListResponse = StoreApiResult<PaginatedResponse<ListingSummary>>;
export type ListingMediaListResponse = StoreApiResult<ListingMedia[]>;
export type ListingSubmissionResponse = StoreApiResult<ListingSubmission>;
