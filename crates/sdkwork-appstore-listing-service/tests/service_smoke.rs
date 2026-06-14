use sdkwork_appstore_listing_service::context::AppstoreRequestContext;
use sdkwork_appstore_listing_service::domain::models::{
    ListingStatus, ListingType, MediaRole, PricingModel, ReviewStatus, StorefrontVisibility,
    SubmissionStatus, SubmissionType,
};
use sdkwork_appstore_listing_service::error::AppstoreServiceError;

fn test_context() -> AppstoreRequestContext {
    AppstoreRequestContext {
        tenant_id: "test-tenant".to_string(),
        organization_id: "test-org".to_string(),
        user_id: "test-user".to_string(),
        request_id: "test-request".to_string(),
        trace_id: None,
        permission_scopes: vec![],
    }
}

#[test]
fn test_context_creation() {
    let ctx = test_context();
    assert_eq!(ctx.tenant_id, "test-tenant");
    assert_eq!(ctx.organization_id, "test-org");
    assert_eq!(ctx.user_id, "test-user");
    assert_eq!(ctx.request_id, "test-request");
    assert!(ctx.trace_id.is_none());
    assert!(ctx.permission_scopes.is_empty());
}

#[test]
fn test_context_with_trace_id() {
    let mut ctx = test_context();
    ctx.trace_id = Some("trace-123".to_string());
    assert_eq!(ctx.trace_id.as_deref(), Some("trace-123"));
}

#[test]
fn test_context_with_permission_scopes() {
    let mut ctx = test_context();
    ctx.permission_scopes = vec!["read".to_string(), "write".to_string()];
    assert_eq!(ctx.permission_scopes.len(), 2);
}

#[test]
fn test_error_not_found_display() {
    let err = AppstoreServiceError::NotFound("listing".to_string());
    assert!(format!("{}", err).contains("Not found"));
    assert!(format!("{}", err).contains("listing"));
}

#[test]
fn test_error_already_exists_display() {
    let err = AppstoreServiceError::AlreadyExists("listing".to_string());
    assert!(format!("{}", err).contains("Already exists"));
}

#[test]
fn test_error_invalid_state_display() {
    let err = AppstoreServiceError::InvalidState("delisted".to_string());
    assert!(format!("{}", err).contains("Invalid state"));
}

#[test]
fn test_error_validation_failed_display() {
    let err = AppstoreServiceError::ValidationFailed("display_name".to_string());
    assert!(format!("{}", err).contains("Validation failed"));
}

#[test]
fn test_error_permission_denied_display() {
    let err = AppstoreServiceError::PermissionDenied("admin".to_string());
    assert!(format!("{}", err).contains("Permission denied"));
}

#[test]
fn test_error_conflict_display() {
    let err = AppstoreServiceError::Conflict("version".to_string());
    assert!(format!("{}", err).contains("Conflict"));
}

#[test]
fn test_error_internal_display() {
    let err = AppstoreServiceError::Internal("db".to_string());
    assert!(format!("{}", err).contains("Internal error"));
}

#[test]
fn test_error_is_clone() {
    let err = AppstoreServiceError::NotFound("test".to_string());
    let err2 = err.clone();
    assert_eq!(err, err2);
}

#[test]
fn test_error_is_debug() {
    let err = AppstoreServiceError::NotFound("test".to_string());
    let dbg = format!("{:?}", err);
    assert!(dbg.contains("NotFound"));
}

#[test]
fn test_listing_status_from_str() {
    assert_eq!(ListingStatus::from_str("draft"), Some(ListingStatus::Draft));
    assert_eq!(
        ListingStatus::from_str("active"),
        Some(ListingStatus::Active)
    );
    assert_eq!(
        ListingStatus::from_str("delisted"),
        Some(ListingStatus::Delisted)
    );
    assert_eq!(
        ListingStatus::from_str("suspended"),
        Some(ListingStatus::Suspended)
    );
    assert_eq!(
        ListingStatus::from_str("deleted"),
        Some(ListingStatus::Deleted)
    );
    assert_eq!(ListingStatus::from_str("invalid"), None);
}

#[test]
fn test_listing_status_as_str() {
    assert_eq!(ListingStatus::Draft.as_str(), "draft");
    assert_eq!(ListingStatus::Active.as_str(), "active");
    assert_eq!(ListingStatus::Delisted.as_str(), "delisted");
    assert_eq!(ListingStatus::Suspended.as_str(), "suspended");
    assert_eq!(ListingStatus::Deleted.as_str(), "deleted");
}

