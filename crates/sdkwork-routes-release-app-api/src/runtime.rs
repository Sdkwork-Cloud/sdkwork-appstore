use crate::handlers::{
    releases_artifacts_attach, releases_create, releases_notes_upsert, releases_retire,
    releases_retrieve, releases_rollout_update, releases_update,
};
use axum::extract::{Extension, Json, Path, State};
use axum::response::Response;
use axum::routing::{get, post, put};
use axum::Router;
use sdkwork_web_core::WebRequestContext;

use sdkwork_appstore_routes_common::http_support::{
    created, map_release_error, ok_item, to_release_context,
};
use sdkwork_appstore_routes_common::AppState;

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct ReleaseCreateBody {
    channel_code: String,
    version_name: String,
    version_code: String,
    build_number: Option<String>,
    minimum_os_version: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct ReleaseUpdateBody {
    minimum_os_version: Option<String>,
    release_status: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct ReleaseNotesUpsertBody {
    release_notes: String,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct ReleaseArtifactAttachBody {
    platform: String,
    architecture: String,
    package_format: String,
    drive_node_id: String,
    checksum_sha256: String,
    file_size_bytes: String,
    content_type: Option<String>,
    media_resource_id: Option<String>,
    min_os_version: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct ReleaseRolloutUpdateBody {
    rollout_strategy: String,
    target_percentage: i32,
    region_filter: Option<Vec<String>>,
    device_filter: Option<serde_json::Value>,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route(
            "/app/v3/api/listings/{listingId}/releases",
            post(release_create),
        )
        .route(
            "/app/v3/api/releases/{releaseId}",
            get(release_retrieve).patch(release_update),
        )
        .route(
            "/app/v3/api/releases/{releaseId}/notes/{locale}",
            put(release_notes_upsert),
        )
        .route(
            "/app/v3/api/releases/{releaseId}/artifacts",
            post(release_artifacts_attach),
        )
        .route(
            "/app/v3/api/releases/{releaseId}/rollout",
            put(release_rollout_update),
        )
        .route(
            "/app/v3/api/releases/{releaseId}/retire",
            post(release_retire),
        )
}

async fn release_create(
    State(state): State<AppState>,
    Path(listing_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<ReleaseCreateBody>,
) -> Response {
    let ctx = match to_release_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match releases_create(
        &state.release_service,
        &ctx,
        listing_id,
        body.channel_code,
        body.version_name,
        body.version_code,
        body.build_number,
        body.minimum_os_version,
    )
    .await
    {
        Ok(result) => created(context.as_ref(), result.release),
        Err(error) => map_release_error(context.as_ref(), error),
    }
}

async fn release_retrieve(
    State(state): State<AppState>,
    Path(release_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
) -> Response {
    let ctx = match to_release_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match releases_retrieve(&state.release_service, &ctx, release_id).await {
        Ok(result) => ok_item(context.as_ref(), result.release),
        Err(error) => map_release_error(context.as_ref(), error),
    }
}

async fn release_update(
    State(state): State<AppState>,
    Path(release_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<ReleaseUpdateBody>,
) -> Response {
    let ctx = match to_release_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match releases_update(
        &state.release_service,
        &ctx,
        release_id,
        body.minimum_os_version,
        body.release_status,
    )
    .await
    {
        Ok(result) => ok_item(context.as_ref(), result.release),
        Err(error) => map_release_error(context.as_ref(), error),
    }
}

async fn release_notes_upsert(
    State(state): State<AppState>,
    Path((release_id, locale)): Path<(String, String)>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<ReleaseNotesUpsertBody>,
) -> Response {
    let ctx = match to_release_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match releases_notes_upsert(
        &state.release_service,
        &ctx,
        release_id,
        locale,
        body.release_notes,
    )
    .await
    {
        Ok(result) => ok_item(context.as_ref(), result.localization),
        Err(error) => map_release_error(context.as_ref(), error),
    }
}

async fn release_artifacts_attach(
    State(state): State<AppState>,
    Path(release_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<ReleaseArtifactAttachBody>,
) -> Response {
    let ctx = match to_release_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match releases_artifacts_attach(
        &state.release_service,
        &ctx,
        release_id,
        body.platform,
        body.architecture,
        body.package_format,
        body.drive_node_id,
        body.checksum_sha256,
        body.file_size_bytes,
        body.content_type,
        body.media_resource_id,
        body.min_os_version,
    )
    .await
    {
        Ok(result) => created(context.as_ref(), result.artifact),
        Err(error) => map_release_error(context.as_ref(), error),
    }
}

async fn release_rollout_update(
    State(state): State<AppState>,
    Path(release_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
    Json(body): Json<ReleaseRolloutUpdateBody>,
) -> Response {
    let ctx = match to_release_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match releases_rollout_update(
        &state.release_service,
        &ctx,
        release_id,
        body.rollout_strategy,
        body.target_percentage,
        body.region_filter,
        body.device_filter,
    )
    .await
    {
        Ok(result) => ok_item(context.as_ref(), result.rollout),
        Err(error) => map_release_error(context.as_ref(), error),
    }
}

async fn release_retire(
    State(state): State<AppState>,
    Path(release_id): Path<String>,
    context: Option<Extension<WebRequestContext>>,
) -> Response {
    let ctx = match to_release_context(context.as_ref()) {
        Ok(ctx) => ctx,
        Err(resp) => return resp,
    };
    match releases_retire(&state.release_service, &ctx, release_id).await {
        Ok(result) => ok_item(context.as_ref(), result.release),
        Err(error) => map_release_error(context.as_ref(), error),
    }
}
