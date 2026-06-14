//! App Store listing service boundary.

pub mod context;
pub mod domain;
pub mod error;
pub mod ports;
pub mod service;

pub use context::AppstoreRequestContext;
pub use domain::commands::{
    AdminListListingsRequest, AdminRetrieveListingRequest, AdminUpdateListingVisibilityRequest,
    AttachListingMediaRequest, BindListingCategoriesRequest, CreateListingRequest,
    CreateListingSubmissionRequest, ListListingMediaRequest, ListListingReleasesRequest,
    ListingOperationRequest, PublicRetrieveListingRequest, RemoveListingMediaRequest,
    RetrieveListingRequest, UpdateListingRequest, UpdateRegionalAvailabilityRequest,
    UpsertListingLocalizationRequest,
};
pub use domain::models::{
    Listing, ListingCategoryBinding, ListingId, ListingLocalization, ListingMedia, ListingStatus,
    ListingSubmission, ListingType, MediaRole, PricingModel, RegionalAvailability, ReviewStatus,
    StorefrontVisibility, SubmissionStatus, SubmissionType,
};
pub use domain::results::{
    AdminListListingsResult, AdminRetrieveListingResult, AdminUpdateListingVisibilityResult,
    AttachListingMediaResult, BindListingCategoriesResult, CreateListingResult,
    CreateListingSubmissionResult, ListListingMediaResult, ListListingReleasesResult,
    ListingOperationResult, PublicRetrieveListingResult, RemoveListingMediaResult,
    RetrieveListingResult, UpdateListingResult, UpdateRegionalAvailabilityResult,
    UpsertListingLocalizationResult,
};
pub use error::{AppstoreServiceError, AppstoreServiceResult};
pub use ports::repository::ListingRepositoryPort;
pub use service::listing_service::{ListingOperations, ListingService};

pub const CAPABILITY: &str = "listing";

pub fn capability_name() -> &'static str {
    CAPABILITY
}
