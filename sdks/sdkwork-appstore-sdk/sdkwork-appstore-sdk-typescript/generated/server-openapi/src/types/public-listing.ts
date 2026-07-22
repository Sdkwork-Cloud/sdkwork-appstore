export interface PublicListing {
  id: string;
  publisherId: string;
  appId: string;
  appKey: string;
  listingSlug: string;
  listingType: string;
  pricingModel: string;
  listingStatus: string;
  primaryCategoryId?: string;
  defaultLocale: string;
  ageRatingCode?: string;
  officialWebsiteUrl?: string;
  supportUrl?: string;
  privacyPolicyUrl?: string;
  commentsThreadId?: string;
  commerceProductId?: string;
  currentReleaseId?: string;
  downloadCount: number;
  averageRating?: string;
  ratingCount: number;
  publishedAt?: string;
}
