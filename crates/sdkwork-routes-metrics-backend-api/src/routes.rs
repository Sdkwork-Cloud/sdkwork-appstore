//! Route registration descriptors for sdkwork-routes-metrics-backend-api.

pub use sdkwork_appstore_routes_common::RouteDefinition;
use sdkwork_web_core::RouteAuth;

pub const ROUTES: &[RouteDefinition] = &[
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/metrics/listings/{listingId}",
        operation_id: "appstore.metrics.listings.retrieve",
        auth: RouteAuth::DualToken,
        handler: "metrics_listings_retrieve",
        service_method: "metrics_listings_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/analytics/publisher/overview",
        operation_id: "appstore.analytics.publisher.overview.retrieve",
        auth: RouteAuth::DualToken,
        handler: "analytics_publisher_overview_retrieve",
        service_method: "analytics_publisher_overview_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/analytics/publisher/listings",
        operation_id: "appstore.analytics.publisher.listings.list",
        auth: RouteAuth::DualToken,
        handler: "analytics_publisher_listings_list",
        service_method: "analytics_publisher_listings_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/analytics/publisher/listings/{listingId}",
        operation_id: "appstore.analytics.publisher.listings.retrieve",
        auth: RouteAuth::DualToken,
        handler: "analytics_publisher_listings_retrieve",
        service_method: "analytics_publisher_listings_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/analytics/operator/dashboard",
        operation_id: "appstore.analytics.operator.dashboard.retrieve",
        auth: RouteAuth::DualToken,
        handler: "analytics_operator_dashboard_retrieve",
        service_method: "analytics_operator_dashboard_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/analytics/operator/search",
        operation_id: "appstore.analytics.operator.search.retrieve",
        auth: RouteAuth::DualToken,
        handler: "analytics_operator_search_retrieve",
        service_method: "analytics_operator_search_retrieve",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
