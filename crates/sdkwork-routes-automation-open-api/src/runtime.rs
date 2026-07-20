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

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct AutomationSubmissionBody {
    app_key: String,
    submission_type: String,
    channel_code: String,
    version_name: String,
    version_code: String,
    artifacts: Vec<AutomationArtifactSpec>,
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
        body.channel_code,
        body.version_name,
        body.version_code,
        body.artifacts,
    )
    .await
    {
        Ok(result) => created(
            context.as_ref(),
            serde_json::json!({
                "accepted": result.accepted,
                "releaseId": result.release_id,
            }),
        ),
        Err(error) => map_release_error(context.as_ref(), error),
    }
}
