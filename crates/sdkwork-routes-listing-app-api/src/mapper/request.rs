use sdkwork_appstore_listing_service::domain::commands::{
    AttachListingMediaRequest, BindListingCategoriesRequest, CreateListingRequest,
    CreateListingSubmissionRequest, ListDeveloperOtherListingsRequest, ListListingMediaRequest,
    ListListingReleaseHistoryRequest, ListListingReleasesRequest, ListPublisherListingsRequest,
    ListSimilarListingsRequest, RegionEntry, RemoveListingMediaRequest,
    RetrieveListingEditorialRequest, RetrieveListingRequest, UpdateListingRequest,
    UpdateRegionalAvailabilityRequest, UpsertListingLocalizationRequest,
};

pub fn map_retrieve_listing(listing_id: String) -> RetrieveListingRequest {
    RetrieveListingRequest::new(listing_id)
}

pub fn map_list_listing_media(listing_id: String) -> ListListingMediaRequest {
    ListListingMediaRequest::new(listing_id)
}

pub fn map_list_listing_releases(
    listing_id: String,
    cursor: Option<String>,
    limit: Option<i32>,
) -> ListListingReleasesRequest {
    let mut req = ListListingReleasesRequest::new(listing_id);
    if let Some(v) = cursor {
        req = req.with_cursor(v);
    }
    if let Some(v) = limit {
        req = req.with_limit(v);
    }
    req
}

pub fn map_list_publisher_listings(
    publisher_id: String,
    cursor: Option<String>,
    limit: Option<i32>,
) -> ListPublisherListingsRequest {
    let mut req = ListPublisherListingsRequest::new(publisher_id);
    if let Some(value) = cursor {
        req = req.with_cursor(value);
    }
    if let Some(value) = limit {
        req = req.with_limit(value);
    }
    req
}

pub fn map_create_listing(
    app_id: String,
    app_key: String,
    publisher_id: String,
    default_locale: String,
    listing_slug: Option<String>,
    pricing_model: Option<String>,
) -> CreateListingRequest {
    let mut req = CreateListingRequest::new(app_id, app_key, publisher_id, default_locale);
    if let Some(v) = listing_slug {
        req = req.with_listing_slug(v);
    }
    if let Some(v) = pricing_model {
        req = req.with_pricing_model(v);
    }
    req
}

pub fn map_update_listing(
    listing_id: String,
    pricing_model: Option<String>,
    official_website_url: Option<String>,
    support_url: Option<String>,
    privacy_policy_url: Option<String>,
) -> UpdateListingRequest {
    let mut req = UpdateListingRequest::new(listing_id);
    if let Some(v) = pricing_model {
        req = req.with_pricing_model(v);
    }
    if let Some(v) = official_website_url {
        req = req.with_official_website_url(v);
    }
    if let Some(v) = support_url {
        req = req.with_support_url(v);
    }
    if let Some(v) = privacy_policy_url {
        req = req.with_privacy_policy_url(v);
    }
    req
}

pub fn map_upsert_listing_localization(
    listing_id: String,
    locale: String,
    display_name: String,
    short_description: String,
    full_description: String,
    subtitle: Option<String>,
    whats_new_summary: Option<String>,
    keywords: Option<Vec<String>>,
) -> UpsertListingLocalizationRequest {
    let mut req = UpsertListingLocalizationRequest::new(
        listing_id,
        locale,
        display_name,
        short_description,
        full_description,
    );
    if let Some(v) = subtitle {
        req = req.with_subtitle(v);
    }
    if let Some(v) = whats_new_summary {
        req = req.with_whats_new_summary(v);
    }
    if let Some(v) = keywords {
        req = req.with_keywords(v);
    }
    req
}

pub fn map_attach_listing_media(
    listing_id: String,
    media_role: String,
    media_resource_id: String,
    platform_scope: Option<String>,
    locale: Option<String>,
) -> AttachListingMediaRequest {
    let mut req = AttachListingMediaRequest::new(listing_id, media_role, media_resource_id);
    if let Some(v) = platform_scope {
        req = req.with_platform_scope(v);
    }
    if let Some(v) = locale {
        req = req.with_locale(v);
    }
    req
}

pub fn map_remove_listing_media(listing_id: String, media_id: String) -> RemoveListingMediaRequest {
    RemoveListingMediaRequest::new(listing_id, media_id)
}

pub fn map_bind_listing_categories(
    listing_id: String,
    category_ids: Vec<String>,
    primary_category_id: Option<String>,
) -> BindListingCategoriesRequest {
    let mut req = BindListingCategoriesRequest::new(listing_id, category_ids);
    if let Some(v) = primary_category_id {
        req = req.with_primary_category_id(v);
    }
    req
}

pub fn map_update_regional_availability(
    listing_id: String,
    regions: Vec<RegionEntry>,
) -> UpdateRegionalAvailabilityRequest {
    UpdateRegionalAvailabilityRequest::new(listing_id, regions)
}

pub fn map_create_listing_submission(
    listing_id: String,
    submission_type: String,
    release_id: Option<String>,
) -> CreateListingSubmissionRequest {
    let mut req = CreateListingSubmissionRequest::new(listing_id, submission_type);
    if let Some(v) = release_id {
        req = req.with_release_id(v);
    }
    req
}

pub fn map_list_listing_release_history(
    listing_id: String,
    cursor: Option<String>,
    limit: Option<i32>,
) -> ListListingReleaseHistoryRequest {
    let mut req = ListListingReleaseHistoryRequest::new(listing_id);
    if let Some(v) = cursor {
        req = req.with_cursor(v);
    }
    if let Some(v) = limit {
        req = req.with_limit(v);
    }
    req
}

pub fn map_list_similar_listings(
    listing_id: String,
    cursor: Option<String>,
    limit: Option<i32>,
) -> ListSimilarListingsRequest {
    let mut req = ListSimilarListingsRequest::new(listing_id);
    if let Some(v) = cursor {
        req = req.with_cursor(v);
    }
    if let Some(v) = limit {
        req = req.with_limit(v);
    }
    req
}

pub fn map_list_developer_other_listings(
    listing_id: String,
    cursor: Option<String>,
    limit: Option<i32>,
) -> ListDeveloperOtherListingsRequest {
    let mut req = ListDeveloperOtherListingsRequest::new(listing_id);
    if let Some(v) = cursor {
        req = req.with_cursor(v);
    }
    if let Some(v) = limit {
        req = req.with_limit(v);
    }
    req
}

pub fn map_retrieve_listing_editorial(listing_id: String) -> RetrieveListingEditorialRequest {
    RetrieveListingEditorialRequest::new(listing_id)
}
