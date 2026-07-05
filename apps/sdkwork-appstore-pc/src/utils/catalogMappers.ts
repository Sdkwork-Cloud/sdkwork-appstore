import type { AppCardData } from '@/components/cards/AppCard';
import type { CollectionCardData } from '@/components/cards/CollectionCard';
import type { StoryCardData } from '@/components/cards/StoryCard';
import type { FeaturedBannerData } from '@/components/cards/FeaturedBanner';
import type { MediaItem } from '@/components/listing/ScreenshotGallery';

type UnknownRecord = { [key: string]: unknown };

function readString(record: UnknownRecord, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function readNumber(record: UnknownRecord, ...keys: string[]): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
}

function readArray(record: UnknownRecord, key: string): unknown[] {
  const value = record[key];
  return Array.isArray(value) ? value : [];
}

function readObject(record: UnknownRecord, key: string): UnknownRecord | null {
  const value = record[key];
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function toMediaUrl(resourceId: string | undefined): string | undefined {
  return resourceId && resourceId.trim() ? resourceId.trim() : undefined;
}

export function formatDownloadCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M+`;
  if (count >= 1_000) return `${Math.round(count / 1_000)}K+`;
  return count > 0 ? String(count) : '';
}

export function formatPricingLabel(model?: string, priceLabel?: string): string {
  if (priceLabel) return priceLabel;
  if (!model) return '免费';
  const normalized = model.toUpperCase();
  if (normalized === 'FREE' || normalized === 'FREEMIUM') return '免费';
  if (normalized === 'PAID' || normalized === 'SUBSCRIPTION') return '付费';
  return '免费';
}

/** Maps a ListingSummary (snake_case) record to AppCardData. */
export function mapListingSummaryToAppCard(item: unknown): AppCardData | null {
  if (!item || typeof item !== 'object') return null;
  const record = item as UnknownRecord;
  const id = readString(record, 'id', 'listing_id', 'listingId');
  const listingSlug = readString(record, 'listing_slug', 'listingSlug');
  if (!id && !listingSlug) return null;
  const iconResourceId = readString(record, 'icon_media_resource_id', 'iconMediaResourceId');
  return {
    id: id || listingSlug,
    listingSlug: listingSlug || id,
    displayName: readString(record, 'display_name', 'displayName') || '未命名应用',
    subtitle: readString(record, 'subtitle') || undefined,
    iconUrl: toMediaUrl(iconResourceId),
    averageRating: readNumber(record, 'average_rating', 'averageRating') || undefined,
    ratingCount: readNumber(record, 'rating_count', 'ratingCount') || undefined,
    downloadCount: readNumber(record, 'download_count', 'downloadCount') || undefined,
    pricingModel: readString(record, 'pricing_model', 'pricingModel') || undefined,
    category: readString(record, 'primary_category_id', 'primaryCategoryId') || undefined,
  };
}

/** Maps a CatalogCollection (snake_case) record to CollectionCardData. */
export function mapCollectionToCollectionCard(item: unknown): CollectionCardData | null {
  if (!item || typeof item !== 'object') return null;
  const record = item as UnknownRecord;
  const collection = readObject(record, 'collection') ?? record;
  const localizations = readArray(record, 'localizations');
  const items = readArray(record, 'items');
  const loc = localizations[0] && typeof localizations[0] === 'object' ? (localizations[0] as UnknownRecord) : {};
  const id = readString(collection, 'id', 'collection_code', 'collectionCode');
  if (!id) return null;
  const coverResourceId = readString(collection, 'cover_media_resource_id', 'coverMediaResourceId');
  return {
    id,
    title: readString(loc, 'display_name', 'displayName') || readString(collection, 'collection_code', 'collectionCode'),
    subtitle: readString(loc, 'description') || undefined,
    coverUrl: toMediaUrl(coverResourceId),
    appIcons: items
      .map((it) => {
        if (!it || typeof it !== 'object') return undefined;
        const r = it as UnknownRecord;
        return toMediaUrl(readString(r, 'icon_media_resource_id', 'iconMediaResourceId'));
      })
      .filter((url): url is string => !!url)
      .slice(0, 4),
    appCount: items.length || undefined,
  };
}

/** Maps a CatalogCollection (snake_case) record to StoryCardData (editorial variant). */
export function mapCollectionToStoryCard(item: unknown): StoryCardData | null {
  if (!item || typeof item !== 'object') return null;
  const record = item as UnknownRecord;
  const collection = readObject(record, 'collection') ?? record;
  const localizations = readArray(record, 'localizations');
  const items = readArray(record, 'items');
  const loc = localizations[0] && typeof localizations[0] === 'object' ? (localizations[0] as UnknownRecord) : {};
  const id = readString(collection, 'id', 'collection_code', 'collectionCode');
  if (!id) return null;
  const coverResourceId = readString(collection, 'cover_media_resource_id', 'coverMediaResourceId');
  return {
    id,
    collectionId: id,
    title: readString(loc, 'display_name', 'displayName') || readString(collection, 'collection_code', 'collectionCode'),
    subtitle: readString(loc, 'description') || undefined,
    coverUrl: toMediaUrl(coverResourceId),
    ctaText: '查看合集',
    appIcons: items
      .map((it) => {
        if (!it || typeof it !== 'object') return undefined;
        const r = it as UnknownRecord;
        return toMediaUrl(readString(r, 'icon_media_resource_id', 'iconMediaResourceId'));
      })
      .filter((url): url is string => !!url)
      .slice(0, 3),
  };
}

/** Maps a CatalogFeaturedSlot (snake_case) record to FeaturedBannerData. */
export function mapFeaturedSlotToBanner(item: unknown, fallbackTitle?: string): FeaturedBannerData | null {
  if (!item || typeof item !== 'object') return null;
  const record = item as UnknownRecord;
  const id = readString(record, 'id', 'slot_code', 'slotCode');
  if (!id) return null;
  const listingId = readString(record, 'listing_id', 'listingId');
  return {
    id,
    title: fallbackTitle || '编辑精选',
    subtitle: readString(record, 'subtitle') || undefined,
    ctaText: '立即查看',
    ctaHref: listingId ? `/app/${encodeURIComponent(listingId)}` : '/category/featured',
    targetKind: 'listing',
    targetId: listingId || undefined,
  };
}

/** Maps a CategoryWithLocalizations (snake_case) record to a category tile. */
export interface CategoryTileData {
  id: string;
  to: string;
  title: string;
  description: string;
  iconResourceId?: string;
}

export function mapCategoryToTile(item: unknown): CategoryTileData | null {
  if (!item || typeof item !== 'object') return null;
  const record = item as UnknownRecord;
  const category = readObject(record, 'category') ?? record;
  const localizations = readArray(record, 'localizations');
  const loc = localizations[0] && typeof localizations[0] === 'object' ? (localizations[0] as UnknownRecord) : {};
  const id = readString(category, 'id', 'category_code', 'categoryCode');
  if (!id) return null;
  const iconResourceId = readString(category, 'icon_media_resource_id', 'iconMediaResourceId');
  return {
    id,
    to: `/category/${encodeURIComponent(id)}`,
    title: readString(loc, 'display_name', 'displayName') || readString(category, 'category_code', 'categoryCode'),
    description: readString(loc, 'description') || '探索应用',
    iconResourceId: toMediaUrl(iconResourceId),
  };
}

/** Maps a ListingMedia (snake_case) record to a MediaItem for ScreenshotGallery. */
export function mapMediaToItem(item: unknown): MediaItem | null {
  if (!item || typeof item !== 'object') return null;
  const record = item as UnknownRecord;
  const id = readString(record, 'id');
  if (!id) return null;
  const kindRaw = readString(record, 'media_kind', 'mediaKind', 'kind').toUpperCase();
  const kind: MediaItem['kind'] =
    kindRaw === 'VIDEO_PREVIEW' || kindRaw === 'VIDEO'
      ? 'video_preview'
      : kindRaw === 'PROMO'
        ? 'promo'
        : 'screenshot';
  const urlResourceId = readString(record, 'media_resource_id', 'mediaResourceId', 'url');
  const thumbnailResourceId = readString(record, 'thumbnail_resource_id', 'thumbnailResourceId', 'thumbnail_url', 'thumbnailUrl');
  return {
    id,
    kind,
    url: toMediaUrl(urlResourceId),
    thumbnailUrl: toMediaUrl(thumbnailResourceId),
    videoUrl: kind === 'video_preview' ? toMediaUrl(readString(record, 'video_url', 'videoUrl')) : undefined,
    width: readNumber(record, 'width') || undefined,
    height: readNumber(record, 'height') || undefined,
    locale: readString(record, 'locale') || undefined,
    platform: readString(record, 'platform_scope', 'platformScope', 'platform') || undefined,
    sortOrder: readNumber(record, 'sort_order', 'sortOrder') || undefined,
  };
}

/** Maps a Release (snake_case) record to a version history entry. */
export interface ReleaseHistoryEntry {
  id: string;
  versionName: string;
  versionCode: string;
  releaseStatus: string;
  publishedAt: string;
  releaseNotes: string;
}

export function mapReleaseToHistoryEntry(item: unknown): ReleaseHistoryEntry | null {
  if (!item || typeof item !== 'object') return null;
  const record = item as UnknownRecord;
  const id = readString(record, 'id', 'release_no', 'releaseNo');
  if (!id) return null;
  return {
    id,
    versionName: readString(record, 'version_name', 'versionName') || '—',
    versionCode: readString(record, 'version_code', 'versionCode') || '—',
    releaseStatus: readString(record, 'release_status', 'releaseStatus') || 'unknown',
    publishedAt: readString(record, 'published_at', 'publishedAt') || '—',
    releaseNotes: readString(record, 'release_notes_default_locale', 'releaseNotesDefaultLocale') || '',
  };
}
