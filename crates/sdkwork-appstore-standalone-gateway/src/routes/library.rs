use axum::{extract::State, routing::get, Json, Router};
use serde_json::Value;

use crate::http_envelope::{internal_error, success_item, success_page, trace_id_from};
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
        tenant_id: "100001".to_string(),
        organization_id: "0".to_string(),
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
        Ok(result) => success_page(
            trace_id_from(&ctx.request_id),
            result.items,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
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
        Ok(result) => success_item(trace_id_from(&ctx.request_id), result),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}

async fn wishlist_items_list(state: State<AppState>) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_library_service::domain::commands::ListWishlistItemsRequest {
        cursor: None,
        limit: Some(20),
    };
    match state.library_service.wishlist_items_list(&ctx, req).await {
        Ok(result) => success_page(
            trace_id_from(&ctx.request_id),
            result.items,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}
