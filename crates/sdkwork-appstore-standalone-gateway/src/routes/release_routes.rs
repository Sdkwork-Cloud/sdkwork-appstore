use axum::{extract::State, routing::get, Json, Router};
use serde_json::Value;

use crate::http_envelope::{internal_error, success_item, success_page, trace_id_from};
use crate::AppState;
use sdkwork_appstore_release_service::service::release_service::ReleaseOperations;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/app/v3/api/releases/{releaseId}", get(release_retrieve))
        .route(
            "/app/v3/api/releases/{releaseId}/artifacts",
            get(release_artifacts),
        )
        .route(
            "/app/v3/api/releases/public/{releaseId}",
            get(release_public),
        )
}

fn mock_context() -> sdkwork_appstore_release_service::context::AppstoreRequestContext {
    sdkwork_appstore_release_service::context::AppstoreRequestContext {
        tenant_id: "100001".to_string(),
        organization_id: Some("0".to_string()),
        user_id: Some("anonymous".to_string()),
        request_id: uuid::Uuid::new_v4().to_string(),
    }
}

async fn release_retrieve(
    state: State<AppState>,
    axum::extract::Path(release_id): axum::extract::Path<String>,
) -> Json<Value> {
    let ctx = mock_context();
    let req =
        sdkwork_appstore_release_service::domain::commands::RetrieveReleaseRequest { release_id };
    match state.release_service.retrieve_release(&ctx, req).await {
        Ok(result) => success_item(trace_id_from(&ctx.request_id), result),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}

async fn release_artifacts(
    _state: State<AppState>,
    axum::extract::Path(_release_id): axum::extract::Path<String>,
) -> Json<Value> {
    let trace_id = uuid::Uuid::new_v4().to_string();
    success_page(trace_id, Vec::<serde_json::Value>::new(), None, false)
}

async fn release_public(
    state: State<AppState>,
    axum::extract::Path(release_id): axum::extract::Path<String>,
) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_release_service::domain::commands::RetrievePublicReleaseRequest {
        release_id,
    };
    match state
        .release_service
        .retrieve_public_release(&ctx, req)
        .await
    {
        Ok(result) => success_item(trace_id_from(&ctx.request_id), result),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}
