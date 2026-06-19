//! Deterministic route manifest for catalog app-api.

use crate::routes::{build_routes, route_definitions, RouteDefinition, RouteDescriptor};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RouteManifest {
    pub descriptor: RouteDescriptor,
    pub routes: &'static [RouteDefinition],
}

pub fn build_route_manifest() -> RouteManifest {
    RouteManifest {
        descriptor: build_routes(),
        routes: route_definitions(),
    }
}
