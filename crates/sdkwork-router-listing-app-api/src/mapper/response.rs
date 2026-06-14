use sdkwork_appstore_listing_service::domain::results::{
    AttachListingMediaResult, BindListingCategoriesResult, CreateListingResult,
    CreateListingSubmissionResult, ListListingMediaResult, ListListingReleasesResult,
    RemoveListingMediaResult, RetrieveListingResult, UpdateListingResult,
    UpdateRegionalAvailabilityResult, UpsertListingLocalizationResult,
};

pub fn map_retrieve_listing_response(result: RetrieveListingResult) -> RetrieveListingResult {
    result
}

pub fn map_list_listing_media_response(result: ListListingMediaResult) -> ListListingMediaResult {
    result
}

pub fn map_list_listing_releases_response(
    result: ListListingReleasesResult,
) -> ListListingReleasesResult {
    result
}

pub fn map_create_listing_response(result: CreateListingResult) -> CreateListingResult {
    result
}

pub fn map_update_listing_response(result: UpdateListingResult) -> UpdateListingResult {
    result
}

pub fn map_upsert_listing_localization_response(
    result: UpsertListingLocalizationResult,
) -> UpsertListingLocalizationResult {
    result
}

pub fn map_attach_listing_media_response(
    result: AttachListingMediaResult,
) -> AttachListingMediaResult {
    result
}

pub fn map_remove_listing_media_response(
    result: RemoveListingMediaResult,
) -> RemoveListingMediaResult {
    result
}

pub fn map_bind_listing_categories_response(
    result: BindListingCategoriesResult,
) -> BindListingCategoriesResult {
    result
}

pub fn map_update_regional_availability_response(
    result: UpdateRegionalAvailabilityResult,
) -> UpdateRegionalAvailabilityResult {
    result
}

pub fn map_create_listing_submission_response(
    result: CreateListingSubmissionResult,
) -> CreateListingSubmissionResult {
    result
}
