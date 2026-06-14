use sdkwork_appstore_publisher_service::context::AppstoreRequestContext;
use sdkwork_appstore_publisher_service::domain::models::{
    MemberRole, MemberStatus, PublisherStatus, PublisherType, VerificationStatus, VerificationType,
};
use sdkwork_appstore_publisher_service::error::AppstoreServiceError;

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
    let err = AppstoreServiceError::NotFound("publisher".to_string());
    assert!(format!("{}", err).contains("Not found"));
    assert!(format!("{}", err).contains("publisher"));
}

#[test]
fn test_error_already_exists_display() {
    let err = AppstoreServiceError::AlreadyExists("publisher".to_string());
    assert!(format!("{}", err).contains("Already exists"));
}

#[test]
fn test_error_invalid_state_display() {
    let err = AppstoreServiceError::InvalidState("suspended".to_string());
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
fn test_publisher_status_from_str() {
    assert_eq!(
        PublisherStatus::from_str("draft"),
        Some(PublisherStatus::Draft)
    );
    assert_eq!(
        PublisherStatus::from_str("active"),
        Some(PublisherStatus::Active)
    );
    assert_eq!(
        PublisherStatus::from_str("suspended"),
        Some(PublisherStatus::Suspended)
    );
    assert_eq!(
        PublisherStatus::from_str("deleted"),
        Some(PublisherStatus::Deleted)
    );
    assert_eq!(PublisherStatus::from_str("invalid"), None);
}

#[test]
fn test_publisher_status_as_str() {
    assert_eq!(PublisherStatus::Draft.as_str(), "draft");
    assert_eq!(PublisherStatus::Active.as_str(), "active");
    assert_eq!(PublisherStatus::Suspended.as_str(), "suspended");
    assert_eq!(PublisherStatus::Deleted.as_str(), "deleted");
}

#[test]
fn test_verification_status_from_str() {
    assert_eq!(
        VerificationStatus::from_str("unverified"),
        Some(VerificationStatus::Unverified)
    );
    assert_eq!(
        VerificationStatus::from_str("pending"),
        Some(VerificationStatus::Pending)
    );
    assert_eq!(
        VerificationStatus::from_str("verified"),
        Some(VerificationStatus::Verified)
    );
    assert_eq!(
        VerificationStatus::from_str("rejected"),
        Some(VerificationStatus::Rejected)
    );
    assert_eq!(
        VerificationStatus::from_str("expired"),
        Some(VerificationStatus::Expired)
    );
    assert_eq!(VerificationStatus::from_str("invalid"), None);
}

#[test]
fn test_publisher_type_from_str() {
    assert_eq!(
        PublisherType::from_str("individual"),
        Some(PublisherType::Individual)
    );
    assert_eq!(
        PublisherType::from_str("organization"),
        Some(PublisherType::Organization)
    );
    assert_eq!(PublisherType::from_str("invalid"), None);
}

#[test]
fn test_member_role_from_str() {
    assert_eq!(MemberRole::from_str("owner"), Some(MemberRole::Owner));
    assert_eq!(MemberRole::from_str("admin"), Some(MemberRole::Admin));
    assert_eq!(MemberRole::from_str("member"), Some(MemberRole::Member));
    assert_eq!(MemberRole::from_str("invalid"), None);
}

#[test]
fn test_member_status_from_str() {
    assert_eq!(
        MemberStatus::from_str("invited"),
        Some(MemberStatus::Invited)
    );
    assert_eq!(MemberStatus::from_str("active"), Some(MemberStatus::Active));
    assert_eq!(
        MemberStatus::from_str("suspended"),
        Some(MemberStatus::Suspended)
    );
    assert_eq!(
        MemberStatus::from_str("removed"),
        Some(MemberStatus::Removed)
    );
    assert_eq!(MemberStatus::from_str("invalid"), None);
}

#[test]
fn test_verification_type_from_str() {
    assert_eq!(
        VerificationType::from_str("identity"),
        Some(VerificationType::Identity)
    );
    assert_eq!(
        VerificationType::from_str("business"),
        Some(VerificationType::Business)
    );
    assert_eq!(
        VerificationType::from_str("developer"),
        Some(VerificationType::Developer)
    );
    assert_eq!(VerificationType::from_str("invalid"), None);
}

#[test]
fn test_capability_name() {
    assert_eq!(
        sdkwork_appstore_publisher_service::capability_name(),
        "publisher"
    );
}
