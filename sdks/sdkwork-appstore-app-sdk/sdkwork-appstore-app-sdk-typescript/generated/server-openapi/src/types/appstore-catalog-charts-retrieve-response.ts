import type { CatalogChartSnapshot } from './catalog-chart-snapshot';

export interface AppstoreCatalogChartsRetrieveResponse {
  code: 0;
  data: unknown & { item: CatalogChartSnapshot; };
  /** Server-owned request correlation id. */
  traceId: string;
}
