use sdkwork_appstore_market_service::context::AppstoreRequestContext;
use sdkwork_appstore_market_service::domain::models::{ChannelStatus, ChannelType, MarketStatus};
use sdkwork_appstore_market_service::error::AppstoreServiceError;

fn test_context() -> AppstoreRequestContext {
    AppstoreRequestContext {
        tenant_id: "test-tenant".to_string(),
        organization_id: Some("test-org".to_string()),
        user_id: Some("test-user".to_string()),
        request_id: "test-request".to_string(),
    }
}

#[test]
fn test_context_creation() {
    let ctx = test_context();
    assert_eq!(ctx.tenant_id, "test-tenant");
    assert_eq!(ctx.organization_id.as_deref(), Some("test-org"));
    assert_eq!(ctx.user_id.as_deref(), Some("test-user"));
    assert_eq!(ctx.request_id, "test-request");
}

#[test]
fn test_context_tenant_scoped() {
    let ctx = AppstoreRequestContext::tenant_scoped("tenant-1", "req-1");
    assert_eq!(ctx.tenant_id, "tenant-1");
    assert_eq!(ctx.request_id, "req-1");
    assert!(ctx.organization_id.is_none());
    assert!(ctx.user_id.is_none());
}

#[test]
fn test_context_minimal() {
    let ctx = AppstoreRequestContext {
        tenant_id: "t".to_string(),
        organization_id: None,
        user_id: None,
        request_id: "r".to_string(),
    };
    assert!(ctx.organization_id.is_none());
    assert!(ctx.user_id.is_none());
}

#[test]
fn test_error_not_found_display() {
    let err = AppstoreServiceError::NotFound("channel".to_string());
    assert!(format!("{}", err).contains("Not found"));
    assert!(format!("{}", err).contains("channel"));
}

#[test]
fn test_error_already_exists_display() {
    let err = AppstoreServiceError::AlreadyExists("channel".to_string());
    assert!(format!("{}", err).contains("Already exists"));
}

#[test]
fn test_error_invalid_state_display() {
    let err = AppstoreServiceError::InvalidState("inactive".to_string());
    assert!(format!("{}", err).contains("Invalid state"));
}

#[test]
fn test_error_validation_failed_display() {
    let err = AppstoreServiceError::ValidationFailed("channel_code".to_string());
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
fn test_channel_type_from_str() {
    assert_eq!(
        ChannelType::from_str("APPLE_APP_STORE"),
        Some(ChannelType::AppleAppStore)
    );
    assert_eq!(
        ChannelType::from_str("GOOGLE_PLAY"),
        Some(ChannelType::GooglePlay)
    );
    assert_eq!(
        ChannelType::from_str("ENTERPRISE"),
        Some(ChannelType::Enterprise)
    );
    assert_eq!(
        ChannelType::from_str("EXTERNAL"),
        Some(ChannelType::External)
    );
    assert_eq!(ChannelType::from_str("invalid"), None);
}

#[test]
fn test_channel_type_as_str() {
    assert_eq!(ChannelType::AppleAppStore.as_str(), "APPLE_APP_STORE");
    assert_eq!(ChannelType::GooglePlay.as_str(), "GOOGLE_PLAY");
    assert_eq!(ChannelType::Enterprise.as_str(), "ENTERPRISE");
    assert_eq!(ChannelType::External.as_str(), "EXTERNAL");
}

#[test]
fn test_channel_status_from_str() {
    assert_eq!(
        ChannelStatus::from_str("active"),
        Some(ChannelStatus::Active)
    );
    assert_eq!(
        ChannelStatus::from_str("inactive"),
        Some(ChannelStatus::Inactive)
    );
    assert_eq!(
        ChannelStatus::from_str("suspended"),
        Some(ChannelStatus::Suspended)
    );
    assert_eq!(ChannelStatus::from_str("invalid"), None);
}

#[test]
fn test_channel_status_as_str() {
    assert_eq!(ChannelStatus::Active.as_str(), "active");
    assert_eq!(ChannelStatus::Inactive.as_str(), "inactive");
    assert_eq!(ChannelStatus::Suspended.as_str(), "suspended");
}

#[test]
fn test_market_status_from_str() {
    assert_eq!(MarketStatus::from_str("draft"), Some(MarketStatus::Draft));
    assert_eq!(
        MarketStatus::from_str("submitted"),
        Some(MarketStatus::Submitted)
    );
    assert_eq!(
        MarketStatus::from_str("in_review"),
        Some(MarketStatus::InReview)
    );
    assert_eq!(
        MarketStatus::from_str("approved"),
        Some(MarketStatus::Approved)
    );
    assert_eq!(
        MarketStatus::from_str("rejected"),
        Some(MarketStatus::Rejected)
    );
    assert_eq!(
        MarketStatus::from_str("published"),
        Some(MarketStatus::Published)
    );
    assert_eq!(
        MarketStatus::from_str("retired"),
        Some(MarketStatus::Retired)
    );
    assert_eq!(MarketStatus::from_str("invalid"), None);
}

#[test]
fn test_market_status_as_str() {
    assert_eq!(MarketStatus::Draft.as_str(), "draft");
    assert_eq!(MarketStatus::Submitted.as_str(), "submitted");
    assert_eq!(MarketStatus::InReview.as_str(), "in_review");
    assert_eq!(MarketStatus::Approved.as_str(), "approved");
    assert_eq!(MarketStatus::Rejected.as_str(), "rejected");
    assert_eq!(MarketStatus::Published.as_str(), "published");
    assert_eq!(MarketStatus::Retired.as_str(), "retired");
}

#[test]
fn test_capability_name() {
    assert_eq!(sdkwork_appstore_market_service::capability_name(), "market");
}
