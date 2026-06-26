//! Route registration descriptors for sdkwork-routes-listing-backend-api.

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
        path: "/backend/v3/api/listings",
        operation_id: "appstore.listings.admin.list",
        handler: "listings_admin_list",
        service_method: "listings_admin_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/listings/{listingId}",
        operation_id: "appstore.listings.admin.retrieve",
        handler: "listings_admin_retrieve",
        service_method: "listings_admin_retrieve",
    },
    RouteDefinition {
        method: "PATCH",
        path: "/backend/v3/api/listings/{listingId}/visibility",
        operation_id: "appstore.listings.admin.visibility.update",
        handler: "listings_admin_visibility_update",
        service_method: "listings_admin_visibility_update",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
