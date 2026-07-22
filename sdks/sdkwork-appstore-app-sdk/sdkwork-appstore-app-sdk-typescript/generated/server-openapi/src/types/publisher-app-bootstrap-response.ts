import type { ListingSummary } from './listing-summary';
import type { StoreAppSummary } from './store-app-summary';

export interface PublisherAppBootstrapResponse {
  app: StoreAppSummary;
  listing: ListingSummary;
}
