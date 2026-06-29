use axum::{extract::State, routing::get, Json, Router};
use serde_json::Value;

use crate::http_envelope::{internal_error, success_item, trace_id_from};
use crate::AppState;
use sdkwork_appstore_moderation_service::service::moderation_service::ModerationOperations;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route(
            "/backend/v3/api/moderation/queue",
            get(moderation_queue_list),
        )
        .route(
            "/backend/v3/api/moderation/reviews/{reviewId}",
            get(moderation_review_retrieve),
        )
}

fn mock_context() -> sdkwork_appstore_moderation_service::context::AppstoreRequestContext {
    sdkwork_appstore_moderation_service::context::AppstoreRequestContext {
        tenant_id: "100001".to_string(),
        organization_id: Some("0".to_string()),
        user_id: Some("admin".to_string()),
        request_id: uuid::Uuid::new_v4().to_string(),
        trace_id: None,
        permission_scopes: vec!["appstore.moderation.*".to_string()],
    }
}

async fn moderation_queue_list(state: State<AppState>) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_moderation_service::domain::commands::ListModerationQueueRequest {
        review_status: None,
        cursor: None,
        limit: Some(20),
        idempotency_key: None,
    };
    match state.moderation_service.list_queue(&ctx, req).await {
        Ok(result) => success_item(trace_id_from(&ctx.request_id), result),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}

async fn moderation_review_retrieve(
    state: State<AppState>,
    axum::extract::Path(review_id): axum::extract::Path<String>,
) -> Json<Value> {
    let ctx = mock_context();
    let req =
        sdkwork_appstore_moderation_service::domain::commands::RetrieveModerationReviewRequest {
            review_id,
            idempotency_key: None,
        };
    match state.moderation_service.retrieve_review(&ctx, req).await {
        Ok(result) => success_item(trace_id_from(&ctx.request_id), result),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}
