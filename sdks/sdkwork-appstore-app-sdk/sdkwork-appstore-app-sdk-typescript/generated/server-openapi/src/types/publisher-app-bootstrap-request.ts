export interface PublisherAppBootstrapRequest {
  appKey: string;
  displayName: string;
  defaultLocale: string;
  appType?: string;
  listingSlug?: string;
  pricingModel?: string;
}
