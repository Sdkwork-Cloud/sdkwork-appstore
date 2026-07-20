use axum::extract::{Extension, Json, Path, Query, State};
use axum::response::Response;
use axum::routing::{get, patch, post};
use axum::Router;
use sdkwork_routes_market_backend_api::handlers::{
    market_channels_create, market_channels_list, market_channels_update, market_releases_list,
    market_releases_sync,
};
use sdkwork_web_core::WebRequestContext;

use crate::routes::support::{created, map_market_error, ok_item, ok_page, to_market_context};
use crate::AppState;

#[derive(Debug, serde::Deserialize)]
struct MarketChannelsQuery {
    channel_status: Option<String>,
    cursor: Option<String>,
    page_size: Option<i32>,
}

#[derive(Debug, serde::Deserialize)]
struct MarketReleasesQuery {
    release_id: Option<String>,
    channel_id: Option<String>,
    market_status: Option<String>,
    cursor: Option<String>,
    page_size: Option<i32>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct MarketChannelCreateBody {
    channel_code: String,
    channel_type: String,
    provider: String,
    external_store_code: Option<String>,
    api_capability: Option<serde_json::Value>,
    config: Option<serde_json::Value>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct MarketChannelUpdateBody {
    channel_status: Option<String>,
    external_store_code: Option<String>,
    api_capability: Option<serde_json::Value>,
    config: Option<serde_json::Value>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct MarketReleaseSyncBody {
    sync_mode: String,
    external_status: Option<serde_json::Value>,
    note: Option<String>,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route(
            "/backend/v3/api/market_channels",
            get(market_channels_list_handler).post(market_channels_create_handler),
        )
        .route(
            "/backend/v3/api/market_channels/{marketChannelId}",
            patch(market_channels_update_handler),
        )
        .route(
            "/backend/v3/api/market_releases",
            get(market_releases_list_handler),
        )
        .route(
            "/backend/v3/api/market_releases/{marketReleaseId}/sync",
            post(market_releases_sync_handler),
        )
}

async fn market_channels_list_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<MarketChannelsQuery>,
) -> Response {
    let ctx = match to_market_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match market_channels_list(
        &state.market_service,
        &ctx,
        query.channel_status,
        query.cursor,
        query.page_size,
    )
    .await
    {
        Ok(result) => ok_page(
            context.as_ref(),
            result.channels,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => map_market_error(context.as_ref(), error),
    }
}

async fn market_channels_create_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<MarketChannelCreateBody>,
) -> Response {
    let ctx = match to_market_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match market_channels_create(
        &state.market_service,
        &ctx,
        body.channel_code,
        body.channel_type,
        body.provider,
        body.external_store_code,
        body.api_capability,
        body.config,
    )
    .await
    {
        Ok(result) => created(context.as_ref(), result.channel),
        Err(error) => map_market_error(context.as_ref(), error),
    }
}

async fn market_channels_update_handler(
    State(state): State<AppState>,
    Path(market_channel_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<MarketChannelUpdateBody>,
) -> Response {
    let ctx = match to_market_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match market_channels_update(
        &state.market_service,
        &ctx,
        market_channel_id,
        body.channel_status,
        body.external_store_code,
        body.api_capability,
        body.config,
    )
    .await
    {
        Ok(result) => ok_item(context.as_ref(), result.channel),
        Err(error) => map_market_error(context.as_ref(), error),
    }
}

async fn market_releases_list_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<MarketReleasesQuery>,
) -> Response {
    let ctx = match to_market_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match market_releases_list(
        &state.market_service,
        &ctx,
        query.release_id,
        query.channel_id,
        query.market_status,
        query.cursor,
        query.page_size,
    )
    .await
    {
        Ok(result) => ok_page(
            context.as_ref(),
            result.releases,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => map_market_error(context.as_ref(), error),
    }
}

async fn market_releases_sync_handler(
    State(state): State<AppState>,
    Path(market_release_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<MarketReleaseSyncBody>,
) -> Response {
    let ctx = match to_market_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match market_releases_sync(
        &state.market_service,
        &ctx,
        market_release_id,
        body.sync_mode,
        body.external_status,
        body.note,
    )
    .await
    {
        Ok(result) => ok_item(context.as_ref(), result.release),
        Err(error) => map_market_error(context.as_ref(), error),
    }
}
