import type { WishlistItem } from './wishlist-item';

export interface WishlistItemResponse {
  code: 0;
  data: unknown & { item: WishlistItem; };
  /** Server-owned request correlation id. */
  traceId: string;
}
