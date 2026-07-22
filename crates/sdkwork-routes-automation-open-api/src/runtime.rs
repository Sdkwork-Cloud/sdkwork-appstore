use axum::extract::{Extension, Json, State};
use axum::response::Response;
use axum::routing::post;
use axum::Router;
use sdkwork_appstore_release_service::domain::commands::AutomationArtifactSpec;
use sdkwork_appstore_routes_common::http_support::{
    created, map_release_error, to_release_context_public,
};
use sdkwork_appstore_routes_common::AppState;
use sdkwork_web_core::WebRequestContext;

use crate::handlers::publish_automation_submissions_create;
use crate::mapper::response::map_automation_submission;

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct AutomationReleaseBody {
    channel_code: String,
    version_name: String,
    version_code: String,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct AutomationArtifactBody {
    platform: String,
    architecture: String,
    package_format: String,
    drive_node_id: String,
    checksum_sha256: String,
    file_size_bytes: Option<String>,
}

impl From<AutomationArtifactBody> for AutomationArtifactSpec {
    fn from(value: AutomationArtifactBody) -> Self {
        Self {
            platform: value.platform,
            architecture: value.architecture,
            package_format: value.package_format,
            drive_node_id: value.drive_node_id,
            checksum_sha256: value.checksum_sha256,
            file_size_bytes: value.file_size_bytes,
        }
    }
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct AutomationSubmissionBody {
    app_key: String,
    submission_type: String,
    release: AutomationReleaseBody,
    artifacts: Option<Vec<AutomationArtifactBody>>,
}

pub fn routes() -> Router<AppState> {
    Router::new().route(
        "/store/v3/api/automation/submissions",
        post(automation_submissions_create),
    )
}

async fn automation_submissions_create(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<AutomationSubmissionBody>,
) -> Response {
    let ctx = to_release_context_public(context.as_ref());
    match publish_automation_submissions_create(
        &state.release_service,
        &ctx,
        body.app_key,
        body.submission_type,
        body.release.channel_code,
        body.release.version_name,
        body.release.version_code,
        body.artifacts
            .unwrap_or_default()
            .into_iter()
            .map(AutomationArtifactSpec::from)
            .collect(),
    )
    .await
    {
        Ok(result) => created(context.as_ref(), map_automation_submission(result)),
        Err(error) => map_release_error(context.as_ref(), error),
    }
}
