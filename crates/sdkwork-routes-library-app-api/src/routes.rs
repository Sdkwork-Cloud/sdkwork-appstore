//! Route registration descriptors for sdkwork-routes-library-app-api.

pub use sdkwork_appstore_routes_common::RouteDefinition;
use sdkwork_web_core::RouteAuth;

pub const ROUTES: &[RouteDefinition] = &[
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/library/items",
        operation_id: "appstore.library.items.list",
        auth: RouteAuth::DualToken,
        handler: "library_items_list",
        service_method: "library_items_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/library/items/{libraryItemId}",
        operation_id: "appstore.library.items.retrieve",
        auth: RouteAuth::DualToken,
        handler: "library_items_retrieve",
        service_method: "library_items_retrieve",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/library/install",
        operation_id: "appstore.library.install",
        auth: RouteAuth::DualToken,
        handler: "library_install",
        service_method: "library_install",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/library/uninstall",
        operation_id: "appstore.library.uninstall",
        auth: RouteAuth::DualToken,
        handler: "library_uninstall",
        service_method: "library_uninstall",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/library/updates/check",
        operation_id: "appstore.library.updates.check",
        auth: RouteAuth::DualToken,
        handler: "library_updates_check",
        service_method: "library_updates_check",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/wishlist/items",
        operation_id: "appstore.wishlist.items.list",
        auth: RouteAuth::DualToken,
        handler: "wishlist_items_list",
        service_method: "wishlist_items_list",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/wishlist/items",
        operation_id: "appstore.wishlist.items.create",
        auth: RouteAuth::DualToken,
        handler: "wishlist_items_add",
        service_method: "wishlist_items_add",
    },
    RouteDefinition {
        method: "DELETE",
        path: "/app/v3/api/wishlist/items/{listingId}",
        operation_id: "appstore.wishlist.items.delete",
        auth: RouteAuth::DualToken,
        handler: "wishlist_items_remove",
        service_method: "wishlist_items_remove",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/download_grants",
        operation_id: "appstore.downloadGrants.create",
        auth: RouteAuth::DualToken,
        handler: "download_grants_create",
        service_method: "download_grants_create",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/download_grants/{grantId}/consume",
        operation_id: "appstore.downloadGrants.consume",
        auth: RouteAuth::DualToken,
        handler: "download_grants_consume",
        service_method: "download_grants_consume",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
