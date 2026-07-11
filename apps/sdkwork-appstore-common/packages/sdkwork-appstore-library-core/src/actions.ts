export interface StoreLibraryActionsClient {
  library: {
    uninstall: (data: { libraryItemId: string }) => Promise<unknown>;
  };
  wishlist: {
    removeItem: (listingId: string) => Promise<unknown>;
  };
}

export async function uninstallLibraryItem(
  client: StoreLibraryActionsClient,
  libraryItemId: string,
): Promise<void> {
  const id = libraryItemId.trim();
  if (!id) {
    throw new Error('库项 ID 无效');
  }
  await client.library.uninstall({ libraryItemId: id });
}

export async function removeWishlistListing(
  client: StoreLibraryActionsClient,
  listingId: string,
): Promise<void> {
  const id = listingId.trim();
  if (!id) {
    throw new Error('Listing ID 无效');
  }
  await client.wishlist.removeItem(id);
}
