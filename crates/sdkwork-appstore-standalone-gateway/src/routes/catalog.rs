use axum::{extract::State, routing::get, Json, Router};
use serde_json::Value;

use crate::http_envelope::{internal_error, success_item, success_page, trace_id_from};
use crate::AppState;
use sdkwork_appstore_catalog_service::service::catalog_service::CatalogOperations;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/app/v3/api/catalog/home", get(catalog_home))
        .route(
            "/app/v3/api/catalog/categories",
            get(catalog_categories_list),
        )
        .route(
            "/app/v3/api/catalog/categories/{categoryId}",
            get(catalog_category_retrieve),
        )
        .route(
            "/app/v3/api/catalog/collections",
            get(catalog_collections_list),
        )
        .route(
            "/app/v3/api/catalog/collections/{collectionId}",
            get(catalog_collection_retrieve),
        )
        .route("/app/v3/api/catalog/featured", get(catalog_featured_list))
        .route(
            "/app/v3/api/catalog/charts/{chartCode}",
            get(catalog_charts_retrieve),
        )
        .route(
            "/app/v3/api/catalog/listings/search",
            get(catalog_listings_search),
        )
        .route(
            "/app/v3/api/catalog/public/featured",
            get(catalog_public_featured_list),
        )
}

fn mock_context() -> sdkwork_appstore_catalog_service::context::AppstoreRequestContext {
    sdkwork_appstore_catalog_service::context::AppstoreRequestContext {
        tenant_id: "100001".to_string(),
        organization_id: Some("0".to_string()),
        user_id: Some("anonymous".to_string()),
        request_id: uuid::Uuid::new_v4().to_string(),
    }
}

async fn catalog_home(state: State<AppState>) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_catalog_service::domain::commands::HomeRetrieveRequest::new();
    match state.catalog_service.home_retrieve(&ctx, req).await {
        Ok(result) => success_item(trace_id_from(&ctx.request_id), result),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}

async fn catalog_categories_list(state: State<AppState>) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_catalog_service::domain::commands::CategoriesListRequest {
        cursor: None,
        limit: Some(20),
        locale: None,
    };
    match state.catalog_service.categories_list(&ctx, req).await {
        Ok(result) => success_page(
            trace_id_from(&ctx.request_id),
            result.categories,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}

async fn catalog_category_retrieve(
    state: State<AppState>,
    axum::extract::Path(category_id): axum::extract::Path<String>,
) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_catalog_service::domain::commands::CategoryRetrieveRequest {
        category_id,
        locale: None,
    };
    match state.catalog_service.category_retrieve(&ctx, req).await {
        Ok(result) => success_item(trace_id_from(&ctx.request_id), result),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}

async fn catalog_collections_list(state: State<AppState>) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_catalog_service::domain::commands::CollectionsListRequest {
        cursor: None,
        limit: Some(20),
        audience_scope: None,
    };
    match state.catalog_service.collections_list(&ctx, req).await {
        Ok(result) => success_page(
            trace_id_from(&ctx.request_id),
            result.collections,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}

async fn catalog_collection_retrieve(
    state: State<AppState>,
    axum::extract::Path(collection_id): axum::extract::Path<String>,
) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_catalog_service::domain::commands::CollectionRetrieveRequest {
        collection_id,
        locale: None,
    };
    match state.catalog_service.collection_retrieve(&ctx, req).await {
        Ok(result) => success_item(trace_id_from(&ctx.request_id), result),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}

async fn catalog_featured_list(state: State<AppState>) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_catalog_service::domain::commands::FeaturedListRequest::new();
    match state.catalog_service.featured_list(&ctx, req).await {
        Ok(result) => success_item(trace_id_from(&ctx.request_id), result),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}

async fn catalog_charts_retrieve(
    state: State<AppState>,
    axum::extract::Path(chart_code): axum::extract::Path<String>,
) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_catalog_service::domain::commands::ChartsRetrieveRequest {
        chart_code,
        locale: None,
        platform_scope: None,
        snapshot_date: None,
    };
    match state.catalog_service.charts_retrieve(&ctx, req).await {
        Ok(result) => success_item(trace_id_from(&ctx.request_id), result),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}

async fn catalog_listings_search(state: State<AppState>) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_catalog_service::domain::commands::ListingsSearchRequest {
        query: None,
        category_id: None,
        cursor: None,
        limit: Some(20),
    };
    match state.catalog_service.listings_search(&ctx, req).await {
        Ok(result) => success_page(
            trace_id_from(&ctx.request_id),
            result.listings,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}

async fn catalog_public_featured_list(state: State<AppState>) -> Json<Value> {
    let ctx = mock_context();
    let req = sdkwork_appstore_catalog_service::domain::commands::PublicFeaturedListRequest {
        locale: None,
        platform: None,
        limit: Some(20),
    };
    match state.catalog_service.public_featured_list(&ctx, req).await {
        Ok(result) => success_item(trace_id_from(&ctx.request_id), result),
        Err(error) => internal_error(trace_id_from(&ctx.request_id), error),
    }
}
