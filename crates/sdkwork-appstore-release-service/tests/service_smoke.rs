use sdkwork_appstore_release_service::context::AppstoreRequestContext;
use sdkwork_appstore_release_service::domain::models::{
    ArtifactStatus, AudienceScope, ChannelStatus, ChannelType, GrantReason, GrantStatus,
    ReleaseStatus, RolloutStatus, RolloutStrategy,
};
use sdkwork_appstore_release_service::error::AppstoreServiceError;

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
    let ctx = AppstoreRequestContext::tenant_scoped("100001", "req-1");
    assert_eq!(ctx.tenant_id, "100001");
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
    let err = AppstoreServiceError::NotFound("release".to_string());
    assert!(format!("{}", err).contains("Not found"));
    assert!(format!("{}", err).contains("release"));
}

#[test]
fn test_error_already_exists_display() {
    let err = AppstoreServiceError::AlreadyExists("release".to_string());
    assert!(format!("{}", err).contains("Already exists"));
}

#[test]
fn test_error_invalid_state_display() {
    let err = AppstoreServiceError::InvalidState("published".to_string());
    assert!(format!("{}", err).contains("Invalid state"));
}

#[test]
fn test_error_validation_failed_display() {
    let err = AppstoreServiceError::ValidationFailed("version_code".to_string());
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
    assert_eq!(ChannelType::from_str("stable"), Some(ChannelType::Stable));
    assert_eq!(ChannelType::from_str("beta"), Some(ChannelType::Beta));
    assert_eq!(ChannelType::from_str("alpha"), Some(ChannelType::Alpha));
    assert_eq!(ChannelType::from_str("nightly"), Some(ChannelType::Nightly));
    assert_eq!(ChannelType::from_str("lts"), Some(ChannelType::Lts));
    assert_eq!(ChannelType::from_str("invalid"), None);
}

#[test]
fn test_channel_type_as_str() {
    assert_eq!(ChannelType::Stable.as_str(), "stable");
    assert_eq!(ChannelType::Beta.as_str(), "beta");
    assert_eq!(ChannelType::Alpha.as_str(), "alpha");
    assert_eq!(ChannelType::Nightly.as_str(), "nightly");
    assert_eq!(ChannelType::Lts.as_str(), "lts");
}

#[test]
fn test_channel_status_from_str() {
    assert_eq!(
        ChannelStatus::from_str("active"),
        Some(ChannelStatus::Active)
    );
    assert_eq!(
        ChannelStatus::from_str("deprecated"),
        Some(ChannelStatus::Deprecated)
    );
    assert_eq!(
        ChannelStatus::from_str("disabled"),
        Some(ChannelStatus::Disabled)
    );
    assert_eq!(ChannelStatus::from_str("invalid"), None);
}

#[test]
fn test_audience_scope_from_str() {
    assert_eq!(
        AudienceScope::from_str("public"),
        Some(AudienceScope::Public)
    );
    assert_eq!(
        AudienceScope::from_str("internal"),
        Some(AudienceScope::Internal)
    );
    assert_eq!(
        AudienceScope::from_str("private"),
        Some(AudienceScope::Private)
    );
    assert_eq!(AudienceScope::from_str("invalid"), None);
}

#[test]
fn test_release_status_from_str() {
    assert_eq!(ReleaseStatus::from_str("draft"), Some(ReleaseStatus::Draft));
    assert_eq!(
        ReleaseStatus::from_str("submitted"),
        Some(ReleaseStatus::Submitted)
    );
    assert_eq!(
        ReleaseStatus::from_str("approved"),
        Some(ReleaseStatus::Approved)
    );
    assert_eq!(
        ReleaseStatus::from_str("published"),
        Some(ReleaseStatus::Published)
    );
    assert_eq!(
        ReleaseStatus::from_str("retired"),
        Some(ReleaseStatus::Retired)
    );
    assert_eq!(ReleaseStatus::from_str("invalid"), None);
}

#[test]
fn test_rollout_strategy_from_str() {
    assert_eq!(
        RolloutStrategy::from_str("full"),
        Some(RolloutStrategy::Full)
    );
    assert_eq!(
        RolloutStrategy::from_str("staged"),
        Some(RolloutStrategy::Staged)
    );
    assert_eq!(
        RolloutStrategy::from_str("pause"),
        Some(RolloutStrategy::Pause)
    );
    assert_eq!(RolloutStrategy::from_str("invalid"), None);
}

#[test]
fn test_rollout_status_from_str() {
    assert_eq!(
        RolloutStatus::from_str("pending"),
        Some(RolloutStatus::Pending)
    );
    assert_eq!(
        RolloutStatus::from_str("in_progress"),
        Some(RolloutStatus::InProgress)
    );
    assert_eq!(
        RolloutStatus::from_str("paused"),
        Some(RolloutStatus::Paused)
    );
    assert_eq!(
        RolloutStatus::from_str("completed"),
        Some(RolloutStatus::Completed)
    );
    assert_eq!(
        RolloutStatus::from_str("cancelled"),
        Some(RolloutStatus::Cancelled)
    );
    assert_eq!(RolloutStatus::from_str("invalid"), None);
}

#[test]
fn test_artifact_status_from_str() {
    assert_eq!(
        ArtifactStatus::from_str("pending"),
        Some(ArtifactStatus::Pending)
    );
    assert_eq!(
        ArtifactStatus::from_str("verified"),
        Some(ArtifactStatus::Verified)
    );
    assert_eq!(
        ArtifactStatus::from_str("rejected"),
        Some(ArtifactStatus::Rejected)
    );
    assert_eq!(
        ArtifactStatus::from_str("retired"),
        Some(ArtifactStatus::Retired)
    );
    assert_eq!(ArtifactStatus::from_str("invalid"), None);
}

#[test]
fn test_grant_status_from_str() {
    assert_eq!(GrantStatus::from_str("active"), Some(GrantStatus::Active));
    assert_eq!(
        GrantStatus::from_str("consumed"),
        Some(GrantStatus::Consumed)
    );
    assert_eq!(GrantStatus::from_str("expired"), Some(GrantStatus::Expired));
    assert_eq!(GrantStatus::from_str("revoked"), Some(GrantStatus::Revoked));
    assert_eq!(GrantStatus::from_str("invalid"), None);
}

#[test]
fn test_grant_reason_from_str() {
    assert_eq!(
        GrantReason::from_str("purchase"),
        Some(GrantReason::Purchase)
    );
    assert_eq!(
        GrantReason::from_str("entitlement"),
        Some(GrantReason::Entitlement)
    );
    assert_eq!(
        GrantReason::from_str("promotion"),
        Some(GrantReason::Promotion)
    );
    assert_eq!(GrantReason::from_str("review"), Some(GrantReason::Review));
    assert_eq!(GrantReason::from_str("admin"), Some(GrantReason::Admin));
    assert_eq!(GrantReason::from_str("invalid"), None);
}

#[test]
fn test_capability_name() {
    assert_eq!(
        sdkwork_appstore_release_service::capability_name(),
        "release"
    );
}
