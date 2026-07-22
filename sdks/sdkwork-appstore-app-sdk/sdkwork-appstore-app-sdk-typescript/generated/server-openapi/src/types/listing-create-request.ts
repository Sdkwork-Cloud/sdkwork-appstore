export interface ListingCreateRequest {
  appId: string;
  appKey: string;
  publisherId: string;
  listingSlug?: string;
  pricingModel?: string;
  defaultLocale: string;
}
