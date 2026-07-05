use crate::mapper;
use sdkwork_appstore_release_service::context::AppstoreRequestContext;
use sdkwork_appstore_release_service::domain::commands::AutomationArtifactSpec;
use sdkwork_appstore_release_service::domain::results::AutomationSubmissionResult;
use sdkwork_appstore_release_service::error::AppstoreServiceError;
use sdkwork_appstore_release_service::ReleaseOperations;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteHandlerPlan {
    pub operation_id: &'static str,
    pub handler_name: &'static str,
    pub service_method: &'static str,
}

pub const ROUTE_HANDLER_PLANS: &[RouteHandlerPlan] = &[RouteHandlerPlan {
    operation_id: "appstore.publish.automation.submissions.create",
    handler_name: "publish_automation_submissions_create",
    service_method: "create_automation_submission",
}];

pub fn route_handler_plans() -> &'static [RouteHandlerPlan] {
    ROUTE_HANDLER_PLANS
}

pub async fn publish_automation_submissions_create<S: ReleaseOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    app_key: String,
    submission_type: String,
    channel_code: String,
    version_name: String,
    version_code: String,
    artifacts: Vec<AutomationArtifactSpec>,
) -> Result<AutomationSubmissionResult, AppstoreServiceError> {
    let cmd = mapper::request::map_automation_submission_create(
        app_key,
        submission_type,
        channel_code,
        version_name,
        version_code,
        artifacts,
    );
    service.create_automation_submission(context, cmd).await
}
