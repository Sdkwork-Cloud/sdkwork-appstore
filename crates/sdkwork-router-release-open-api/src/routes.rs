//! Route registration descriptors for sdkwork-router-release-open-api.

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteDefinition {
    pub method: &'static str,
    pub path: &'static str,
    pub operation_id: &'static str,
    pub handler: &'static str,
    pub service_method: &'static str,
}

pub const ROUTES: &[RouteDefinition] = &[
    RouteDefinition {
        method: "POST",
        path: "/store/v3/api/releases/check_update",
        operation_id: "appstore.releases.checkUpdate",
        handler: "releases_check_update",
        service_method: "releases_check_update",
    },
    RouteDefinition {
        method: "POST",
        path: "/store/v3/api/artifacts/resolve_download",
        operation_id: "appstore.artifacts.resolveDownload",
        handler: "artifacts_resolve_download",
        service_method: "artifacts_resolve_download",
    },
    RouteDefinition {
        method: "GET",
        path: "/store/v3/api/releases/{releaseId}",
        operation_id: "appstore.releases.public.retrieve",
        handler: "releases_public_retrieve",
        service_method: "releases_public_retrieve",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
