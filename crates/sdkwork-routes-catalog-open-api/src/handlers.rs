use crate::mapper;
use sdkwork_appstore_catalog_service::context::AppstoreRequestContext;
use sdkwork_appstore_catalog_service::domain::results::PublicFeaturedListResult;
use sdkwork_appstore_catalog_service::error::AppstoreServiceError;
use sdkwork_appstore_catalog_service::CatalogOperations;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteHandlerPlan {
    pub operation_id: &'static str,
    pub handler_name: &'static str,
    pub service_method: &'static str,
}

pub const ROUTE_HANDLER_PLANS: &[RouteHandlerPlan] = &[RouteHandlerPlan {
    operation_id: "appstore.catalog.public.featured.list",
    handler_name: "catalog_public_featured_list",
    service_method: "list_public_featured",
}];

pub fn route_handler_plans() -> &'static [RouteHandlerPlan] {
    ROUTE_HANDLER_PLANS
}

pub async fn catalog_public_featured_list<S: CatalogOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    locale: Option<String>,
    platform: Option<String>,
    page_size: Option<i32>,
) -> Result<PublicFeaturedListResult, AppstoreServiceError> {
    let cmd = mapper::request::map_public_featured_list(locale, platform, page_size);
    service.public_featured_list(context, cmd).await
}
