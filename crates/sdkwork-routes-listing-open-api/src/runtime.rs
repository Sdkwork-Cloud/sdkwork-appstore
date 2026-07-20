use axum::extract::{Extension, Path, State};
use axum::response::Response;
use axum::routing::get;
use axum::Router;
use sdkwork_appstore_routes_common::http_support::{
    map_listing_error, ok_item, to_listing_context_public,
};
use sdkwork_appstore_routes_common::AppState;
use sdkwork_web_core::WebRequestContext;

use crate::handlers::listings_public_retrieve;

pub fn routes() -> Router<AppState> {
    Router::new().route(
        "/store/v3/api/listings/{listingSlug}",
        get(public_listing_retrieve),
    )
}

async fn public_listing_retrieve(
    State(state): State<AppState>,
    Path(listing_slug): Path<String>,
    context: Option<Extension<WebRequestContext>>,
) -> Response {
    let ctx = to_listing_context_public(context.as_ref());
    match listings_public_retrieve(&state.listing_service, &ctx, listing_slug).await {
        Ok(result) => ok_item(context.as_ref(), result.listing),
        Err(error) => map_listing_error(context.as_ref(), error),
    }
}
