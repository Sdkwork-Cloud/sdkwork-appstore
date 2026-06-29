use axum::{extract::State, routing::get, Json, Router};
use serde_json::Value;

use crate::http_envelope::{internal_error, success_item, success_page, trace_id_from};
use crate::AppState;
use sdkwork_appstore_listing_service::service::listing_service::ListingOperations;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/app/v3/api/listings/{listingId}", get(listing_retrieve))
        .route(
            "/app/v3/api/listings/{listingId}/media",
            get(listing_media_list),
        )
        .route(
            "/app/v3/api/listings/{listingId}/releases",
            get(listing_releases_list),
        )
        .route(
            "/app/v3/api/listings/public/{listingSlug}",
            get(listing_public_retrieve),
        )
}

fn mock_context() -> sdkwork_appstore_listing_service::context::AppstoreRequestContext {
    sdkwork_appstore_listing_service::context::AppstoreRequestContext {
        tenant_id: "100001".to_string(),
        organization_id: "0".to_string(),
        user_id: "anonymous".to_string(),
        request_id: uuid::Uuid::new_v4().to_string(),
        trace_id: None,
        permission_scopes: vec![],
    }
}

async fn listing_retrieve(
    state: State<AppState>,
    axum::extract::Path(listing_id): axum::extract::Path<String>,
) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_listing_service::domain::commands::RetrieveListingRequest {
        listing_id,
        idempotency_key: None,
    };
    match state.listing_service.retrieve_listing(&ctx, req).await {
        Ok(result) => success_item(trace_id_from(&ctx.request_id), result),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}

async fn listing_media_list(
    state: State<AppState>,
    axum::extract::Path(listing_id): axum::extract::Path<String>,
) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_listing_service::domain::commands::ListListingMediaRequest {
        listing_id,
        idempotency_key: None,
    };
    match state.listing_service.list_media(&ctx, req).await {
        Ok(result) => success_page(trace_id_from(&ctx.request_id), result.media, None, false),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}

async fn listing_releases_list(
    state: State<AppState>,
    axum::extract::Path(listing_id): axum::extract::Path<String>,
) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_listing_service::domain::commands::ListListingReleasesRequest {
        listing_id,
        cursor: None,
        limit: Some(20),
        idempotency_key: None,
    };
    match state.listing_service.list_releases(&ctx, req).await {
        Ok(result) => success_page(
            trace_id_from(&ctx.request_id),
            result.releases,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}

async fn listing_public_retrieve(
    state: State<AppState>,
    axum::extract::Path(listing_slug): axum::extract::Path<String>,
) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_listing_service::domain::commands::PublicRetrieveListingRequest {
        listing_slug,
        idempotency_key: None,
    };
    match state
        .listing_service
        .public_retrieve_listing(&ctx, req)
        .await
    {
        Ok(result) => success_item(trace_id_from(&ctx.request_id), result),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}
