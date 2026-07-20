//! Route crate for appstore catalog app-api.

mod runtime;

pub mod handlers;
pub mod http_route_manifest;
pub mod manifest;
pub mod mapper;
pub mod paths;
pub mod routes;
pub mod web_bootstrap;

pub use handlers::{route_handler_plans, RouteHandlerPlan};
pub use http_route_manifest::app_route_manifest;
pub use manifest::{build_route_manifest, RouteManifest};
pub use routes::{route_definitions, RouteDefinition};
pub use web_bootstrap::{
    appstore_app_api_prefixes, appstore_app_api_public_path_prefixes,
    wrap_router_with_web_framework, wrap_router_with_web_framework_from_env,
};

pub fn route_crate_name() -> &'static str {
    "sdkwork-routes-catalog-app-api"
}

pub fn gateway_route_manifest() -> RouteManifest {
    build_route_manifest()
}

pub fn gateway_mount(state: sdkwork_appstore_routes_common::AppState) -> axum::Router {
    runtime::routes().with_state(state)
}
