import { coalesce } from '@sdkwork/utils';

export interface ListingSearchHit {
  id: string;
  listingSlug: string;
  displayName: string;
  subtitle?: string;
  developerName?: string;
  averageRating?: number;
  ratingCount?: number;
  downloadCount?: number;
  pricingModel?: string;
  priceLabel?: string;
  category?: string;
  iconUrl?: string;
}

export function mapListingSearchHit(item: unknown, index = 0): ListingSearchHit | null {
  if (!item || typeof item !== 'object') {
    return null;
  }
  const row = item as Record<string, unknown>;
  const id = readString(row, 'id', 'listingId', 'listing_id') || String(index);
  const listingSlug = readString(row, 'listing_slug', 'listingSlug', 'slug') || id;
  const displayName =
    readString(row, 'display_name', 'displayName', 'title') || listingSlug;
  return {
    id,
    listingSlug,
    displayName,
    subtitle: readString(row, 'subtitle') || undefined,
    developerName:
      readString(row, 'developer_name', 'developerName', 'publisherName', 'publisher_id') ||
      undefined,
    averageRating: readNumber(row, 'average_rating', 'averageRating', 'rating') || undefined,
    ratingCount: readNumber(row, 'rating_count', 'ratingCount') || undefined,
    downloadCount: readNumber(row, 'download_count', 'downloadCount') || undefined,
    pricingModel: readString(row, 'pricing_model', 'pricingModel') || undefined,
    priceLabel: readString(row, 'price_label', 'priceLabel') || undefined,
    category: readString(row, 'primary_category_id', 'primaryCategoryId', 'category') || undefined,
    iconUrl: readString(row, 'icon_media_resource_id', 'iconMediaResourceId', 'iconUrl') || undefined,
  };
}

function readString(record: Record<string, unknown>, ...keys: string[]): string {
  const values = keys.map((key) => {
    const value = record[key];
    return typeof value === 'string' ? value : undefined;
  });
  return coalesce(...values) ?? '';
}

function readNumber(record: Record<string, unknown>, ...keys: string[]): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return 0;
}
