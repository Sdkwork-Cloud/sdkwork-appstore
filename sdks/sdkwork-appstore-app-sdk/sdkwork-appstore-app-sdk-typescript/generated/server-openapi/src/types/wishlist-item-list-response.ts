import type { PageInfo } from './page-info';
import type { WishlistItem } from './wishlist-item';

export interface WishlistItemListResponse {
  code: 0;
  data: unknown & { items: WishlistItem[]; pageInfo: PageInfo; };
  /** Server-owned request correlation id. */
  traceId: string;
}
