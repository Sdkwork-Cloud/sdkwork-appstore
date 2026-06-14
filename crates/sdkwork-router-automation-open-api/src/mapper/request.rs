use sdkwork_appstore_release_service::domain::commands::{
    AutomationArtifactSpec, AutomationSubmissionCreateRequest,
};

pub fn map_automation_submission_create(
    plus_app_key: String,
    submission_type: String,
    channel_code: String,
    version_name: String,
    version_code: String,
    artifacts: Vec<AutomationArtifactSpec>,
) -> AutomationSubmissionCreateRequest {
    let mut req = AutomationSubmissionCreateRequest::new(
        plus_app_key,
        submission_type,
        channel_code,
        version_name,
        version_code,
    );
    req = req.with_artifacts(artifacts);
    req
}
