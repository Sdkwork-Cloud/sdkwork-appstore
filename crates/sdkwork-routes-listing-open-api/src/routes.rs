//! Route registration descriptors for sdkwork-routes-listing-open-api.

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteDefinition {
    pub method: &'static str,
    pub path: &'static str,
    pub operation_id: &'static str,
    pub handler: &'static str,
    pub service_method: &'static str,
}

pub const ROUTES: &[RouteDefinition] = &[RouteDefinition {
    method: "GET",
    path: "/store/v3/api/listings/{listingSlug}",
    operation_id: "appstore.listings.public.retrieve",
    handler: "listings_public_retrieve",
    service_method: "listings_public_retrieve",
}];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
