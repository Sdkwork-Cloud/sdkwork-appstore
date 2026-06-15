use axum::{extract::State, routing::get, Json, Router};
use serde_json::{json, Value};

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
        tenant_id: "default".to_string(),
        organization_id: "default-org".to_string(),
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
        Ok(result) => Json(json!({
            "success": true,
            "code": "OK",
            "message": "Listing retrieved",
            "data": serde_json::to_value(&result).unwrap_or_default()
        })),
        Err(e) => Json(json!({
            "success": false,
            "code": "ERROR",
            "message": format!("{}", e)
        })),
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
        Ok(result) => Json(json!({
            "success": true,
            "code": "OK",
            "message": "Media listed",
            "data": serde_json::to_value(&result).unwrap_or_default()
        })),
        Err(e) => Json(json!({
            "success": false,
            "code": "ERROR",
            "message": format!("{}", e)
        })),
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
        Ok(result) => Json(json!({
            "success": true,
            "code": "OK",
            "message": "Releases listed",
            "data": serde_json::to_value(&result).unwrap_or_default()
        })),
        Err(e) => Json(json!({
            "success": false,
            "code": "ERROR",
            "message": format!("{}", e)
        })),
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
        Ok(result) => Json(json!({
            "success": true,
            "code": "OK",
            "message": "Public listing retrieved",
            "data": serde_json::to_value(&result).unwrap_or_default()
        })),
        Err(e) => Json(json!({
            "success": false,
            "code": "ERROR",
            "message": format!("{}", e)
        })),
    }
}