#[test]
fn test_storefront_visibility_from_str() {
    assert_eq!(
        StorefrontVisibility::from_str("visible"),
        Some(StorefrontVisibility::Visible)
    );
    assert_eq!(
        StorefrontVisibility::from_str("hidden"),
        Some(StorefrontVisibility::Hidden)
    );
    assert_eq!(
        StorefrontVisibility::from_str("featured"),
        Some(StorefrontVisibility::Featured)
    );
    assert_eq!(StorefrontVisibility::from_str("invalid"), None);
}

#[test]
fn test_review_status_from_str() {
    assert_eq!(
        ReviewStatus::from_str("not_submitted"),
        Some(ReviewStatus::NotSubmitted)
    );
    assert_eq!(
        ReviewStatus::from_str("pending"),
        Some(ReviewStatus::Pending)
    );
    assert_eq!(
        ReviewStatus::from_str("in_review"),
        Some(ReviewStatus::InReview)
    );
    assert_eq!(
        ReviewStatus::from_str("approved"),
        Some(ReviewStatus::Approved)
    );
    assert_eq!(
        ReviewStatus::from_str("rejected"),
        Some(ReviewStatus::Rejected)
    );
    assert_eq!(ReviewStatus::from_str("invalid"), None);
}

#[test]
fn test_pricing_model_from_str() {
    assert_eq!(PricingModel::from_str("free"), Some(PricingModel::Free));
    assert_eq!(PricingModel::from_str("paid"), Some(PricingModel::Paid));
    assert_eq!(
        PricingModel::from_str("freemium"),
        Some(PricingModel::Freemium)
    );
    assert_eq!(
        PricingModel::from_str("subscription"),
        Some(PricingModel::Subscription)
    );
    assert_eq!(PricingModel::from_str("FREE"), Some(PricingModel::Free));
    assert_eq!(PricingModel::from_str("invalid"), None);
}

#[test]
fn test_listing_type_from_str() {
    assert_eq!(ListingType::from_str("app"), Some(ListingType::App));
    assert_eq!(ListingType::from_str("game"), Some(ListingType::Game));
    assert_eq!(ListingType::from_str("plugin"), Some(ListingType::Plugin));
    assert_eq!(
        ListingType::from_str("extension"),
        Some(ListingType::Extension)
    );
    assert_eq!(ListingType::from_str("invalid"), None);
}

#[test]
fn test_submission_type_from_str() {
    assert_eq!(
        SubmissionType::from_str("initial"),
        Some(SubmissionType::Initial)
    );
    assert_eq!(
        SubmissionType::from_str("metadata"),
        Some(SubmissionType::Metadata)
    );
    assert_eq!(
        SubmissionType::from_str("release"),
        Some(SubmissionType::Release)
    );
    assert_eq!(
        SubmissionType::from_str("INITIAL"),
        Some(SubmissionType::Initial)
    );
    assert_eq!(SubmissionType::from_str("invalid"), None);
}

#[test]
fn test_submission_status_from_str() {
    assert_eq!(
        SubmissionStatus::from_str("submitted"),
        Some(SubmissionStatus::Submitted)
    );
    assert_eq!(
        SubmissionStatus::from_str("under_review"),
        Some(SubmissionStatus::UnderReview)
    );
    assert_eq!(
        SubmissionStatus::from_str("approved"),
        Some(SubmissionStatus::Approved)
    );
    assert_eq!(
        SubmissionStatus::from_str("rejected"),
        Some(SubmissionStatus::Rejected)
    );
    assert_eq!(
        SubmissionStatus::from_str("withdrawn"),
        Some(SubmissionStatus::Withdrawn)
    );
    assert_eq!(SubmissionStatus::from_str("invalid"), None);
}

#[test]
fn test_media_role_from_str() {
    assert_eq!(MediaRole::from_str("icon"), Some(MediaRole::Icon));
    assert_eq!(
        MediaRole::from_str("screenshot"),
        Some(MediaRole::Screenshot)
    );
    assert_eq!(
        MediaRole::from_str("preview_video"),
        Some(MediaRole::PreviewVideo)
    );
    assert_eq!(
        MediaRole::from_str("feature_graphic"),
        Some(MediaRole::FeatureGraphic)
    );
    assert_eq!(MediaRole::from_str("ICON"), Some(MediaRole::Icon));
    assert_eq!(MediaRole::from_str("invalid"), None);
}

#[test]
fn test_capability_name() {
    assert_eq!(
        sdkwork_appstore_listing_service::capability_name(),
        "listing"
    );
}
