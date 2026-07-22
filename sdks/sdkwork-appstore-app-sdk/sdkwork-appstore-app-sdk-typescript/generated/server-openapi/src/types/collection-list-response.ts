import type { CatalogCollection } from './catalog-collection';
import type { PageInfo } from './page-info';

export interface CollectionListResponse {
  code: 0;
  data: unknown & { items: CatalogCollection[]; pageInfo: PageInfo; };
  /** Server-owned request correlation id. */
  traceId: string;
}
