use sdkwork_appstore_release_service::domain::results::AutomationSubmissionResult;

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct AutomationSubmissionResponse {
    accepted: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    release_id: Option<String>,
}

pub(crate) fn map_automation_submission(
    result: AutomationSubmissionResult,
) -> AutomationSubmissionResponse {
    AutomationSubmissionResponse {
        accepted: result.accepted,
        release_id: result.release_id,
    }
}
