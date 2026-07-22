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
  averageRating?: string;
  ratingCount?: number;
}
