import type { CatalogCollection } from './catalog-collection';

export interface AppstoreCatalogCollectionsRetrieveResponse {
  code: 0;
  data: unknown & { item: CatalogCollection; };
  /** Server-owned request correlation id. */
  traceId: string;
}
