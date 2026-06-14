//! Route registration descriptors for sdkwork-router-automation-open-api.

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
    path: "/store/v3/api/automation/submissions",
    operation_id: "appstore.publish.automation.submissions.create",
    handler: "publish_automation_submissions_create",
    service_method: "publish_automation_submissions_create",
}];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
