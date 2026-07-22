export interface CatalogCollectionItem {
  id: string;
  listingId: string;
  sortOrder: number;
  highlight?: Record<string, unknown>;
  startsAt?: string;
  endsAt?: string;
}
