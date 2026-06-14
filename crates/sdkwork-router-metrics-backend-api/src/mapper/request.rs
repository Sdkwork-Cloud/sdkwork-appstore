use sdkwork_appstore_catalog_service::domain::commands::MetricsRetrieveRequest;

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
