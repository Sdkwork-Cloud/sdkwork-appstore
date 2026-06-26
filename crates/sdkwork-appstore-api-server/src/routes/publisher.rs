use axum::{extract::State, routing::get, Json, Router};
use serde_json::{json, Value};

use crate::AppState;
use sdkwork_appstore_publisher_service::service::publisher_service::PublisherOperations;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/app/v3/api/publishers/me", get(publisher_me))
        .route(
            "/app/v3/api/publishers/{publisherId}/members",
            get(publisher_members_list),
        )
}

fn mock_context() -> sdkwork_appstore_publisher_service::context::AppstoreRequestContext {
    sdkwork_appstore_publisher_service::context::AppstoreRequestContext {
        tenant_id: "100001".to_string(),
        organization_id: "0".to_string(),
        user_id: "anonymous".to_string(),
        request_id: uuid::Uuid::new_v4().to_string(),
        trace_id: None,
        permission_scopes: vec![],
    }
}

async fn publisher_me(state: State<AppState>) -> Json<Value> {
    let ctx = mock_context();
    let req =
        sdkwork_appstore_publisher_service::domain::commands::RetrieveCurrentPublisherRequest::new(
        );
    match state
        .publisher_service
        .retrieve_current_publisher(&ctx, req)
        .await
    {
        Ok(result) => Json(json!({
            "success": true,
            "code": "OK",
            "message": "Publisher retrieved",
            "data": serde_json::to_value(&result).unwrap_or_default()
        })),
        Err(e) => Json(json!({
            "success": false,
            "code": "ERROR",
            "message": format!("{}", e)
        })),
    }
}

async fn publisher_members_list(
    state: State<AppState>,
    axum::extract::Path(publisher_id): axum::extract::Path<String>,
) -> Json<Value> {
    let ctx = mock_context();
    let req =
        sdkwork_appstore_publisher_service::domain::commands::ListPublisherMembersRequest::new(
            publisher_id,
        );
    match state.publisher_service.list_members(&ctx, req).await {
        Ok(result) => Json(json!({
            "success": true,
            "code": "OK",
            "message": "Members listed",
            "data": serde_json::to_value(&result).unwrap_or_default()
        })),
        Err(e) => Json(json!({
            "success": false,
            "code": "ERROR",
            "message": format!("{}", e)
        })),
    }
}
