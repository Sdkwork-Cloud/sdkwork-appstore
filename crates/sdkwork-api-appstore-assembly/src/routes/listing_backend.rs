use axum::extract::{Extension, Json, Path, Query, State};
use axum::response::Response;
use axum::routing::{get, patch};
use axum::Router;
use sdkwork_routes_listing_backend_api::handlers::{
    listings_admin_list, listings_admin_retrieve, listings_admin_visibility_update,
};
use sdkwork_web_core::WebRequestContext;

use crate::routes::support::{map_listing_error, ok_item, ok_page, to_listing_context};
use crate::AppState;

#[derive(Debug, serde::Deserialize)]
struct AdminListingsQuery {
    status_filter: Option<String>,
    review_status_filter: Option<String>,
    publisher_id: Option<String>,
    cursor: Option<String>,
    page_size: Option<i32>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct AdminVisibilityUpdateBody {
    storefront_visibility: String,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/backend/v3/api/listings", get(admin_listings_list))
        .route(
            "/backend/v3/api/listings/{listingId}",
            get(admin_listing_retrieve),
        )
        .route(
            "/backend/v3/api/listings/{listingId}/visibility",
            patch(admin_listing_visibility_update),
        )
}

async fn admin_listings_list(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<AdminListingsQuery>,
) -> Response {
    let ctx = match to_listing_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match listings_admin_list(
        &state.listing_service,
        &ctx,
        query.status_filter,
        query.review_status_filter,
        query.publisher_id,
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
        Err(error) => map_listing_error(context.as_ref(), error),
    }
}

async fn admin_listing_retrieve(
    State(state): State<AppState>,
    Path(listing_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
) -> Response {
    let ctx = match to_listing_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match listings_admin_retrieve(&state.listing_service, &ctx, listing_id).await {
        Ok(result) => ok_item(context.as_ref(), result.listing),
        Err(error) => map_listing_error(context.as_ref(), error),
    }
}

async fn admin_listing_visibility_update(
    State(state): State<AppState>,
    Path(listing_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<AdminVisibilityUpdateBody>,
) -> Response {
    let ctx = match to_listing_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match listings_admin_visibility_update(
        &state.listing_service,
        &ctx,
        listing_id,
        body.storefront_visibility,
    )
    .await
    {
        Ok(result) => ok_item(context.as_ref(), result.listing),
        Err(error) => map_listing_error(context.as_ref(), error),
    }
}
