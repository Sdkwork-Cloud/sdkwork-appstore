//! Route crate for appstore catalog app-api.

pub mod handlers;
pub mod manifest;
pub mod mapper;
pub mod paths;
pub mod routes;

pub fn route_crate_name() -> &'static str {
    "sdkwork-router-catalog-app-api"
}
