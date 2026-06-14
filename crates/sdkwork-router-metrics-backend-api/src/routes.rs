//! Route registration descriptors for sdkwork-router-metrics-backend-api.

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
    path: "/backend/v3/api/metrics/listings/{listingId}",
    operation_id: "appstore.metrics.listings.retrieve",
    handler: "metrics_listings_retrieve",
    service_method: "metrics_listings_retrieve",
}];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
