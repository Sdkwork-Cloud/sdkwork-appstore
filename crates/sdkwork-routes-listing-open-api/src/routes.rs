//! Route registration descriptors for sdkwork-routes-listing-open-api.

pub use sdkwork_appstore_routes_common::RouteDefinition;
use sdkwork_web_core::RouteAuth;

pub const ROUTES: &[RouteDefinition] = &[RouteDefinition {
    method: "GET",
    path: "/store/v3/api/listings/{listingSlug}",
    operation_id: "appstore.listings.public.retrieve",
    auth: RouteAuth::Public,
    handler: "listings_public_retrieve",
    service_method: "listings_public_retrieve",
}];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
