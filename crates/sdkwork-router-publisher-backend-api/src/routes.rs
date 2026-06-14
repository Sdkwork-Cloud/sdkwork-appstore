//! Route registration descriptors for sdkwork-router-publisher-backend-api.

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteDefinition {
    pub method: &'static str,
    pub path: &'static str,
    pub operation_id: &'static str,
    pub handler: &'static str,
    pub service_method: &'static str,
}

pub const ROUTES: &[RouteDefinition] = &[RouteDefinition {
    method: "POST",
    path: "/backend/v3/api/publishers/{publisherId}/verify",
    operation_id: "appstore.publishers.admin.verify",
    handler: "publishers_admin_verify",
    service_method: "publishers_admin_verify",
}];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
