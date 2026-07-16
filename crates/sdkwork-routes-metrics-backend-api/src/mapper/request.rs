use sdkwork_appstore_catalog_service::domain::commands::{
    AnalyticsOperatorDashboardRequest, AnalyticsOperatorSearchRequest,
    AnalyticsPublisherListingRetrieveRequest, AnalyticsPublisherListingsListRequest,
    AnalyticsPublisherOverviewRequest, MetricsRetrieveRequest,
};

pub fn map_metrics_retrieve(
    listing_id: String,
    start_date: Option<String>,
    end_date: Option<String>,
) -> MetricsRetrieveRequest {
    let mut req = MetricsRetrieveRequest::new(listing_id);
    if let Some(v) = start_date {
        req = req.with_start_date(v);
    }
    if let Some(v) = end_date {
        req = req.with_end_date(v);
    }
    req
}

pub fn map_analytics_publisher_overview(
    date_from: Option<String>,
    date_to: Option<String>,
) -> AnalyticsPublisherOverviewRequest {
    AnalyticsPublisherOverviewRequest { date_from, date_to }
}

pub fn map_analytics_publisher_listings_list(
    date_from: Option<String>,
    date_to: Option<String>,
    cursor: Option<String>,
    page_size: Option<i32>,
) -> AnalyticsPublisherListingsListRequest {
    AnalyticsPublisherListingsListRequest {
        date_from,
        date_to,
        cursor,
        page_size,
    }
}

pub fn map_analytics_publisher_listing_retrieve(
    listing_id: String,
    date_from: Option<String>,
    date_to: Option<String>,
) -> AnalyticsPublisherListingRetrieveRequest {
    AnalyticsPublisherListingRetrieveRequest {
        listing_id,
        date_from,
        date_to,
    }
}

pub fn map_analytics_operator_dashboard(
    date_from: Option<String>,
    date_to: Option<String>,
) -> AnalyticsOperatorDashboardRequest {
    AnalyticsOperatorDashboardRequest { date_from, date_to }
}

pub fn map_analytics_operator_search(
    query: Option<String>,
    date_from: Option<String>,
    date_to: Option<String>,
) -> AnalyticsOperatorSearchRequest {
    AnalyticsOperatorSearchRequest {
        query,
        date_from,
        date_to,
    }
}
