//! Route registration descriptors for sdkwork-routes-appstore-catalog-open-api.

pub use sdkwork_appstore_routes_common::RouteDefinition;
use sdkwork_web_core::RouteAuth;

pub const ROUTES: &[RouteDefinition] = &[RouteDefinition {
    method: "GET",
    path: "/store/v3/api/catalog/featured",
    operation_id: "appstore.catalog.public.featured.list",
    auth: RouteAuth::Public,
    handler: "catalog_public_featured_list",
    service_method: "catalog_public_featured_list",
}];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
