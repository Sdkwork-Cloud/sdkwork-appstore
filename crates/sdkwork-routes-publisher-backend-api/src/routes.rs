//! Route registration descriptors for sdkwork-routes-publisher-backend-api.

pub use sdkwork_appstore_routes_common::RouteDefinition;
use sdkwork_web_core::RouteAuth;

pub const ROUTES: &[RouteDefinition] = &[RouteDefinition {
    method: "POST",
    path: "/backend/v3/api/publishers/{publisherId}/verify",
    operation_id: "appstore.publishers.admin.verify",
    auth: RouteAuth::DualToken,
    handler: "publishers_admin_verify",
    service_method: "publishers_admin_verify",
}];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
