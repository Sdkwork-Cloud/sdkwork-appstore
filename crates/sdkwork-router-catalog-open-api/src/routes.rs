//! Route registration descriptors for sdkwork-router-catalog-open-api.

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
    path: "/store/v3/api/catalog/featured",
    operation_id: "appstore.catalog.public.featured.list",
    handler: "catalog_public_featured_list",
    service_method: "catalog_public_featured_list",
}];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
