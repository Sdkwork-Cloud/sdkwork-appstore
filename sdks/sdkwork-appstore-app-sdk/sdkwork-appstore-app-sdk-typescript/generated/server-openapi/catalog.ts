import { StoreApiResult, MediaResource, PricingModel, PaginatedResponse, ListingSummary } from './types';

export interface Category {
  id: string;
  categoryCode: string;
  parentCategoryId?: string;
  categoryLevel: number;
  status: string;
  sortOrder: number;
  iconMediaResourceId?: string;
  localizations: CategoryLocalization[];
}

export interface CategoryLocalization {
  id: string;
  locale: string;
  displayName: string;
  description?: string;
}

export interface CatalogCollection {
  id: string;
  collectionCode: string;
  collectionType: string;
  status: string;
  audienceScope: string;
  sortOrder: number;
  coverMediaResourceId?: string;
  startsAt?: string;
  endsAt?: string;
  localizations: CatalogCollectionLocalization[];
  items: CatalogCollectionItem[];
}

export interface CatalogCollectionLocalization {
  id: string;
  locale: string;
  displayName: string;
  description?: string;
}

export interface CatalogCollectionItem {
  id: string;
  listingId: string;
  sortOrder: number;
  highlight?: Record<string, unknown>;
  startsAt?: string;
  endsAt?: string;
}

export interface CatalogFeaturedSlot {
  id: string;
  slotCode: string;
  listingId: string;
  status: string;
  audienceScope: string;
  platformScope: string;
  regionScope: string[];
  startsAt: string;
  endsAt: string;
}

export interface CatalogChartSnapshot {
  id: string;
  chartCode: string;
  snapshotDate: string;
  locale: string;
  platformScope: string;
  rankingJson: unknown;
  generatedAt: string;
}

export interface HomeFeedData {
  featuredSlots: CatalogFeaturedSlot[];
  collections: CatalogCollection[];
  charts: CatalogChartSnapshot[];
}

export type HomeFeedResponse = StoreApiResult<HomeFeedData>;
export type CategoryListResponse = StoreApiResult<PaginatedResponse<Category>>;
export type CategoryResponse = StoreApiResult<Category>;
export type CollectionListResponse = StoreApiResult<PaginatedResponse<CatalogCollection>>;
export type CollectionResponse = StoreApiResult<CatalogCollection>;
export type FeaturedListResponse = StoreApiResult<CatalogFeaturedSlot[]>;
export type ChartsResponse = StoreApiResult<CatalogChartSnapshot>;
export type ListingSearchResponse = StoreApiResult<PaginatedResponse<ListingSummary>>;
