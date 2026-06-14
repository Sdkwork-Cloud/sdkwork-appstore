//! Deterministic route manifest for catalog app-api.

use crate::routes::{build_routes, RouteDescriptor};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RouteManifest {
    pub descriptor: RouteDescriptor,
    pub operation_ids: &'static [&'static str],
}

pub fn build_route_manifest() -> RouteManifest {
    RouteManifest {
        descriptor: build_routes(),
        operation_ids: &[
            "appstore.catalog.home.retrieve",
            "appstore.catalog.categories.list",
            "appstore.catalog.categories.retrieve",
            "appstore.catalog.collections.list",
            "appstore.catalog.collections.retrieve",
            "appstore.catalog.featured.list",
            "appstore.catalog.charts.retrieve",
            "appstore.catalog.listings.search",
        ],
    }
}
