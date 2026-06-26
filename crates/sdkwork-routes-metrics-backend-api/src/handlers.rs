use crate::mapper;
use sdkwork_appstore_catalog_service::context::AppstoreRequestContext;
use sdkwork_appstore_catalog_service::domain::results::MetricsRetrieveResult;
use sdkwork_appstore_catalog_service::error::AppstoreServiceError;
use sdkwork_appstore_catalog_service::CatalogOperations;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteHandlerPlan {
    pub operation_id: &'static str,
    pub handler_name: &'static str,
    pub service_method: &'static str,
}

pub const ROUTE_HANDLER_PLANS: &[RouteHandlerPlan] = &[RouteHandlerPlan {
    operation_id: "appstore.metrics.listings.retrieve",
    handler_name: "metrics_listings_retrieve",
    service_method: "retrieve_listing_metrics",
}];

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
