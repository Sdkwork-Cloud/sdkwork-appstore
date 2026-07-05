use sdkwork_appstore_compliance_service::context::AppstoreRequestContext;
use sdkwork_appstore_compliance_service::domain::models::{ComplianceStatus, DisclosureStatus};
use sdkwork_appstore_compliance_service::error::AppstoreServiceError;

fn test_context() -> AppstoreRequestContext {
    AppstoreRequestContext {
        tenant_id: "test-tenant".to_string(),
        organization_id: Some("test-org".to_string()),
        user_id: Some("test-user".to_string()),
        request_id: "test-request".to_string(),
        permission_scopes: vec![],
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
        permission_scopes: vec![],
    };
    assert!(ctx.organization_id.is_none());
    assert!(ctx.user_id.is_none());
}

#[test]
fn test_error_not_found_display() {
    let err = AppstoreServiceError::NotFound("compliance_profile".to_string());
    assert!(format!("{}", err).contains("Not found"));
    assert!(format!("{}", err).contains("compliance_profile"));
}

#[test]
fn test_error_already_exists_display() {
    let err = AppstoreServiceError::AlreadyExists("profile".to_string());
    assert!(format!("{}", err).contains("Already exists"));
}

#[test]
fn test_error_invalid_state_display() {
    let err = AppstoreServiceError::InvalidState("approved".to_string());
    assert!(format!("{}", err).contains("Invalid state"));
}

#[test]
fn test_error_validation_failed_display() {
    let err = AppstoreServiceError::ValidationFailed("privacy_nutrition".to_string());
    assert!(format!("{}", err).contains("Validation failed"));
}

#[test]
fn test_error_permission_denied_display() {
    let err = AppstoreServiceError::PermissionDenied("reviewer".to_string());
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
fn test_compliance_status_from_str() {
    assert_eq!(
        ComplianceStatus::from_str("draft"),
        Some(ComplianceStatus::Draft)
    );
    assert_eq!(
        ComplianceStatus::from_str("submitted"),
        Some(ComplianceStatus::Submitted)
    );
    assert_eq!(
        ComplianceStatus::from_str("approved"),
        Some(ComplianceStatus::Approved)
    );
    assert_eq!(
        ComplianceStatus::from_str("rejected"),
        Some(ComplianceStatus::Rejected)
    );
    assert_eq!(
        ComplianceStatus::from_str("revision_required"),
        Some(ComplianceStatus::RevisionRequired)
    );
    assert_eq!(ComplianceStatus::from_str("invalid"), None);
}

#[test]
fn test_compliance_status_as_str() {
    assert_eq!(ComplianceStatus::Draft.as_str(), "draft");
    assert_eq!(ComplianceStatus::Submitted.as_str(), "submitted");
    assert_eq!(ComplianceStatus::Approved.as_str(), "approved");
    assert_eq!(ComplianceStatus::Rejected.as_str(), "rejected");
    assert_eq!(
        ComplianceStatus::RevisionRequired.as_str(),
        "revision_required"
    );
}

#[test]
fn test_disclosure_status_from_str() {
    assert_eq!(
        DisclosureStatus::from_str("draft"),
        Some(DisclosureStatus::Draft)
    );
    assert_eq!(
        DisclosureStatus::from_str("published"),
        Some(DisclosureStatus::Published)
    );
    assert_eq!(
        DisclosureStatus::from_str("superseded"),
        Some(DisclosureStatus::Superseded)
    );
    assert_eq!(DisclosureStatus::from_str("invalid"), None);
}

#[test]
fn test_disclosure_status_as_str() {
    assert_eq!(DisclosureStatus::Draft.as_str(), "draft");
    assert_eq!(DisclosureStatus::Published.as_str(), "published");
    assert_eq!(DisclosureStatus::Superseded.as_str(), "superseded");
}

#[test]
fn test_capability_name() {
    assert_eq!(
        sdkwork_appstore_compliance_service::capability_name(),
        "compliance"
    );
}
