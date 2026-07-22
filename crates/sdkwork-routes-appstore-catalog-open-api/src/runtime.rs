use axum::extract::{Extension, Query, State};
use axum::response::Response;
use axum::routing::get;
use axum::Router;
use sdkwork_appstore_routes_common::http_support::{
    map_catalog_error, ok_page, to_catalog_context,
};
use sdkwork_appstore_routes_common::AppState;
use sdkwork_web_core::WebRequestContext;

use crate::handlers::catalog_public_featured_list;
use crate::mapper::response::map_public_featured_slot;

#[derive(Debug, serde::Deserialize)]
struct PublicFeaturedQuery {
    locale: Option<String>,
    platform: Option<String>,
    page_size: Option<i32>,
}

pub fn routes() -> Router<AppState> {
    Router::new().route(
        "/store/v3/api/catalog/featured",
        get(public_catalog_featured),
    )
}

async fn public_catalog_featured(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<PublicFeaturedQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(response) => return response,
    };
    match catalog_public_featured_list(
        &state.catalog_service,
        &ctx,
        query.locale,
        query.platform,
        query.page_size,
    )
    .await
    {
        Ok(result) => ok_page(
            context.as_ref(),
            result
                .slots
                .into_iter()
                .map(map_public_featured_slot)
                .collect::<Vec<_>>(),
            None,
            false,
        ),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
}
