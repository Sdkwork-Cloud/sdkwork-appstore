import type { CatalogChartSnapshot } from './catalog-chart-snapshot';
import type { CatalogCollection } from './catalog-collection';
import type { CatalogFeaturedSlot } from './catalog-featured-slot';

export interface HomeFeedData {
  featuredSlots: CatalogFeaturedSlot[];
  collections: CatalogCollection[];
  charts: CatalogChartSnapshot[];
}
