//! Route crate skeleton for sdkwork-router-release-app-api.

pub mod error;
pub mod handlers;
pub mod manifest;
pub mod mapper;
pub mod paths;
pub mod http_route_manifest;
pub mod routes;
pub mod web_bootstrap;

pub use handlers::{route_handler_plans, RouteHandlerPlan};
pub use manifest::{route_manifest, RouteManifest};
pub use routes::{route_definitions, RouteDefinition};
pub use http_route_manifest::app_route_manifest;
pub use web_bootstrap::{
    appstore_app_api_prefixes, appstore_app_api_public_path_prefixes,
    wrap_router_with_web_framework, wrap_router_with_web_framework_from_env,
};
