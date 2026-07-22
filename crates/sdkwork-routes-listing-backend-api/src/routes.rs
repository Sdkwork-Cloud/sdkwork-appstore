//! Route registration descriptors for sdkwork-routes-listing-backend-api.

pub use sdkwork_appstore_routes_common::RouteDefinition;
use sdkwork_web_core::RouteAuth;

pub const ROUTES: &[RouteDefinition] = &[
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/listings",
        operation_id: "appstore.listings.admin.list",
        auth: RouteAuth::DualToken,
        handler: "listings_admin_list",
        service_method: "listings_admin_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/listings/{listingId}",
        operation_id: "appstore.listings.admin.retrieve",
        auth: RouteAuth::DualToken,
        handler: "listings_admin_retrieve",
        service_method: "listings_admin_retrieve",
    },
    RouteDefinition {
        method: "PATCH",
        path: "/backend/v3/api/listings/{listingId}/visibility",
        operation_id: "appstore.listings.admin.visibility.update",
        auth: RouteAuth::DualToken,
        handler: "listings_admin_visibility_update",
        service_method: "listings_admin_visibility_update",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
