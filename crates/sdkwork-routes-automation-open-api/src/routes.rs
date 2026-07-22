//! Route registration descriptors for sdkwork-routes-automation-open-api.

pub use sdkwork_appstore_routes_common::RouteDefinition;
use sdkwork_web_core::RouteAuth;

pub const ROUTES: &[RouteDefinition] = &[RouteDefinition {
    method: "POST",
    path: "/store/v3/api/automation/submissions",
    operation_id: "appstore.publish.automation.submissions.create",
    auth: RouteAuth::ApiKey,
    handler: "publish_automation_submissions_create",
    service_method: "publish_automation_submissions_create",
}];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
