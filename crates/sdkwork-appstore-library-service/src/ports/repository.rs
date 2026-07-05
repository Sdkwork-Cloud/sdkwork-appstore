use crate::context::AppstoreRequestContext;
use crate::domain::models::{
    DownloadGrant, InstallEvent, LibraryItemId, UserLibraryItem, UserWishlistItem,
};
use crate::error::AppstoreServiceResult;

#[async_trait::async_trait]
pub trait LibraryRepositoryPort: Send + Sync {
    async fn find_library_items_by_user(
        &self,
        context: &AppstoreRequestContext,
        cursor: Option<&str>,
        limit: i32,
    ) -> AppstoreServiceResult<Vec<UserLibraryItem>>;

    async fn find_library_item_by_id(
        &self,
        context: &AppstoreRequestContext,
        library_item_id: &LibraryItemId,
    ) -> AppstoreServiceResult<Option<UserLibraryItem>>;

    async fn find_library_item_by_listing(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &str,
    ) -> AppstoreServiceResult<Option<UserLibraryItem>>;

    async fn find_library_item_by_app_key_and_platform(
        &self,
        context: &AppstoreRequestContext,
        app_key: &str,
        platform: &str,
    ) -> AppstoreServiceResult<Option<UserLibraryItem>>;

    async fn insert_library_item(
        &self,
        context: &AppstoreRequestContext,
        item: &UserLibraryItem,
    ) -> AppstoreServiceResult<()>;

    async fn update_library_item(
        &self,
        context: &AppstoreRequestContext,
        item: &UserLibraryItem,
    ) -> AppstoreServiceResult<()>;

    async fn find_wishlist_items_by_user(
        &self,
        context: &AppstoreRequestContext,
        cursor: Option<&str>,
        limit: i32,
    ) -> AppstoreServiceResult<Vec<UserWishlistItem>>;

    async fn find_wishlist_item_by_listing(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &str,
    ) -> AppstoreServiceResult<Option<UserWishlistItem>>;

    async fn insert_wishlist_item(
        &self,
        context: &AppstoreRequestContext,
        item: &UserWishlistItem,
    ) -> AppstoreServiceResult<()>;

    async fn update_wishlist_item(
        &self,
        context: &AppstoreRequestContext,
        item: &UserWishlistItem,
    ) -> AppstoreServiceResult<()>;

    async fn insert_install_event(
        &self,
        context: &AppstoreRequestContext,
        event: &InstallEvent,
    ) -> AppstoreServiceResult<()>;

    async fn find_download_grant_by_id(
        &self,
        context: &AppstoreRequestContext,
        grant_id: &str,
    ) -> AppstoreServiceResult<Option<DownloadGrant>>;

    async fn insert_download_grant(
        &self,
        context: &AppstoreRequestContext,
        grant: &DownloadGrant,
    ) -> AppstoreServiceResult<()>;

    async fn update_download_grant(
        &self,
        context: &AppstoreRequestContext,
        grant: &DownloadGrant,
    ) -> AppstoreServiceResult<()>;

    async fn find_latest_release_for_listing(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &str,
    ) -> AppstoreServiceResult<Option<(String, String, String)>>;

    async fn find_latest_artifact_for_release(
        &self,
        context: &AppstoreRequestContext,
        release_id: &str,
        platform: &str,
        architecture: Option<&str>,
    ) -> AppstoreServiceResult<Option<(String, String)>>;

    async fn find_listing_info(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &str,
    ) -> AppstoreServiceResult<Option<String>>;
}
