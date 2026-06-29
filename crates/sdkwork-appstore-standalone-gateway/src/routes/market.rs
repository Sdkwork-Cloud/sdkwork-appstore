use axum::{extract::State, routing::get, Json, Router};
use serde_json::Value;

use crate::http_envelope::{internal_error, success_item, trace_id_from};
use crate::AppState;
use sdkwork_appstore_market_service::service::market_service::MarketOperations;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/backend/v3/api/market/channels", get(market_channels_list))
        .route("/backend/v3/api/market/releases", get(market_releases_list))
}

fn mock_context() -> sdkwork_appstore_market_service::context::AppstoreRequestContext {
    sdkwork_appstore_market_service::context::AppstoreRequestContext {
        tenant_id: "100001".to_string(),
        organization_id: Some("0".to_string()),
        user_id: Some("admin".to_string()),
        request_id: uuid::Uuid::new_v4().to_string(),
    }
}

async fn market_channels_list(state: State<AppState>) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_market_service::domain::commands::ListMarketChannelsRequest {
        channel_status: None,
        cursor: None,
        limit: Some(20),
        idempotency_key: None,
    };
    match state.market_service.list_channels(&ctx, req).await {
        Ok(result) => success_item(trace_id_from(&ctx.request_id), result),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}

async fn market_releases_list(state: State<AppState>) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_market_service::domain::commands::ListMarketReleasesRequest {
        release_id: None,
        channel_id: None,
        market_status: None,
        cursor: None,
        limit: Some(20),
        idempotency_key: None,
    };
    match state.market_service.list_releases(&ctx, req).await {
        Ok(result) => success_item(trace_id_from(&ctx.request_id), result),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}
