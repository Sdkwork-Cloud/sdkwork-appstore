//! Route registration descriptors for sdkwork-routes-compliance-app-api.

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
        path: "/app/v3/api/listings/{listingId}/compliance",
        operation_id: "appstore.compliance.profile.retrieve",
        handler: "compliance_profile_retrieve",
        service_method: "compliance_profile_retrieve",
    },
    RouteDefinition {
        method: "PUT",
        path: "/app/v3/api/listings/{listingId}/compliance",
        operation_id: "appstore.compliance.profile.update",
        handler: "compliance_profile_update",
        service_method: "compliance_profile_update",
    },
    RouteDefinition {
        method: "PUT",
        path: "/app/v3/api/listings/{listingId}/compliance/permissions",
        operation_id: "appstore.compliance.permissions.update",
        handler: "compliance_permissions_update",
        service_method: "compliance_permissions_update",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/listings/{listingId}/compliance/iap_items",
        operation_id: "appstore.compliance.iapItems.list",
        handler: "compliance_iap_items_list",
        service_method: "compliance_iap_items_list",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
