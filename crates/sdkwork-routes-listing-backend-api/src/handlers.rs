use crate::mapper;
use sdkwork_appstore_listing_service::context::AppstoreRequestContext;
use sdkwork_appstore_listing_service::domain::results::{
    AdminListListingsResult, AdminRetrieveListingResult, AdminUpdateListingVisibilityResult,
};
use sdkwork_appstore_listing_service::error::AppstoreServiceError;
use sdkwork_appstore_listing_service::ListingOperations;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteHandlerPlan {
    pub operation_id: &'static str,
    pub handler_name: &'static str,
    pub service_method: &'static str,
}

pub const ROUTE_HANDLER_PLANS: &[RouteHandlerPlan] = &[
    RouteHandlerPlan {
        operation_id: "appstore.listings.admin.list",
        handler_name: "listings_admin_list",
        service_method: "admin_list_listings",
    },
    RouteHandlerPlan {
        operation_id: "appstore.listings.admin.retrieve",
        handler_name: "listings_admin_retrieve",
        service_method: "admin_retrieve_listing",
    },
    RouteHandlerPlan {
        operation_id: "appstore.listings.admin.visibility.update",
        handler_name: "listings_admin_visibility_update",
        service_method: "admin_update_listing_visibility",
    },
];

pub fn route_handler_plans() -> &'static [RouteHandlerPlan] {
    ROUTE_HANDLER_PLANS
}

pub async fn listings_admin_list<S: ListingOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    status_filter: Option<String>,
    review_status_filter: Option<String>,
    publisher_id: Option<String>,
    cursor: Option<String>,
    page_size: Option<i32>,
) -> Result<AdminListListingsResult, AppstoreServiceError> {
    let cmd = mapper::request::map_admin_list_listings(
        status_filter,
        review_status_filter,
        publisher_id,
        cursor,
        page_size,
    );
    service.admin_list_listings(context, cmd).await
}

pub async fn listings_admin_retrieve<S: ListingOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    listing_id: String,
) -> Result<AdminRetrieveListingResult, AppstoreServiceError> {
    let cmd = mapper::request::map_admin_retrieve_listing(listing_id);
    service.admin_retrieve_listing(context, cmd).await
}

pub async fn listings_admin_visibility_update<S: ListingOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    listing_id: String,
    storefront_visibility: String,
) -> Result<AdminUpdateListingVisibilityResult, AppstoreServiceError> {
    let cmd =
        mapper::request::map_admin_update_listing_visibility(listing_id, storefront_visibility);
    service.admin_update_visibility(context, cmd).await
}
