use sdkwork_web_core::{HttpMethod, HttpRoute, HttpRouteManifest};

const HTTP_ROUTES: &[HttpRoute] = &[
    HttpRoute::api_key(
        HttpMethod::Post,
        "/store/v3/api/releases/check_update",
        "appstore",
        "appstore.releases.checkUpdate",
    ),
    HttpRoute::api_key(
        HttpMethod::Post,
        "/store/v3/api/artifacts/resolve_download",
        "appstore",
        "appstore.artifacts.resolveDownload",
    ),
    HttpRoute::public(
        HttpMethod::Get,
        "/store/v3/api/releases/{releaseId}",
        "appstore",
        "appstore.releases.public.retrieve",
    ),
];

pub fn open_route_manifest() -> HttpRouteManifest {
    HttpRouteManifest::new(HTTP_ROUTES)
}
