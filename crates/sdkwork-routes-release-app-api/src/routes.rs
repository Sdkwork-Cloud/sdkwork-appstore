//! Route registration descriptors for sdkwork-routes-release-app-api.

pub use sdkwork_appstore_routes_common::RouteDefinition;
use sdkwork_web_core::RouteAuth;

pub const ROUTES: &[RouteDefinition] = &[
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/listings/{listingId}/releases",
        operation_id: "appstore.releases.create",
        auth: RouteAuth::DualToken,
        handler: "releases_create",
        service_method: "releases_create",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/releases/{releaseId}",
        operation_id: "appstore.releases.retrieve",
        auth: RouteAuth::DualToken,
        handler: "releases_retrieve",
        service_method: "releases_retrieve",
    },
    RouteDefinition {
        method: "PATCH",
        path: "/app/v3/api/releases/{releaseId}",
        operation_id: "appstore.releases.update",
        auth: RouteAuth::DualToken,
        handler: "releases_update",
        service_method: "releases_update",
    },
    RouteDefinition {
        method: "PUT",
        path: "/app/v3/api/releases/{releaseId}/notes/{locale}",
        operation_id: "appstore.releases.notes.update",
        auth: RouteAuth::DualToken,
        handler: "releases_notes_upsert",
        service_method: "releases_notes_upsert",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/releases/{releaseId}/artifacts",
        operation_id: "appstore.releases.artifacts.create",
        auth: RouteAuth::DualToken,
        handler: "releases_artifacts_attach",
        service_method: "releases_artifacts_attach",
    },
    RouteDefinition {
        method: "PUT",
        path: "/app/v3/api/releases/{releaseId}/rollout",
        operation_id: "appstore.releases.rollout.update",
        auth: RouteAuth::DualToken,
        handler: "releases_rollout_update",
        service_method: "releases_rollout_update",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/releases/{releaseId}/retire",
        operation_id: "appstore.releases.retire",
        auth: RouteAuth::DualToken,
        handler: "releases_retire",
        service_method: "releases_retire",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
