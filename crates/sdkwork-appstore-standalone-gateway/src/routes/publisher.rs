use axum::extract::{Extension, Json, Path, Query, State};
use axum::response::Response;
use axum::routing::{get, patch, post};
use axum::Router;
use sdkwork_routes_listing_app_api::handlers::{
    listings_publisher_list, publishers_me_apps_bootstrap,
};
use sdkwork_routes_publisher_app_api::handlers::{
    publishers_create, publishers_me_retrieve, publishers_members_invite, publishers_members_list,
    publishers_update, publishers_verifications_submit,
};
use sdkwork_web_core::WebRequestContext;

use crate::routes::support::{
    created, map_listing_error, map_publisher_error, ok_item, ok_page, to_listing_context,
    to_publisher_context, CursorLimitQuery,
};
use crate::AppState;

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct PublisherCreateBody {
    display_name: String,
    legal_name: Option<String>,
    support_email: Option<String>,
    website_url: Option<String>,
    publisher_type: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct PublisherUpdateBody {
    display_name: Option<String>,
    website_url: Option<String>,
    support_email: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct PublisherMemberInviteBody {
    user_id: String,
    member_role: String,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct PublisherVerificationSubmitBody {
    verification_type: String,
    credential_snapshot: Option<serde_json::Value>,
    evidence_media_resource_id: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct PublisherAppBootstrapBody {
    app_key: String,
    display_name: String,
    default_locale: String,
    app_type: Option<String>,
    listing_slug: Option<String>,
    pricing_model: Option<String>,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/app/v3/api/publishers/me", get(publisher_me))
        .route(
            "/app/v3/api/publishers/me/listings",
            get(publisher_me_listings),
        )
        .route(
            "/app/v3/api/publishers/me/apps",
            post(publisher_me_apps_bootstrap_handler),
        )
        .route("/app/v3/api/publishers", post(publisher_create))
        .route(
            "/app/v3/api/publishers/{publisherId}",
            patch(publisher_update),
        )
        .route(
            "/app/v3/api/publishers/{publisherId}/members",
            get(publisher_members_list_handler).post(publisher_members_invite_handler),
        )
        .route(
            "/app/v3/api/publishers/{publisherId}/verifications",
            post(publisher_verifications_submit),
        )
}

async fn publisher_me(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
) -> Response {
    let ctx = match to_publisher_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match publishers_me_retrieve(&state.publisher_service, &ctx).await {
        Ok(result) => ok_item(context.as_ref(), result.publisher),
        Err(error) => map_publisher_error(context.as_ref(), error),
    }
}

async fn publisher_me_listings(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<CursorLimitQuery>,
) -> Response {
    let publisher_ctx = match to_publisher_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    let listing_ctx = match to_listing_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };

    let publisher_id = match publishers_me_retrieve(&state.publisher_service, &publisher_ctx).await
    {
        Ok(result) => match result.publisher {
            Some(publisher) => publisher.id.as_str().to_string(),
            None => {
                return ok_page(
                    context.as_ref(),
                    Vec::<serde_json::Value>::new(),
                    None,
                    false,
                );
            }
        },
        Err(error) => return map_publisher_error(context.as_ref(), error),
    };

    match listings_publisher_list(
        &state.listing_service,
        &listing_ctx,
        publisher_id,
        query.cursor,
        query.limit,
    )
    .await
    {
        Ok(result) => ok_page(
            context.as_ref(),
            result.listings,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => map_listing_error(context.as_ref(), error),
    }
}

async fn publisher_create(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<PublisherCreateBody>,
) -> Response {
    let ctx = match to_publisher_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match publishers_create(
        &state.publisher_service,
        &ctx,
        body.display_name,
        body.legal_name,
        body.support_email,
        body.website_url,
        body.publisher_type,
    )
    .await
    {
        Ok(result) => created(context.as_ref(), result.publisher),
        Err(error) => map_publisher_error(context.as_ref(), error),
    }
}

async fn publisher_update(
    State(state): State<AppState>,
    Path(publisher_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<PublisherUpdateBody>,
) -> Response {
    let ctx = match to_publisher_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match publishers_update(
        &state.publisher_service,
        &ctx,
        publisher_id,
        body.display_name,
        body.website_url,
        body.support_email,
    )
    .await
    {
        Ok(result) => ok_item(context.as_ref(), result.publisher),
        Err(error) => map_publisher_error(context.as_ref(), error),
    }
}

async fn publisher_members_list_handler(
    State(state): State<AppState>,
    Path(publisher_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<CursorLimitQuery>,
) -> Response {
    let ctx = match to_publisher_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match publishers_members_list(
        &state.publisher_service,
        &ctx,
        publisher_id,
        query.cursor,
        query.limit,
    )
    .await
    {
        Ok(result) => ok_page(
            context.as_ref(),
            result.members,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => map_publisher_error(context.as_ref(), error),
    }
}

async fn publisher_members_invite_handler(
    State(state): State<AppState>,
    Path(publisher_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<PublisherMemberInviteBody>,
) -> Response {
    let ctx = match to_publisher_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match publishers_members_invite(
        &state.publisher_service,
        &ctx,
        publisher_id,
        body.user_id,
        body.member_role,
    )
    .await
    {
        Ok(result) => created(context.as_ref(), result.member),
        Err(error) => map_publisher_error(context.as_ref(), error),
    }
}

async fn publisher_verifications_submit(
    State(state): State<AppState>,
    Path(publisher_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<PublisherVerificationSubmitBody>,
) -> Response {
    let ctx = match to_publisher_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match publishers_verifications_submit(
        &state.publisher_service,
        &ctx,
        publisher_id,
        body.verification_type,
        body.credential_snapshot,
        body.evidence_media_resource_id,
    )
    .await
    {
        Ok(result) => created(context.as_ref(), result.verification),
        Err(error) => map_publisher_error(context.as_ref(), error),
    }
}

async fn publisher_me_apps_bootstrap_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<PublisherAppBootstrapBody>,
) -> Response {
    let listing_ctx = match to_listing_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    let publisher_ctx = match to_publisher_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    let publisher = match publishers_me_retrieve(&state.publisher_service, &publisher_ctx).await {
        Ok(result) => match result.publisher {
            Some(publisher) => publisher,
            None => {
                return map_publisher_error(
                    context.as_ref(),
                    sdkwork_appstore_publisher_service::error::AppstoreServiceError::NotFound(
                        "Publisher profile not found".to_string(),
                    ),
                )
            }
        },
        Err(error) => return map_publisher_error(context.as_ref(), error),
    };

    match publishers_me_apps_bootstrap(
        &state.listing_service,
        &listing_ctx,
        publisher.id.as_str().to_string(),
        body.app_key,
        body.display_name,
        body.default_locale,
        body.app_type,
        body.listing_slug,
        body.pricing_model,
    )
    .await
    {
        Ok(result) => created(
            context.as_ref(),
            serde_json::json!({
                "app": result.app,
                "listing": result.listing,
            }),
        ),
        Err(error) => map_listing_error(context.as_ref(), error),
    }
}
