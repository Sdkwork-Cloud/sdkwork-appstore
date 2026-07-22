import type { PublisherAppBootstrapResponse } from './publisher-app-bootstrap-response';

export interface AppstorePublishersMeAppsCreateResponse201 {
  code: 0;
  data: unknown & { item: PublisherAppBootstrapResponse; };
  /** Server-owned request correlation id. */
  traceId: string;
}
