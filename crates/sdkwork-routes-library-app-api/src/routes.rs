//! Route registration descriptors for sdkwork-routes-library-app-api.

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteDefinition {
    pub method: &'static str,
    pub path: &'static str,
    pub operation_id: &'static str,
    pub handler: &'static str,
    pub service_method: &'static str,
}

pub const ROUTES: &[RouteDefinition] = &[
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/library/items",
        operation_id: "appstore.library.items.list",
        handler: "library_items_list",
        service_method: "library_items_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/library/items/{libraryItemId}",
        operation_id: "appstore.library.items.retrieve",
        handler: "library_items_retrieve",
        service_method: "library_items_retrieve",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/library/install",
        operation_id: "appstore.library.install",
        handler: "library_install",
        service_method: "library_install",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/library/uninstall",
        operation_id: "appstore.library.uninstall",
        handler: "library_uninstall",
        service_method: "library_uninstall",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/library/updates/check",
        operation_id: "appstore.library.updates.check",
        handler: "library_updates_check",
        service_method: "library_updates_check",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/wishlist/items",
        operation_id: "appstore.wishlist.items.list",
        handler: "wishlist_items_list",
        service_method: "wishlist_items_list",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/wishlist/items",
        operation_id: "appstore.wishlist.items.add",
        handler: "wishlist_items_add",
        service_method: "wishlist_items_add",
    },
    RouteDefinition {
        method: "DELETE",
        path: "/app/v3/api/wishlist/items/{listingId}",
        operation_id: "appstore.wishlist.items.remove",
        handler: "wishlist_items_remove",
        service_method: "wishlist_items_remove",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/download_grants",
        operation_id: "appstore.downloadGrants.create",
        handler: "download_grants_create",
        service_method: "download_grants_create",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/download_grants/{grantId}/consume",
        operation_id: "appstore.downloadGrants.consume",
        handler: "download_grants_consume",
        service_method: "download_grants_consume",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
