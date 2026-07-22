//! Route registration descriptors for sdkwork-routes-compliance-app-api.

pub use sdkwork_appstore_routes_common::RouteDefinition;
use sdkwork_web_core::RouteAuth;

pub const ROUTES: &[RouteDefinition] = &[
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/listings/{listingId}/compliance",
        operation_id: "appstore.compliance.profile.retrieve",
        auth: RouteAuth::DualToken,
        handler: "compliance_profile_retrieve",
        service_method: "compliance_profile_retrieve",
    },
    RouteDefinition {
        method: "PUT",
        path: "/app/v3/api/listings/{listingId}/compliance",
        operation_id: "appstore.compliance.profile.update",
        auth: RouteAuth::DualToken,
        handler: "compliance_profile_update",
        service_method: "compliance_profile_update",
    },
    RouteDefinition {
        method: "PUT",
        path: "/app/v3/api/listings/{listingId}/compliance/permissions",
        operation_id: "appstore.compliance.permissions.update",
        auth: RouteAuth::DualToken,
        handler: "compliance_permissions_update",
        service_method: "compliance_permissions_update",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/listings/{listingId}/compliance/iap_items",
        operation_id: "appstore.compliance.iapItems.list",
        auth: RouteAuth::DualToken,
        handler: "compliance_iap_items_list",
        service_method: "compliance_iap_items_list",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
