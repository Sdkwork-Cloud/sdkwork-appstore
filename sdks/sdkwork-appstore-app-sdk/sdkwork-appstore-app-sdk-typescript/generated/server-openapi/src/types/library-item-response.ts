import type { UserLibraryItem } from './user-library-item';

export interface LibraryItemResponse {
  code: 0;
  data: unknown & { item: UserLibraryItem; };
  /** Server-owned request correlation id. */
  traceId: string;
}
