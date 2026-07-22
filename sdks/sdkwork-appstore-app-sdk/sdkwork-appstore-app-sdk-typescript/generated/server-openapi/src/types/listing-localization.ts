export interface ListingLocalization {
  id: string;
  locale: string;
  displayName: string;
  subtitle?: string;
  shortDescription: string;
  fullDescription: string;
  whatsNewSummary?: string;
  keywords?: string[];
}
