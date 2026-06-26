use sdkwork_appstore_library_service::domain::results::{
    AddWishlistItemResult, ConsumeDownloadGrantResult, CreateDownloadGrantResult,
    LibraryInstallResult, LibraryUninstallResult, LibraryUpdatesCheckResult,
    ListLibraryItemsResult, ListWishlistItemsResult, RemoveWishlistItemResult,
    RetrieveLibraryItemResult,
};

pub fn map_list_library_items_response(result: ListLibraryItemsResult) -> ListLibraryItemsResult {
    result
}

pub fn map_retrieve_library_item_response(
    result: RetrieveLibraryItemResult,
) -> RetrieveLibraryItemResult {
    result
}

pub fn map_library_install_response(result: LibraryInstallResult) -> LibraryInstallResult {
    result
}

pub fn map_library_uninstall_response(result: LibraryUninstallResult) -> LibraryUninstallResult {
    result
}

pub fn map_library_updates_check_response(
    result: LibraryUpdatesCheckResult,
) -> LibraryUpdatesCheckResult {
    result
}

pub fn map_list_wishlist_items_response(
    result: ListWishlistItemsResult,
) -> ListWishlistItemsResult {
    result
}

pub fn map_add_wishlist_item_response(result: AddWishlistItemResult) -> AddWishlistItemResult {
    result
}

pub fn map_remove_wishlist_item_response(
    result: RemoveWishlistItemResult,
) -> RemoveWishlistItemResult {
    result
}

pub fn map_create_download_grant_response(
    result: CreateDownloadGrantResult,
) -> CreateDownloadGrantResult {
    result
}

pub fn map_consume_download_grant_response(
    result: ConsumeDownloadGrantResult,
) -> ConsumeDownloadGrantResult {
    result
}
