use crate::mapper;
use sdkwork_appstore_catalog_service::context::AppstoreRequestContext;
use sdkwork_appstore_catalog_service::domain::results::{
    AnalyticsOperatorDashboardResult, AnalyticsOperatorSearchResult,
    AnalyticsPublisherListingRetrieveResult, AnalyticsPublisherListingsListResult,
    AnalyticsPublisherOverviewResult, MetricsRetrieveResult,
};
use sdkwork_appstore_catalog_service::error::AppstoreServiceError;
use sdkwork_appstore_catalog_service::CatalogOperations;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteHandlerPlan {
    pub operation_id: &'static str,
    pub handler_name: &'static str,
    pub service_method: &'static str,
}

pub const ROUTE_HANDLER_PLANS: &[RouteHandlerPlan] = &[
    RouteHandlerPlan {
        operation_id: "appstore.metrics.listings.retrieve",
        handler_name: "metrics_listings_retrieve",
        service_method: "retrieve_listing_metrics",
    },
    RouteHandlerPlan {
        operation_id: "appstore.analytics.publisher.overview.retrieve",
        handler_name: "analytics_publisher_overview_retrieve",
        service_method: "analytics_publisher_overview_retrieve",
    },
    RouteHandlerPlan {
        operation_id: "appstore.analytics.publisher.listings.list",
        handler_name: "analytics_publisher_listings_list",
        service_method: "analytics_publisher_listings_list",
    },
    RouteHandlerPlan {
        operation_id: "appstore.analytics.publisher.listings.retrieve",
        handler_name: "analytics_publisher_listings_retrieve",
        service_method: "analytics_publisher_listings_retrieve",
    },
    RouteHandlerPlan {
        operation_id: "appstore.analytics.operator.dashboard.retrieve",
        handler_name: "analytics_operator_dashboard_retrieve",
        service_method: "analytics_operator_dashboard_retrieve",
    },
    RouteHandlerPlan {
        operation_id: "appstore.analytics.operator.search.retrieve",
        handler_name: "analytics_operator_search_retrieve",
        service_method: "analytics_operator_search_retrieve",
    },
];

pub fn route_handler_plans() -> &'static [RouteHandlerPlan] {
    ROUTE_HANDLER_PLANS
}

pub async fn metrics_listings_retrieve<S: CatalogOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    listing_id: String,
    start_date: Option<String>,
    end_date: Option<String>,
) -> Result<MetricsRetrieveResult, AppstoreServiceError> {
    let cmd = mapper::request::map_metrics_retrieve(listing_id, start_date, end_date);
    service.metrics_retrieve(context, cmd).await
}

pub async fn analytics_publisher_overview_retrieve<S: CatalogOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    date_from: Option<String>,
    date_to: Option<String>,
) -> Result<AnalyticsPublisherOverviewResult, AppstoreServiceError> {
    let cmd = mapper::request::map_analytics_publisher_overview(date_from, date_to);
    service
        .analytics_publisher_overview_retrieve(context, cmd)
        .await
}

pub async fn analytics_publisher_listings_list<S: CatalogOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    date_from: Option<String>,
    date_to: Option<String>,
    cursor: Option<String>,
    page_size: Option<i32>,
) -> Result<AnalyticsPublisherListingsListResult, AppstoreServiceError> {
    let cmd = mapper::request::map_analytics_publisher_listings_list(
        date_from, date_to, cursor, page_size,
    );
    service
        .analytics_publisher_listings_list(context, cmd)
        .await
}

pub async fn analytics_publisher_listings_retrieve<S: CatalogOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    listing_id: String,
    date_from: Option<String>,
    date_to: Option<String>,
) -> Result<AnalyticsPublisherListingRetrieveResult, AppstoreServiceError> {
    let cmd =
        mapper::request::map_analytics_publisher_listing_retrieve(listing_id, date_from, date_to);
    service
        .analytics_publisher_listings_retrieve(context, cmd)
        .await
}

pub async fn analytics_operator_dashboard_retrieve<S: CatalogOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    date_from: Option<String>,
    date_to: Option<String>,
) -> Result<AnalyticsOperatorDashboardResult, AppstoreServiceError> {
    let cmd = mapper::request::map_analytics_operator_dashboard(date_from, date_to);
    service
        .analytics_operator_dashboard_retrieve(context, cmd)
        .await
}

pub async fn analytics_operator_search_retrieve<S: CatalogOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    query: Option<String>,
    date_from: Option<String>,
    date_to: Option<String>,
) -> Result<AnalyticsOperatorSearchResult, AppstoreServiceError> {
    let cmd = mapper::request::map_analytics_operator_search(query, date_from, date_to);
    service
        .analytics_operator_search_retrieve(context, cmd)
        .await
}
