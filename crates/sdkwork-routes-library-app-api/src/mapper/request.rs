use sdkwork_appstore_library_service::domain::commands::{
    AddWishlistItemRequest, ConsumeDownloadGrantRequest, CreateDownloadGrantRequest,
    LibraryInstallRequest, LibraryUninstallRequest, LibraryUpdatesCheckRequest,
    ListLibraryItemsRequest, ListWishlistItemsRequest, RemoveWishlistItemRequest,
    RetrieveLibraryItemRequest,
};
use sdkwork_appstore_library_service::domain::models::UpdateCheckItem;

pub fn map_list_library_items(
    cursor: Option<String>,
    page_size: Option<i32>,
) -> ListLibraryItemsRequest {
    let mut req = ListLibraryItemsRequest::new();
    if let Some(v) = cursor {
        req = req.with_cursor(v);
    }
    if let Some($1) = page_size {
        req = req.with_page_size(v);
    }
    req
}

pub fn map_retrieve_library_item(library_item_id: String) -> RetrieveLibraryItemRequest {
    RetrieveLibraryItemRequest::new(library_item_id)
}

pub fn map_library_install(
    listing_id: String,
    platform: String,
    architecture: Option<String>,
    device_id: Option<String>,
) -> LibraryInstallRequest {
    let mut req = LibraryInstallRequest::new(listing_id, platform);
    if let Some(v) = architecture {
        req = req.with_architecture(v);
    }
    if let Some(v) = device_id {
        req = req.with_device_id(v);
    }
    req
}

pub fn map_library_uninstall(library_item_id: String) -> LibraryUninstallRequest {
    LibraryUninstallRequest::new(library_item_id)
}

pub fn map_library_updates_check(items: Vec<UpdateCheckItem>) -> LibraryUpdatesCheckRequest {
    LibraryUpdatesCheckRequest::new(items)
}

pub fn map_list_wishlist_items(
    cursor: Option<String>,
    page_size: Option<i32>,
) -> ListWishlistItemsRequest {
    let mut req = ListWishlistItemsRequest::new();
    if let Some(v) = cursor {
        req = req.with_cursor(v);
    }
    if let Some($1) = page_size {
        req = req.with_page_size(v);
    }
    req
}

pub fn map_add_wishlist_item(listing_id: String) -> AddWishlistItemRequest {
    AddWishlistItemRequest::new(listing_id)
}

pub fn map_remove_wishlist_item(listing_id: String) -> RemoveWishlistItemRequest {
    RemoveWishlistItemRequest::new(listing_id)
}

pub fn map_create_download_grant(artifact_id: String) -> CreateDownloadGrantRequest {
    CreateDownloadGrantRequest::new(artifact_id)
}

pub fn map_consume_download_grant(grant_id: String) -> ConsumeDownloadGrantRequest {
    ConsumeDownloadGrantRequest::new(grant_id)
}
