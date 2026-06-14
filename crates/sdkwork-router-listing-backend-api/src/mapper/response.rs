use sdkwork_appstore_listing_service::domain::results::{
    AdminListListingsResult, AdminRetrieveListingResult, AdminUpdateListingVisibilityResult,
};

pub fn map_admin_list_listings_response(
    result: AdminListListingsResult,
) -> AdminListListingsResult {
    result
}

pub fn map_admin_retrieve_listing_response(
    result: AdminRetrieveListingResult,
) -> AdminRetrieveListingResult {
    result
}

pub fn map_admin_update_listing_visibility_response(
    result: AdminUpdateListingVisibilityResult,
) -> AdminUpdateListingVisibilityResult {
    result
}
