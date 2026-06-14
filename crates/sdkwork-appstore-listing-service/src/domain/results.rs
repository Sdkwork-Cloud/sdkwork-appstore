//! Listing operation results.

use serde::{Deserialize, Serialize};

use super::models::{
    Listing, ListingCategoryBinding, ListingLocalization, ListingMedia, ListingSubmission,
    RegionalAvailability,
};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ListingOperationResult {
    pub operation_id: &'static str,
    pub accepted: bool,
}

impl ListingOperationResult {
    pub fn accepted(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            accepted: true,
        }
    }

    pub fn rejected(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            accepted: false,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct RetrieveListingResult {
    pub operation_id: &'static str,
    pub listing: Option<Listing>,
}

impl RetrieveListingResult {
    pub fn found(operation_id: &'static str, listing: Listing) -> Self {
        Self {
            operation_id,
            listing: Some(listing),
        }
    }

    pub fn not_found(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            listing: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CreateListingResult {
    pub operation_id: &'static str,
    pub listing: Listing,
}

impl CreateListingResult {
    pub fn created(operation_id: &'static str, listing: Listing) -> Self {
        Self {
            operation_id,
            listing,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct UpdateListingResult {
    pub operation_id: &'static str,
    pub listing: Listing,
}

impl UpdateListingResult {
    pub fn updated(operation_id: &'static str, listing: Listing) -> Self {
        Self {
            operation_id,
            listing,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct UpsertListingLocalizationResult {
    pub operation_id: &'static str,
    pub localization: ListingLocalization,
}

impl UpsertListingLocalizationResult {
    pub fn upserted(operation_id: &'static str, localization: ListingLocalization) -> Self {
        Self {
            operation_id,
            localization,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ListListingMediaResult {
    pub operation_id: &'static str,
    pub media: Vec<ListingMedia>,
}

impl ListListingMediaResult {
    pub fn new(operation_id: &'static str, media: Vec<ListingMedia>) -> Self {
        Self {
            operation_id,
            media,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct AttachListingMediaResult {
    pub operation_id: &'static str,
    pub media: ListingMedia,
}

impl AttachListingMediaResult {
    pub fn attached(operation_id: &'static str, media: ListingMedia) -> Self {
        Self {
            operation_id,
            media,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct RemoveListingMediaResult {
    pub operation_id: &'static str,
    pub removed: bool,
}

impl RemoveListingMediaResult {
    pub fn removed(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            removed: true,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct BindListingCategoriesResult {
    pub operation_id: &'static str,
    pub listing: Listing,
    pub bindings: Vec<ListingCategoryBinding>,
}

impl BindListingCategoriesResult {
    pub fn bound(
        operation_id: &'static str,
        listing: Listing,
        bindings: Vec<ListingCategoryBinding>,
    ) -> Self {
        Self {
            operation_id,
            listing,
            bindings,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct UpdateRegionalAvailabilityResult {
    pub operation_id: &'static str,
    pub availabilities: Vec<RegionalAvailability>,
}

impl UpdateRegionalAvailabilityResult {
    pub fn updated(operation_id: &'static str, availabilities: Vec<RegionalAvailability>) -> Self {
        Self {
            operation_id,
            availabilities,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ListListingReleasesResult {
    pub operation_id: &'static str,
    pub releases: Vec<serde_json::Value>,
    pub next_cursor: Option<String>,
    pub has_more: bool,
}

impl ListListingReleasesResult {
    pub fn new(
        operation_id: &'static str,
        releases: Vec<serde_json::Value>,
        next_cursor: Option<String>,
        has_more: bool,
    ) -> Self {
        Self {
            operation_id,
            releases,
            next_cursor,
            has_more,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CreateListingSubmissionResult {
    pub operation_id: &'static str,
    pub submission: ListingSubmission,
}

impl CreateListingSubmissionResult {
    pub fn created(operation_id: &'static str, submission: ListingSubmission) -> Self {
        Self {
            operation_id,
            submission,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct AdminListListingsResult {
    pub operation_id: &'static str,
    pub listings: Vec<Listing>,
    pub next_cursor: Option<String>,
    pub has_more: bool,
}

impl AdminListListingsResult {
    pub fn new(
        operation_id: &'static str,
        listings: Vec<Listing>,
        next_cursor: Option<String>,
        has_more: bool,
    ) -> Self {
        Self {
            operation_id,
            listings,
            next_cursor,
            has_more,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct AdminRetrieveListingResult {
    pub operation_id: &'static str,
    pub listing: Option<Listing>,
}

impl AdminRetrieveListingResult {
    pub fn found(operation_id: &'static str, listing: Listing) -> Self {
        Self {
            operation_id,
            listing: Some(listing),
        }
    }

    pub fn not_found(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            listing: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct AdminUpdateListingVisibilityResult {
    pub operation_id: &'static str,
    pub listing: Listing,
}

impl AdminUpdateListingVisibilityResult {
    pub fn updated(operation_id: &'static str, listing: Listing) -> Self {
        Self {
            operation_id,
            listing,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct PublicRetrieveListingResult {
    pub operation_id: &'static str,
    pub listing: Option<Listing>,
}

impl PublicRetrieveListingResult {
    pub fn found(operation_id: &'static str, listing: Listing) -> Self {
        Self {
            operation_id,
            listing: Some(listing),
        }
    }

    pub fn not_found(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            listing: None,
        }
    }
}
