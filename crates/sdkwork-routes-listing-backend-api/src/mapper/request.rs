use sdkwork_appstore_listing_service::domain::commands::{
    AdminListListingsRequest, AdminRetrieveListingRequest, AdminUpdateListingVisibilityRequest,
};

pub fn map_admin_list_listings(
    status_filter: Option<String>,
    review_status_filter: Option<String>,
    publisher_id: Option<String>,
    cursor: Option<String>,
    page_size: Option<i32>,
) -> AdminListListingsRequest {
    let mut req = AdminListListingsRequest::new();
    if let Some(v) = status_filter {
        req = req.with_status_filter(v);
    }
    if let Some(v) = review_status_filter {
        req = req.with_review_status_filter(v);
    }
    if let Some(v) = publisher_id {
        req = req.with_publisher_id(v);
    }
    if let Some(v) = cursor {
        req = req.with_cursor(v);
    }
    if let Some($1) = page_size {
        req = req.with_page_size(v);
    }
    req
}

pub fn map_admin_retrieve_listing(listing_id: String) -> AdminRetrieveListingRequest {
    AdminRetrieveListingRequest::new(listing_id)
}

pub fn map_admin_update_listing_visibility(
    listing_id: String,
    storefront_visibility: String,
) -> AdminUpdateListingVisibilityRequest {
    AdminUpdateListingVisibilityRequest::new(listing_id, storefront_visibility)
}
