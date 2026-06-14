pub mod context;
pub mod domain;
pub mod error;
pub mod ports;
pub mod service;

pub use context::AppstoreRequestContext;
pub use domain::commands::{
    AddWishlistItemRequest, ConsumeDownloadGrantRequest, CreateDownloadGrantRequest,
    LibraryInstallRequest, LibraryOperationRequest, LibraryUninstallRequest,
    LibraryUpdatesCheckRequest, ListLibraryItemsRequest, ListWishlistItemsRequest,
    RemoveWishlistItemRequest, RetrieveLibraryItemRequest,
};
pub use domain::models::{
    DownloadGrant, DownloadGrantReason, DownloadGrantStatus, InstallEvent, InstallEventStatus,
    InstallEventType, InstallSource, LibraryItemId, LibraryStatus, UpdateAvailable,
    UpdateCheckItem, UserLibraryItem, UserWishlistItem, WishlistStatus,
};
pub use domain::results::{
    AddWishlistItemResult, ConsumeDownloadGrantResult, CreateDownloadGrantResult,
    LibraryInstallResult, LibraryOperationResult, LibraryUninstallResult,
    LibraryUpdatesCheckResult, ListLibraryItemsResult, ListWishlistItemsResult,
    RemoveWishlistItemResult, RetrieveLibraryItemResult,
};
pub use error::{AppstoreServiceError, AppstoreServiceResult};
pub use ports::repository::LibraryRepositoryPort;
pub use service::library_service::{LibraryOperations, LibraryService};

pub const CAPABILITY: &str = "library";

pub fn capability_name() -> &'static str {
    CAPABILITY
}
