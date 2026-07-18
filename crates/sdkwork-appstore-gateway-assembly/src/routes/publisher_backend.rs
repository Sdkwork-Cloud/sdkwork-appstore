use axum::extract::{Extension, Json, Path, State};
use axum::response::Response;
use axum::routing::post;
use axum::Router;
use sdkwork_routes_publisher_backend_api::handlers::publishers_admin_verify;
use sdkwork_web_core::WebRequestContext;

use crate::routes::support::{map_publisher_error, ok_item, to_publisher_context};
use crate::AppState;

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct AdminVerifyPublisherBody {
    verification_type: String,
    decision: String,
    reason: Option<String>,
}

pub fn routes() -> Router<AppState> {
    Router::new().route(
        "/backend/v3/api/publishers/{publisherId}/verify",
        post(admin_verify_publisher),
    )
}

async fn admin_verify_publisher(
    State(state): State<AppState>,
    Path(publisher_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<AdminVerifyPublisherBody>,
) -> Response {
    let ctx = match to_publisher_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match publishers_admin_verify(
        &state.publisher_service,
        &ctx,
        publisher_id,
        body.verification_type,
        body.decision,
        body.reason,
    )
    .await
    {
        Ok(result) => ok_item(context.as_ref(), result.verification),
        Err(error) => map_publisher_error(context.as_ref(), error),
    }
}
