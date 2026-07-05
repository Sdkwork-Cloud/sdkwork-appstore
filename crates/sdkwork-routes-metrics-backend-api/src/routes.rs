//! Route registration descriptors for sdkwork-routes-metrics-backend-api.

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
        path: "/backend/v3/api/metrics/listings/{listingId}",
        operation_id: "appstore.metrics.listings.retrieve",
        handler: "metrics_listings_retrieve",
        service_method: "metrics_listings_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/analytics/publisher/overview",
        operation_id: "appstore.analytics.publisher.overview.retrieve",
        handler: "analytics_publisher_overview_retrieve",
        service_method: "analytics_publisher_overview_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/analytics/publisher/listings",
        operation_id: "appstore.analytics.publisher.listings.list",
        handler: "analytics_publisher_listings_list",
        service_method: "analytics_publisher_listings_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/analytics/publisher/listings/{listingId}",
        operation_id: "appstore.analytics.publisher.listings.retrieve",
        handler: "analytics_publisher_listings_retrieve",
        service_method: "analytics_publisher_listings_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/analytics/operator/dashboard",
        operation_id: "appstore.analytics.operator.dashboard.retrieve",
        handler: "analytics_operator_dashboard_retrieve",
        service_method: "analytics_operator_dashboard_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/analytics/operator/search",
        operation_id: "appstore.analytics.operator.search.retrieve",
        handler: "analytics_operator_search_retrieve",
        service_method: "analytics_operator_search_retrieve",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
