use axum::extract::{Extension, Json, Path, Query, State};
use axum::response::Response;
use axum::routing::{get, put};
use axum::Router;
use sdkwork_appstore_compliance_service::domain::commands::PermissionDisclosureItem;
use sdkwork_routes_compliance_app_api::handlers::{
    compliance_iap_items_list, compliance_permissions_update, compliance_profile_retrieve,
    compliance_profile_update,
};
use sdkwork_web_core::WebRequestContext;

use crate::routes::support::{
    map_compliance_error, ok_item, ok_page, to_compliance_context, CursorPageSizeQuery,
};
use crate::AppState;

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct ComplianceProfileUpdateBody {
    privacy_nutrition: Option<serde_json::Value>,
    content_rating_questionnaire: Option<serde_json::Value>,
    data_safety: Option<serde_json::Value>,
    target_audience: Option<serde_json::Value>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct CompliancePermissionsUpdateBody {
    permissions: Vec<PermissionDisclosureItem>,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route(
            "/app/v3/api/listings/{listingId}/compliance",
            get(compliance_profile_retrieve_handler).put(compliance_profile_update_handler),
        )
        .route(
            "/app/v3/api/listings/{listingId}/compliance/permissions",
            put(compliance_permissions_update_handler),
        )
        .route(
            "/app/v3/api/listings/{listingId}/compliance/iap_items",
            get(compliance_iap_items_list_handler),
        )
}

async fn compliance_profile_retrieve_handler(
    State(state): State<AppState>,
    Path(listing_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
) -> Response {
    let ctx = match to_compliance_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match compliance_profile_retrieve(&state.compliance_service, &ctx, listing_id).await {
        Ok(result) => ok_item(context.as_ref(), result.profile),
        Err(error) => map_compliance_error(context.as_ref(), error),
    }
}

async fn compliance_profile_update_handler(
    State(state): State<AppState>,
    Path(listing_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<ComplianceProfileUpdateBody>,
) -> Response {
    let ctx = match to_compliance_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match compliance_profile_update(
        &state.compliance_service,
        &ctx,
        listing_id,
        body.privacy_nutrition,
        body.content_rating_questionnaire,
        body.data_safety,
        body.target_audience,
    )
    .await
    {
        Ok(result) => ok_item(context.as_ref(), result.profile),
        Err(error) => map_compliance_error(context.as_ref(), error),
    }
}

async fn compliance_permissions_update_handler(
    State(state): State<AppState>,
    Path(listing_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<CompliancePermissionsUpdateBody>,
) -> Response {
    let ctx = match to_compliance_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match compliance_permissions_update(
        &state.compliance_service,
        &ctx,
        listing_id,
        body.permissions,
    )
    .await
    {
        Ok(result) => ok_page(context.as_ref(), result.disclosures, None, false),
        Err(error) => map_compliance_error(context.as_ref(), error),
    }
}

async fn compliance_iap_items_list_handler(
    State(state): State<AppState>,
    Path(listing_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<CursorPageSizeQuery>,
) -> Response {
    let ctx = match to_compliance_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match compliance_iap_items_list(
        &state.compliance_service,
        &ctx,
        listing_id,
        query.cursor,
        query.page_size,
    )
    .await
    {
        Ok(result) => ok_page(
            context.as_ref(),
            result.items,
            result.next_cursor,
            result.has_more,
        ),
        Err(error) => map_compliance_error(context.as_ref(), error),
    }
}
