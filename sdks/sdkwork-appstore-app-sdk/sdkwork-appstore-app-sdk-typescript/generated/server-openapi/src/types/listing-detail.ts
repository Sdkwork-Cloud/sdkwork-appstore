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
