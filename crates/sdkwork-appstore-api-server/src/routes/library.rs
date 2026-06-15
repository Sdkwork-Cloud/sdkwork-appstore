use axum::{extract::State, routing::get, Json, Router};
use serde_json::{json, Value};

use crate::AppState;
use sdkwork_appstore_library_service::service::library_service::LibraryOperations;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/app/v3/api/library/items", get(library_items_list))
        .route(
            "/app/v3/api/library/items/{libraryItemId}",
            get(library_item_retrieve),
        )
        .route("/app/v3/api/wishlist/items", get(wishlist_items_list))
}

fn mock_context() -> sdkwork_appstore_library_service::context::AppstoreRequestContext {
    sdkwork_appstore_library_service::context::AppstoreRequestContext {
        tenant_id: "default".to_string(),
        organization_id: "default-org".to_string(),
        user_id: "anonymous".to_string(),
        request_id: uuid::Uuid::new_v4().to_string(),
        trace_id: None,
        permission_scopes: vec![],
    }
}

async fn library_items_list(state: State<AppState>) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_library_service::domain::commands::ListLibraryItemsRequest {
        cursor: None,
        limit: Some(20),
    };
    match state.library_service.library_items_list(&ctx, req).await {
        Ok(result) => Json(json!({
            "success": true,
            "code": "OK",
            "message": "Library items listed",
            "data": serde_json::to_value(&result).unwrap_or_default()
        })),
        Err(e) => Json(json!({
            "success": false,
            "code": "ERROR",
            "message": format!("{}", e)
        })),
    }
}

async fn library_item_retrieve(
    state: State<AppState>,
    axum::extract::Path(library_item_id): axum::extract::Path<String>,
) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_library_service::domain::commands::RetrieveLibraryItemRequest {
        library_item_id,
    };
    match state
        .library_service
        .library_items_retrieve(&ctx, req)
        .await
    {
        Ok(result) => Json(json!({
            "success": true,
            "code": "OK",
            "message": "Library item retrieved",
            "data": serde_json::to_value(&result).unwrap_or_default()
        })),
        Err(e) => Json(json!({
            "success": false,
            "code": "ERROR",
            "message": format!("{}", e)
        })),
    }
}

async fn wishlist_items_list(state: State<AppState>) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_library_service::domain::commands::ListWishlistItemsRequest {
        cursor: None,
        limit: Some(20),
    };
    match state.library_service.wishlist_items_list(&ctx, req).await {
        Ok(result) => Json(json!({
            "success": true,
            "code": "OK",
            "message": "Wishlist items listed",
            "data": serde_json::to_value(&result).unwrap_or_default()
        })),
        Err(e) => Json(json!({
            "success": false,
            "code": "ERROR",
            "message": format!("{}", e)
        })),
    }
}
