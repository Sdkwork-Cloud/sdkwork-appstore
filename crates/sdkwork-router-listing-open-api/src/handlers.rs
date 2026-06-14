use crate::mapper;
use sdkwork_appstore_listing_service::context::AppstoreRequestContext;
use sdkwork_appstore_listing_service::domain::results::PublicRetrieveListingResult;
use sdkwork_appstore_listing_service::error::AppstoreServiceError;
use sdkwork_appstore_listing_service::ListingOperations;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteHandlerPlan {
    pub operation_id: &'static str,
    pub handler_name: &'static str,
    pub service_method: &'static str,
}

pub const ROUTE_HANDLER_PLANS: &[RouteHandlerPlan] = &[RouteHandlerPlan {
    operation_id: "appstore.listings.public.retrieve",
    handler_name: "listings_public_retrieve",
    service_method: "public_retrieve_listing",
}];

pub fn route_handler_plans() -> &'static [RouteHandlerPlan] {
    ROUTE_HANDLER_PLANS
}

pub async fn listings_public_retrieve<S: ListingOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    listing_slug: String,
) -> Result<PublicRetrieveListingResult, AppstoreServiceError> {
    let cmd = mapper::request::map_public_retrieve_listing(listing_slug);
    service.public_retrieve_listing(context, cmd).await
}
