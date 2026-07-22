import type { CatalogCollectionItem } from './catalog-collection-item';
import type { CatalogCollectionLocalization } from './catalog-collection-localization';

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
