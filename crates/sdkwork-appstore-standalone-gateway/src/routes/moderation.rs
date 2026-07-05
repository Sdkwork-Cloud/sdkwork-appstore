use axum::extract::{Extension, Json, Path, Query, State};
use axum::response::Response;
use axum::routing::{get, post};
use axum::Router;
use sdkwork_routes_moderation_backend_api::handlers::{
    moderation_appeals_create, moderation_appeals_decide, moderation_appeals_list,
    moderation_appeals_retrieve, moderation_decisions_create, moderation_queue_list,
    moderation_reviews_assign, moderation_reviews_retrieve,
};
use sdkwork_web_core::WebRequestContext;

use crate::routes::support::{
    created, map_moderation_error, ok_item, ok_page, to_moderation_context,
};
use crate::AppState;

#[derive(Debug, serde::Deserialize)]
struct ModerationQueueQuery {
    review_status: Option<String>,
    cursor: Option<String>,
    limit: Option<i32>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct ModerationAssignBody {
    assigned_to: String,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct ModerationDecisionBody {
    decision_type: String,
    decision_status: String,
    reason_code: Option<String>,
    reason_detail: Option<String>,
    policy_reference: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct ModerationAppealCreateBody {
    decision_id: String,
    appeal_reason: String,
}

#[derive(Debug, serde::Deserialize)]
struct ModerationAppealsQuery {
    status: Option<String>,
    cursor: Option<String>,
    limit: Option<i32>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct ModerationAppealDecideBody {
    decision: String,
    note: String,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route(
            "/backend/v3/api/moderation/queue",
            get(moderation_queue_list_handler),
        )
        .route(
            "/backend/v3/api/moderation/reviews/{reviewId}",
            get(moderation_review_retrieve),
        )
        .route(
            "/backend/v3/api/moderation/reviews/{reviewId}/assign",
            post(moderation_review_assign),
        )
        .route(
            "/backend/v3/api/moderation/reviews/{reviewId}/decisions",
            post(moderation_decision_create),
        )
        .route(
            "/backend/v3/api/moderation/appeals",
            post(moderation_appeals_create_handler).get(moderation_appeals_list_handler),
        )
        .route(
            "/backend/v3/api/moderation/appeals/{appealId}",
            get(moderation_appeals_retrieve_handler),
        )
        .route(
            "/backend/v3/api/moderation/appeals/{appealId}/decide",
            post(moderation_appeals_decide_handler),
        )
}

async fn moderation_queue_list_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<ModerationQueueQuery>,
) -> Response {
    let ctx = match to_moderation_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match moderation_queue_list(
        &state.moderation_service,
        &ctx,
        query.review_status,
        query.cursor,
        query.limit,
    )
    .await
    {
        Ok(result) => ok_page(
            context.as_ref(),
            result.reviews,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => map_moderation_error(context.as_ref(), error),
    }
}

async fn moderation_review_retrieve(
    State(state): State<AppState>,
    Path(review_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
) -> Response {
    let ctx = match to_moderation_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match moderation_reviews_retrieve(&state.moderation_service, &ctx, review_id).await {
        Ok(result) => ok_item(context.as_ref(), result.review),
        Err(error) => map_moderation_error(context.as_ref(), error),
    }
}

async fn moderation_review_assign(
    State(state): State<AppState>,
    Path(review_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<ModerationAssignBody>,
) -> Response {
    let ctx = match to_moderation_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match moderation_reviews_assign(&state.moderation_service, &ctx, review_id, body.assigned_to)
        .await
    {
        Ok(result) => ok_item(context.as_ref(), result.review),
        Err(error) => map_moderation_error(context.as_ref(), error),
    }
}

async fn moderation_decision_create(
    State(state): State<AppState>,
    Path(review_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<ModerationDecisionBody>,
) -> Response {
    let ctx = match to_moderation_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match moderation_decisions_create(
        &state.moderation_service,
        &ctx,
        review_id,
        body.decision_type,
        body.decision_status,
        body.reason_code,
        body.reason_detail,
        body.policy_reference,
    )
    .await
    {
        Ok(result) => created(context.as_ref(), result.decision),
        Err(error) => map_moderation_error(context.as_ref(), error),
    }
}

async fn moderation_appeals_create_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<ModerationAppealCreateBody>,
) -> Response {
    let ctx = match to_moderation_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match moderation_appeals_create(
        &state.moderation_service,
        &ctx,
        body.decision_id,
        body.appeal_reason,
    )
    .await
    {
        Ok(result) => created(context.as_ref(), result.appeal),
        Err(error) => map_moderation_error(context.as_ref(), error),
    }
}

async fn moderation_appeals_list_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<ModerationAppealsQuery>,
) -> Response {
    let ctx = match to_moderation_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match moderation_appeals_list(
        &state.moderation_service,
        &ctx,
        query.status,
        query.cursor,
        query.limit,
    )
    .await
    {
        Ok(result) => ok_page(
            context.as_ref(),
            result.appeals,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => map_moderation_error(context.as_ref(), error),
    }
}

async fn moderation_appeals_retrieve_handler(
    State(state): State<AppState>,
    Path(appeal_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
) -> Response {
    let ctx = match to_moderation_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match moderation_appeals_retrieve(&state.moderation_service, &ctx, appeal_id).await {
        Ok(result) => ok_item(context.as_ref(), result.appeal),
        Err(error) => map_moderation_error(context.as_ref(), error),
    }
}

async fn moderation_appeals_decide_handler(
    State(state): State<AppState>,
    Path(appeal_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<ModerationAppealDecideBody>,
) -> Response {
    let ctx = match to_moderation_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match moderation_appeals_decide(
        &state.moderation_service,
        &ctx,
        appeal_id,
        body.decision,
        body.note,
    )
    .await
    {
        Ok(result) => ok_item(context.as_ref(), result.appeal),
        Err(error) => map_moderation_error(context.as_ref(), error),
    }
}
