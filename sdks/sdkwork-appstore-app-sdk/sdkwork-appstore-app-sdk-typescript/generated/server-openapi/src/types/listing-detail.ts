import type { MediaResource } from './media-resource';

export interface ListingDetail {
  id: string;
  appId?: string;
  appKey: string;
  displayName: string;
  subtitle?: string;
  listingSlug: string;
  pricingModel: 'FREE' | 'PAID' | 'FREEMIUM' | 'SUBSCRIPTION';
  icon?: MediaResource;
  /** Publisher display name of the listing owner. */
  developerName?: string;
  /** Localized short/full description preview. */
  description?: string;
  currentVersion?: string;
  fileSizeBytes?: string;
  whatsNewSummary?: string;
  releasedAt?: string;
  averageRating?: string;
  ratingCount?: number;
  listingStatus?: string;
  reviewStatus?: string;
  commentsThreadId?: string;
  /** Commerce catalog product id for paid checkout (clawrouter/commerce domain). */
  commerceProductId?: string;
  currentReleaseId?: string;
  categories?: string[];
}
