use axum::extract::{Extension, Json, Path, Query, State};
use axum::http::StatusCode;
use axum::response::Response;
use axum::routing::{delete, get, put};
use axum::Router;
use sdkwork_routes_catalog_app_api::handlers::{
    catalog_categories_list, catalog_categories_retrieve, catalog_charts_retrieve,
    catalog_collections_list, catalog_collections_retrieve, catalog_events_list,
    catalog_events_retrieve, catalog_featured_list, catalog_home_retrieve, catalog_listings_search,
    catalog_recently_updated_list, catalog_recommendations_list, catalog_search_history_clear,
    catalog_search_history_list, catalog_search_history_upsert, catalog_search_suggestions_list,
    catalog_search_trending_list,
};
use sdkwork_web_core::WebRequestContext;

use crate::routes::support::{
    map_catalog_error, ok_item, ok_page, to_catalog_context, to_catalog_context_auth,
    CursorLimitQuery, LocaleQuery, SearchQuery,
};
use crate::AppState;

#[derive(Debug, serde::Deserialize)]
struct CatalogHomeQuery {
    locale: Option<String>,
    platform: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
struct CatalogCategoriesListQuery {
    locale: Option<String>,
    cursor: Option<String>,
    limit: Option<i32>,
}

#[derive(Debug, serde::Deserialize)]
struct CatalogCollectionsListQuery {
    cursor: Option<String>,
    limit: Option<i32>,
    audience_scope: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
struct CatalogFeaturedQuery {
    audience_scope: Option<String>,
    platform_scope: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
struct CatalogChartsQuery {
    locale: Option<String>,
    platform_scope: Option<String>,
    snapshot_date: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
struct CatalogRecommendationsQuery {
    locale: Option<String>,
    platform: Option<String>,
    cursor: Option<String>,
    limit: Option<i32>,
}

#[derive(Debug, serde::Deserialize)]
struct CatalogRecentlyUpdatedQuery {
    locale: Option<String>,
    cursor: Option<String>,
    limit: Option<i32>,
}

#[derive(Debug, serde::Deserialize)]
struct CatalogEventsListQuery {
    cursor: Option<String>,
    limit: Option<i32>,
    status: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
struct CatalogSearchSuggestionsQuery {
    #[serde(rename = "q")]
    q: String,
    locale: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
struct CatalogSearchTrendingQuery {
    locale: Option<String>,
    limit: Option<i32>,
}

#[derive(Debug, serde::Deserialize)]
struct SearchHistoryUpsertBody {
    query_text: String,
    filters_json: Option<String>,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/app/v3/api/catalog/home", get(catalog_home))
        .route(
            "/app/v3/api/catalog/categories",
            get(catalog_categories_list_handler),
        )
        .route(
            "/app/v3/api/catalog/categories/{categoryId}",
            get(catalog_category_retrieve_handler),
        )
        .route(
            "/app/v3/api/catalog/collections",
            get(catalog_collections_list_handler),
        )
        .route(
            "/app/v3/api/catalog/collections/{collectionId}",
            get(catalog_collection_retrieve_handler),
        )
        .route(
            "/app/v3/api/catalog/featured",
            get(catalog_featured_list_handler),
        )
        .route(
            "/app/v3/api/catalog/charts/{chartCode}",
            get(catalog_charts_retrieve_handler),
        )
        .route(
            "/app/v3/api/catalog/listings/search",
            get(catalog_listings_search_handler),
        )
        .route(
            "/app/v3/api/catalog/recommendations",
            get(catalog_recommendations_list_handler),
        )
        .route(
            "/app/v3/api/catalog/recently_updated",
            get(catalog_recently_updated_list_handler),
        )
        .route(
            "/app/v3/api/catalog/events",
            get(catalog_events_list_handler),
        )
        .route(
            "/app/v3/api/catalog/events/{eventId}",
            get(catalog_event_retrieve_handler),
        )
        .route(
            "/app/v3/api/catalog/search/suggestions",
            get(catalog_search_suggestions_list_handler),
        )
        .route(
            "/app/v3/api/catalog/search/trending",
            get(catalog_search_trending_list_handler),
        )
        .route(
            "/app/v3/api/catalog/search/history",
            get(catalog_search_history_list_handler),
        )
        .route(
            "/app/v3/api/catalog/search/history",
            put(catalog_search_history_upsert_handler),
        )
        .route(
            "/app/v3/api/catalog/search/history",
            delete(catalog_search_history_clear_handler),
        )
}

async fn catalog_home(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<CatalogHomeQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_home_retrieve(&state.catalog_service, &ctx, query.locale, query.platform).await {
        Ok(result) => ok_item(
            context.as_ref(),
            serde_json::json!({
                "featuredSlots": result.featured_slots,
                "collections": result.collections,
                "charts": result.charts,
            }),
        ),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_categories_list_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<CatalogCategoriesListQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_categories_list(
        &state.catalog_service,
        &ctx,
        query.locale,
        query.cursor,
        query.limit,
    )
    .await
    {
        Ok(result) => ok_page(
            context.as_ref(),
            result.categories,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_category_retrieve_handler(
    State(state): State<AppState>,
    Path(category_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<LocaleQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_categories_retrieve(&state.catalog_service, &ctx, category_id, query.locale).await
    {
        Ok(result) => ok_item(context.as_ref(), result.category),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_collections_list_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<CatalogCollectionsListQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_collections_list(
        &state.catalog_service,
        &ctx,
        query.cursor,
        query.limit,
        query.audience_scope,
    )
    .await
    {
        Ok(result) => ok_page(
            context.as_ref(),
            result.collections,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_collection_retrieve_handler(
    State(state): State<AppState>,
    Path(collection_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<LocaleQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_collections_retrieve(&state.catalog_service, &ctx, collection_id, query.locale)
        .await
    {
        Ok(result) => ok_item(context.as_ref(), result.collection),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_featured_list_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<CatalogFeaturedQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_featured_list(
        &state.catalog_service,
        &ctx,
        query.audience_scope,
        query.platform_scope,
    )
    .await
    {
        Ok(result) => ok_page(context.as_ref(), result.slots, None, false),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_charts_retrieve_handler(
    State(state): State<AppState>,
    Path(chart_code): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<CatalogChartsQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_charts_retrieve(
        &state.catalog_service,
        &ctx,
        chart_code,
        query.locale,
        query.platform_scope,
        query.snapshot_date,
    )
    .await
    {
        Ok(result) => ok_item(context.as_ref(), result.chart),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_listings_search_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<SearchQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_listings_search(
        &state.catalog_service,
        &ctx,
        query.q,
        query.category_id,
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
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_recommendations_list_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<CatalogRecommendationsQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_recommendations_list(
        &state.catalog_service,
        &ctx,
        query.locale,
        query.platform,
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
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_recently_updated_list_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<CatalogRecentlyUpdatedQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_recently_updated_list(
        &state.catalog_service,
        &ctx,
        query.locale,
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
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_events_list_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<CatalogEventsListQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_events_list(
        &state.catalog_service,
        &ctx,
        query.cursor,
        query.limit,
        query.status,
    )
    .await
    {
        Ok(result) => ok_page(
            context.as_ref(),
            result.events,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_event_retrieve_handler(
    State(state): State<AppState>,
    Path(event_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<LocaleQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_events_retrieve(&state.catalog_service, &ctx, event_id, query.locale).await {
        Ok(result) => ok_item(context.as_ref(), result.event),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_search_suggestions_list_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<CatalogSearchSuggestionsQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_search_suggestions_list(&state.catalog_service, &ctx, query.q, query.locale).await
    {
        Ok(result) => ok_page(context.as_ref(), result.suggestions, None, false),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_search_trending_list_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<CatalogSearchTrendingQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_search_trending_list(&state.catalog_service, &ctx, query.locale, query.limit)
        .await
    {
        Ok(result) => ok_page(context.as_ref(), result.terms, None, false),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_search_history_list_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<CursorLimitQuery>,
) -> Response {
    let ctx = match to_catalog_context_auth(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_search_history_list(&state.catalog_service, &ctx, query.cursor, query.limit).await
    {
        Ok(result) => ok_page(
            context.as_ref(),
            result.entries,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_search_history_upsert_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<SearchHistoryUpsertBody>,
) -> Response {
    let ctx = match to_catalog_context_auth(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_search_history_upsert(
        &state.catalog_service,
        &ctx,
        body.query_text,
        body.filters_json,
    )
    .await
    {
        Ok(result) => ok_item(context.as_ref(), result.entry),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn catalog_search_history_clear_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
) -> Response {
    let ctx = match to_catalog_context_auth(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match catalog_search_history_clear(&state.catalog_service, &ctx).await {
        Ok(_result) => Response::builder()
            .status(StatusCode::NO_CONTENT)
            .body(axum::body::Body::empty())
            .unwrap(),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}
