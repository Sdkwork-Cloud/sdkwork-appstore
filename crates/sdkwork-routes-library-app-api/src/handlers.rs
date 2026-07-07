use crate::mapper;
use sdkwork_appstore_library_service::context::AppstoreRequestContext;
use sdkwork_appstore_library_service::domain::models::UpdateCheckItem;
use sdkwork_appstore_library_service::domain::results::{
    AddWishlistItemResult, ConsumeDownloadGrantResult, CreateDownloadGrantResult,
    LibraryInstallResult, LibraryUninstallResult, LibraryUpdatesCheckResult,
    ListLibraryItemsResult, ListWishlistItemsResult, RemoveWishlistItemResult,
    RetrieveLibraryItemResult,
};
use sdkwork_appstore_library_service::error::AppstoreServiceError;
use sdkwork_appstore_library_service::LibraryOperations;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteHandlerPlan {
    pub operation_id: &'static str,
    pub handler_name: &'static str,
    pub service_method: &'static str,
}

pub const ROUTE_HANDLER_PLANS: &[RouteHandlerPlan] = &[
    RouteHandlerPlan {
        operation_id: "appstore.library.items.list",
        handler_name: "library_items_list",
        service_method: "list_library_items",
    },
    RouteHandlerPlan {
        operation_id: "appstore.library.items.retrieve",
        handler_name: "library_items_retrieve",
        service_method: "retrieve_library_item",
    },
    RouteHandlerPlan {
        operation_id: "appstore.library.install",
        handler_name: "library_install",
        service_method: "install_library",
    },
    RouteHandlerPlan {
        operation_id: "appstore.library.uninstall",
        handler_name: "library_uninstall",
        service_method: "uninstall_library",
    },
    RouteHandlerPlan {
        operation_id: "appstore.library.updates.check",
        handler_name: "library_updates_check",
        service_method: "check_library_updates",
    },
    RouteHandlerPlan {
        operation_id: "appstore.wishlist.items.list",
        handler_name: "wishlist_items_list",
        service_method: "list_wishlist_items",
    },
    RouteHandlerPlan {
        operation_id: "appstore.wishlist.items.add",
        handler_name: "wishlist_items_add",
        service_method: "add_wishlist_item",
    },
    RouteHandlerPlan {
        operation_id: "appstore.wishlist.items.remove",
        handler_name: "wishlist_items_remove",
        service_method: "remove_wishlist_item",
    },
    RouteHandlerPlan {
        operation_id: "appstore.downloadGrants.create",
        handler_name: "download_grants_create",
        service_method: "create_download_grant",
    },
    RouteHandlerPlan {
        operation_id: "appstore.downloadGrants.consume",
        handler_name: "download_grants_consume",
        service_method: "consume_download_grant",
    },
];

pub fn route_handler_plans() -> &'static [RouteHandlerPlan] {
    ROUTE_HANDLER_PLANS
}

pub async fn library_items_list<S: LibraryOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    cursor: Option<String>,
    page_size: Option<i32>,
) -> Result<ListLibraryItemsResult, AppstoreServiceError> {
    let cmd = mapper::request::map_list_library_items(cursor, page_size);
    service.library_items_list(context, cmd).await
}

pub async fn library_items_retrieve<S: LibraryOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    library_item_id: String,
) -> Result<RetrieveLibraryItemResult, AppstoreServiceError> {
    let cmd = mapper::request::map_retrieve_library_item(library_item_id);
    service.library_items_retrieve(context, cmd).await
}

pub async fn library_install<S: LibraryOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    listing_id: String,
    platform: String,
    architecture: Option<String>,
    device_id: Option<String>,
) -> Result<LibraryInstallResult, AppstoreServiceError> {
    let cmd = mapper::request::map_library_install(listing_id, platform, architecture, device_id);
    service.library_install(context, cmd).await
}

pub async fn library_uninstall<S: LibraryOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    library_item_id: String,
) -> Result<LibraryUninstallResult, AppstoreServiceError> {
    let cmd = mapper::request::map_library_uninstall(library_item_id);
    service.library_uninstall(context, cmd).await
}

pub async fn library_updates_check<S: LibraryOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    items: Vec<UpdateCheckItem>,
) -> Result<LibraryUpdatesCheckResult, AppstoreServiceError> {
    let cmd = mapper::request::map_library_updates_check(items);
    service.library_updates_check(context, cmd).await
}

pub async fn wishlist_items_list<S: LibraryOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    cursor: Option<String>,
    page_size: Option<i32>,
) -> Result<ListWishlistItemsResult, AppstoreServiceError> {
    let cmd = mapper::request::map_list_wishlist_items(cursor, page_size);
    service.wishlist_items_list(context, cmd).await
}

pub async fn wishlist_items_add<S: LibraryOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    listing_id: String,
) -> Result<AddWishlistItemResult, AppstoreServiceError> {
    let cmd = mapper::request::map_add_wishlist_item(listing_id);
    service.wishlist_items_add(context, cmd).await
}

pub async fn wishlist_items_remove<S: LibraryOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    listing_id: String,
) -> Result<RemoveWishlistItemResult, AppstoreServiceError> {
    let cmd = mapper::request::map_remove_wishlist_item(listing_id);
    service.wishlist_items_remove(context, cmd).await
}

pub async fn download_grants_create<S: LibraryOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    artifact_id: String,
) -> Result<CreateDownloadGrantResult, AppstoreServiceError> {
    let cmd = mapper::request::map_create_download_grant(artifact_id);
    service.download_grants_create(context, cmd).await
}

pub async fn download_grants_consume<S: LibraryOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    grant_id: String,
) -> Result<ConsumeDownloadGrantResult, AppstoreServiceError> {
    let cmd = mapper::request::map_consume_download_grant(grant_id);
    service.download_grants_consume(context, cmd).await
}
