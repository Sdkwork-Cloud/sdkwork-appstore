//! Route composition for catalog app-api.

use crate::paths::{API_AUTHORITY, CAPABILITY, PREFIX, SDK_FAMILY, SURFACE};

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
        method: "GET",
        path: "/app/v3/api/catalog/home",
        operation_id: "appstore.catalog.home.retrieve",
        handler: "catalog_home_retrieve",
        service_method: "catalog_home_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/catalog/categories",
        operation_id: "appstore.catalog.categories.list",
        handler: "catalog_categories_list",
        service_method: "catalog_categories_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/catalog/categories/{categoryId}",
        operation_id: "appstore.catalog.categories.retrieve",
        handler: "catalog_categories_retrieve",
        service_method: "catalog_categories_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/catalog/collections",
        operation_id: "appstore.catalog.collections.list",
        handler: "catalog_collections_list",
        service_method: "catalog_collections_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/catalog/collections/{collectionId}",
        operation_id: "appstore.catalog.collections.retrieve",
        handler: "catalog_collections_retrieve",
        service_method: "catalog_collections_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/catalog/featured",
        operation_id: "appstore.catalog.featured.list",
        handler: "catalog_featured_list",
        service_method: "catalog_featured_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/catalog/charts/{chartCode}",
        operation_id: "appstore.catalog.charts.retrieve",
        handler: "catalog_charts_retrieve",
        service_method: "catalog_charts_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/catalog/listings/search",
        operation_id: "appstore.catalog.listings.search",
        handler: "catalog_listings_search",
        service_method: "catalog_listings_search",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/catalog/recommendations",
        operation_id: "appstore.catalog.recommendations.list",
        handler: "catalog_recommendations_list",
        service_method: "catalog_recommendations_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/catalog/recently_updated",
        operation_id: "appstore.catalog.recentlyUpdated.list",
        handler: "catalog_recently_updated_list",
        service_method: "catalog_recently_updated_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/catalog/events",
        operation_id: "appstore.catalog.events.list",
        handler: "catalog_events_list",
        service_method: "catalog_events_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/catalog/events/{eventId}",
        operation_id: "appstore.catalog.events.retrieve",
        handler: "catalog_events_retrieve",
        service_method: "catalog_events_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/catalog/search/suggestions",
        operation_id: "appstore.catalog.search.suggestions.list",
        handler: "catalog_search_suggestions_list",
        service_method: "catalog_search_suggestions_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/catalog/search/trending",
        operation_id: "appstore.catalog.search.trending.list",
        handler: "catalog_search_trending_list",
        service_method: "catalog_search_trending_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/catalog/search/history",
        operation_id: "appstore.catalog.search.history.list",
        handler: "catalog_search_history_list",
        service_method: "catalog_search_history_list",
    },
    RouteDefinition {
        method: "PUT",
        path: "/app/v3/api/catalog/search/history",
        operation_id: "appstore.catalog.search.history.upsert",
        handler: "catalog_search_history_upsert",
        service_method: "catalog_search_history_upsert",
    },
    RouteDefinition {
        method: "DELETE",
        path: "/app/v3/api/catalog/search/history",
        operation_id: "appstore.catalog.search.history.clear",
        handler: "catalog_search_history_clear",
        service_method: "catalog_search_history_clear",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RouteDescriptor {
    pub api_authority: &'static str,
    pub capability: &'static str,
    pub prefix: &'static str,
    pub sdk_family: &'static str,
    pub surface: &'static str,
}

pub fn build_routes() -> RouteDescriptor {
    RouteDescriptor {
        api_authority: API_AUTHORITY,
        capability: CAPABILITY,
        prefix: PREFIX,
        sdk_family: SDK_FAMILY,
        surface: SURFACE,
    }
}
