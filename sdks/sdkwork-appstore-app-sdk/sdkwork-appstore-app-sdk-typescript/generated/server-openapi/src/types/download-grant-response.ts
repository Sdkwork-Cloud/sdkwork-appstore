import type { DownloadGrant } from './download-grant';

export interface DownloadGrantResponse {
  code: 0;
  data: unknown & { item: DownloadGrant; };
  /** Server-owned request correlation id. */
  traceId: string;
}
