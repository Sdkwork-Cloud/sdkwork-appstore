//! Route crate skeleton for sdkwork-router-moderation-backend-api.

pub mod error;
pub mod handlers;
pub mod manifest;
pub mod mapper;
pub mod paths;
pub mod routes;

pub use handlers::{route_handler_plans, RouteHandlerPlan};
pub use manifest::{route_manifest, RouteManifest};
pub use routes::{route_definitions, RouteDefinition};
