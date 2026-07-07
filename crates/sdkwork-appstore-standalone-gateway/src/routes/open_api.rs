use axum::extract::{Extension, Json, Path, Query, State};
use axum::response::Response;
use axum::routing::{get, post};
use axum::Router;
use sdkwork_appstore_release_service::domain::commands::AutomationArtifactSpec;
use sdkwork_routes_automation_open_api::handlers::publish_automation_submissions_create;
use sdkwork_routes_catalog_open_api::handlers::catalog_public_featured_list;
use sdkwork_routes_listing_open_api::handlers::listings_public_retrieve;
use sdkwork_routes_release_open_api::handlers::{
    artifacts_resolve_download, releases_check_update, releases_public_retrieve,
};
use sdkwork_web_core::WebRequestContext;

use crate::routes::support::{
    created, map_catalog_error, map_listing_error, map_release_error, ok_item, ok_page,
    to_catalog_context, to_listing_context_public, to_release_context_public,
};
use crate::AppState;

#[derive(Debug, serde::Deserialize)]
struct PublicFeaturedQuery {
    locale: Option<String>,
    platform: Option<String>,
    limit: Option<i32>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct CheckUpdateBody {
    app_key: String,
    platform: String,
    installed_version_code: String,
    channel_code: String,
    architecture: Option<String>,
    device_id: Option<String>,
    region_code: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct ResolveDownloadBody {
    artifact_id: String,
    grant_id: Option<String>,
    app_key: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct AutomationSubmissionBody {
    app_key: String,
    submission_type: String,
    channel_code: String,
    version_name: String,
    version_code: String,
    artifacts: Vec<AutomationArtifactSpec>,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route(
            "/store/v3/api/catalog/featured",
            get(public_catalog_featured),
        )
        .route(
            "/store/v3/api/listings/{listingSlug}",
            get(public_listing_retrieve),
        )
        .route(
            "/store/v3/api/releases/check_update",
            post(releases_check_update_handler),
        )
        .route(
            "/store/v3/api/artifacts/resolve_download",
            post(artifacts_resolve_download_handler),
        )
        .route(
            "/store/v3/api/releases/{releaseId}",
            get(public_release_retrieve),
        )
        .route(
            "/store/v3/api/automation/submissions",
            post(automation_submissions_create),
        )
}

async fn public_catalog_featured(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Query(query): Query<PublicFeaturedQuery>,
) -> Response {
    let ctx = match to_catalog_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
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
        Ok(result) => ok_page(context.as_ref(), result.slots, None, false),
        Err(error) => map_catalog_error(context.as_ref(), error),
    }
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

async fn releases_check_update_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<CheckUpdateBody>,
) -> Response {
    let ctx = to_release_context_public(context.as_ref());
    match releases_check_update(
        &state.release_service,
        &ctx,
        body.app_key,
        body.platform,
        body.installed_version_code,
        body.channel_code,
        body.architecture,
        body.device_id,
        body.region_code,
    )
    .await
    {
        Ok(result) => ok_item(
            context.as_ref(),
            serde_json::json!({
                "updateAvailable": result.update_available,
                "releaseId": result.release_id,
                "versionName": result.version_name,
                "versionCode": result.version_code,
                "artifactId": result.artifact_id,
            }),
        ),
        Err(error) => map_release_error(context.as_ref(), error),
    }
}

async fn artifacts_resolve_download_handler(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<ResolveDownloadBody>,
) -> Response {
    let ctx = to_release_context_public(context.as_ref());
    match artifacts_resolve_download(
        &state.release_service,
        &ctx,
        body.artifact_id,
        body.grant_id,
        body.app_key,
    )
    .await
    {
        Ok(result) => ok_item(
            context.as_ref(),
            serde_json::json!({
                "downloadUrl": result.download_url,
                "expiresAt": result.expires_at,
                "checksumSha256": result.checksum_sha256,
                "fileSizeBytes": result.file_size_bytes,
            }),
        ),
        Err(error) => map_release_error(context.as_ref(), error),
    }
}

async fn public_release_retrieve(
    State(state): State<AppState>,
    Path(release_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
) -> Response {
    let ctx = to_release_context_public(context.as_ref());
    match releases_public_retrieve(&state.release_service, &ctx, release_id).await {
        Ok(result) => ok_item(context.as_ref(), result.release),
        Err(error) => map_release_error(context.as_ref(), error),
    }
}

async fn automation_submissions_create(
    State(state): State<AppState>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<AutomationSubmissionBody>,
) -> Response {
    let ctx = to_release_context_public(context.as_ref());
    match publish_automation_submissions_create(
        &state.release_service,
        &ctx,
        body.app_key,
        body.submission_type,
        body.channel_code,
        body.version_name,
        body.version_code,
        body.artifacts,
    )
    .await
    {
        Ok(result) => created(
            context.as_ref(),
            serde_json::json!({
                "accepted": result.accepted,
                "releaseId": result.release_id,
            }),
        ),
        Err(error) => map_release_error(context.as_ref(), error),
    }
}
