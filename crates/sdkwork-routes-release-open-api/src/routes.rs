//! Route registration descriptors for sdkwork-routes-release-open-api.

pub use sdkwork_appstore_routes_common::RouteDefinition;
use sdkwork_web_core::RouteAuth;

pub const ROUTES: &[RouteDefinition] = &[
    RouteDefinition {
        method: "POST",
        path: "/store/v3/api/releases/check_update",
        operation_id: "appstore.releases.checkUpdate",
        auth: RouteAuth::ApiKey,
        handler: "releases_check_update",
        service_method: "releases_check_update",
    },
    RouteDefinition {
        method: "POST",
        path: "/store/v3/api/artifacts/resolve_download",
        operation_id: "appstore.artifacts.resolveDownload",
        auth: RouteAuth::ApiKey,
        handler: "artifacts_resolve_download",
        service_method: "artifacts_resolve_download",
    },
    RouteDefinition {
        method: "GET",
        path: "/store/v3/api/releases/{releaseId}",
        operation_id: "appstore.releases.public.retrieve",
        auth: RouteAuth::Public,
        handler: "releases_public_retrieve",
        service_method: "releases_public_retrieve",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
