import type { MediaResource } from './media-resource';

export interface ListingSummary {
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
}
