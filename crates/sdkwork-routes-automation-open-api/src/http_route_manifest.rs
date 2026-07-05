use sdkwork_web_core::{HttpMethod, HttpRoute, HttpRouteManifest};

const HTTP_ROUTES: &[HttpRoute] = &[HttpRoute::api_key(
    HttpMethod::Post,
    "/store/v3/api/automation/submissions",
    "appstore",
    "appstore.publish.automation.submissions.create",
)];

pub fn open_route_manifest() -> HttpRouteManifest {
    HttpRouteManifest::new(HTTP_ROUTES)
}
