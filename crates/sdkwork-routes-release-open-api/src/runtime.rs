use axum::extract::{Extension, Json, Path, State};
use axum::response::Response;
use axum::routing::{get, post};
use axum::Router;
use sdkwork_appstore_routes_common::http_support::{
    map_release_error, ok_item, to_release_context_public,
};
use sdkwork_appstore_routes_common::AppState;
use sdkwork_web_core::WebRequestContext;

use crate::handlers::{
    artifacts_resolve_download, releases_check_update, releases_public_retrieve,
};
use crate::mapper::response::{map_check_update, map_public_release, map_resolve_download};

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

pub fn routes() -> Router<AppState> {
    Router::new()
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
        Ok(result) => ok_item(context.as_ref(), map_check_update(result)),
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
        Ok(result) => ok_item(context.as_ref(), map_resolve_download(result)),
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
        Ok(result) => match result.release {
            Some(release) => ok_item(context.as_ref(), map_public_release(release)),
            None => map_release_error(
                context.as_ref(),
                sdkwork_appstore_release_service::error::AppstoreServiceError::NotFound(
                    "Public release not found".to_string(),
                ),
            ),
        },
        Err(error) => map_release_error(context.as_ref(), error),
    }
}
