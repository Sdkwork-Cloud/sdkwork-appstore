use axum::extract::{Extension, Path, Query, State};

use axum::response::Response;

use axum::routing::get;

use axum::Router;

use sdkwork_routes_metrics_backend_api::handlers::{
    analytics_operator_dashboard_retrieve, analytics_operator_search_retrieve,
    analytics_publisher_listings_list, analytics_publisher_listings_retrieve,
    analytics_publisher_overview_retrieve, metrics_listings_retrieve,
};

use sdkwork_web_core::WebRequestContext;

use crate::routes::support::{map_catalog_error, ok_item, ok_page, to_catalog_context_auth};

use crate::AppState;

#[derive(Debug, serde::Deserialize)]

struct MetricsQuery {
    start_date: Option<String>,

    end_date: Option<String>,
}

#[derive(Debug, serde::Deserialize)]

struct AnalyticsDateQuery {
    date_from: Option<String>,

    date_to: Option<String>,
}

#[derive(Debug, serde::Deserialize)]

struct AnalyticsPublisherListingsQuery {
    date_from: Option<String>,

    date_to: Option<String>,

    cursor: Option<String>,

    page_size: Option<i32>,
}

#[derive(Debug, serde::Deserialize)]

struct AnalyticsOperatorSearchQuery {
    q: Option<String>,

    date_from: Option<String>,

    date_to: Option<String>,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route(
            "/backend/v3/api/metrics/listings/{listingId}",
            get(metrics_listings_retrieve_handler),
        )
        .route(
            "/backend/v3/api/analytics/publisher/overview",
            get(analytics_publisher_overview_handler),
        )
        .route(
            "/backend/v3/api/analytics/publisher/listings",
            get(analytics_publisher_listings_list_handler),
        )
        .route(
            "/backend/v3/api/analytics/publisher/listings/{listingId}",
            get(analytics_publisher_listings_retrieve_handler),
        )
        .route(
            "/backend/v3/api/analytics/operator/dashboard",
            get(analytics_operator_dashboard_handler),
        )
        .route(
            "/backend/v3/api/analytics/operator/search",
            get(analytics_operator_search_handler),
        )
}

async fn metrics_listings_retrieve_handler(
    State(state): State<AppState>,

    Path(listing_id): Path<String>,

    context: Option<Extension<WebRequestContext>>,

    Query(query): Query<MetricsQuery>,
) -> Response {
    let ctx = match to_catalog_context_auth(context.as_ref()) {
        Ok(ctx) => ctx,

        Err(resp) => return resp,
    };

    match metrics_listings_retrieve(
        &state.catalog_service,
        &ctx,
        listing_id,
        query.start_date,
        query.end_date,
    )
    .await
    {
        Ok(result) => ok_page(context.as_ref(), result.metrics, None, false),

        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn analytics_publisher_overview_handler(
    State(state): State<AppState>,

    context: Option<Extension<WebRequestContext>>,

    Query(query): Query<AnalyticsDateQuery>,
) -> Response {
    let ctx = match to_catalog_context_auth(context.as_ref()) {
        Ok(ctx) => ctx,

        Err(resp) => return resp,
    };

    match analytics_publisher_overview_retrieve(
        &state.catalog_service,
        &ctx,
        query.date_from,
        query.date_to,
    )
    .await
    {
        Ok(result) => ok_item(context.as_ref(), result.overview),

        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn analytics_publisher_listings_list_handler(
    State(state): State<AppState>,

    context: Option<Extension<WebRequestContext>>,

    Query(query): Query<AnalyticsPublisherListingsQuery>,
) -> Response {
    let ctx = match to_catalog_context_auth(context.as_ref()) {
        Ok(ctx) => ctx,

        Err(resp) => return resp,
    };

    match analytics_publisher_listings_list(
        &state.catalog_service,
        &ctx,
        query.date_from,
        query.date_to,
        query.cursor,
        query.page_size,
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

async fn analytics_publisher_listings_retrieve_handler(
    State(state): State<AppState>,

    Path(listing_id): Path<String>,

    context: Option<Extension<WebRequestContext>>,

    Query(query): Query<AnalyticsDateQuery>,
) -> Response {
    let ctx = match to_catalog_context_auth(context.as_ref()) {
        Ok(ctx) => ctx,

        Err(resp) => return resp,
    };

    match analytics_publisher_listings_retrieve(
        &state.catalog_service,
        &ctx,
        listing_id,
        query.date_from,
        query.date_to,
    )
    .await
    {
        Ok(result) => ok_item(
            context.as_ref(),
            serde_json::json!({

                "listingId": result.listing_id,

                "metrics": result.metrics,

            }),
        ),

        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn analytics_operator_dashboard_handler(
    State(state): State<AppState>,

    context: Option<Extension<WebRequestContext>>,

    Query(query): Query<AnalyticsDateQuery>,
) -> Response {
    let ctx = match to_catalog_context_auth(context.as_ref()) {
        Ok(ctx) => ctx,

        Err(resp) => return resp,
    };

    match analytics_operator_dashboard_retrieve(
        &state.catalog_service,
        &ctx,
        query.date_from,
        query.date_to,
    )
    .await
    {
        Ok(result) => ok_item(context.as_ref(), result.dashboard),

        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}

async fn analytics_operator_search_handler(
    State(state): State<AppState>,

    context: Option<Extension<WebRequestContext>>,

    Query(query): Query<AnalyticsOperatorSearchQuery>,
) -> Response {
    let ctx = match to_catalog_context_auth(context.as_ref()) {
        Ok(ctx) => ctx,

        Err(resp) => return resp,
    };

    match analytics_operator_search_retrieve(
        &state.catalog_service,
        &ctx,
        query.q,
        query.date_from,
        query.date_to,
    )
    .await
    {
        Ok(result) => ok_item(context.as_ref(), result.analytics),

        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}
