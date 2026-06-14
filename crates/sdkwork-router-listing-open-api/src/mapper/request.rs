use sdkwork_appstore_listing_service::domain::commands::PublicRetrieveListingRequest;

pub fn map_public_retrieve_listing(listing_slug: String) -> PublicRetrieveListingRequest {
    PublicRetrieveListingRequest::new(listing_slug)
}
