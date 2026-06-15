use axum::{extract::State, routing::get, Json, Router};
use serde_json::{json, Value};

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
        tenant_id: "default".to_string(),
        organization_id: Some("default-org".to_string()),
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
        Ok(result) => Json(json!({
            "success": true,
            "code": "OK",
            "message": "Release retrieved",
            "data": serde_json::to_value(&result).unwrap_or_default()
        })),
        Err(e) => Json(json!({
            "success": false,
            "code": "ERROR",
            "message": format!("{}", e)
        })),
    }
}

async fn release_artifacts(
    _state: State<AppState>,
    axum::extract::Path(_release_id): axum::extract::Path<String>,
) -> Json<Value> {
    Json(json!({
        "success": true,
        "code": "OK",
        "message": "Artifacts listed",
        "data": []
    }))
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
        Ok(result) => Json(json!({
            "success": true,
            "code": "OK",
            "message": "Public release retrieved",
            "data": serde_json::to_value(&result).unwrap_or_default()
        })),
        Err(e) => Json(json!({
            "success": false,
            "code": "ERROR",
            "message": format!("{}", e)
        })),
    }
}
