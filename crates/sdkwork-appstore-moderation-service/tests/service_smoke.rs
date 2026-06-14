use sdkwork_appstore_moderation_service::context::AppstoreRequestContext;
use sdkwork_appstore_moderation_service::domain::models::{
    DecisionStatus, DecisionType, Priority, QueueCode, ReasonCode, ReviewStatus,
};
use sdkwork_appstore_moderation_service::error::AppstoreServiceError;

fn test_context() -> AppstoreRequestContext {
    AppstoreRequestContext {
        tenant_id: "test-tenant".to_string(),
        organization_id: Some("test-org".to_string()),
        user_id: Some("test-user".to_string()),
        request_id: "test-request".to_string(),
        trace_id: None,
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
    assert!(ctx.trace_id.is_none());
    assert!(ctx.permission_scopes.is_empty());
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
fn test_context_with_trace_id() {
    let mut ctx = test_context();
    ctx.trace_id = Some("trace-123".to_string());
    assert_eq!(ctx.trace_id.as_deref(), Some("trace-123"));
}

#[test]
fn test_error_not_found_display() {
    let err = AppstoreServiceError::NotFound("review".to_string());
    assert!(format!("{}", err).contains("Not found"));
    assert!(format!("{}", err).contains("review"));
}

#[test]
fn test_error_already_exists_display() {
    let err = AppstoreServiceError::AlreadyExists("review".to_string());
    assert!(format!("{}", err).contains("Already exists"));
}

#[test]
fn test_error_invalid_state_display() {
    let err = AppstoreServiceError::InvalidState("cancelled".to_string());
    assert!(format!("{}", err).contains("Invalid state"));
}

#[test]
fn test_error_validation_failed_display() {
    let err = AppstoreServiceError::ValidationFailed("decision_type".to_string());
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
fn test_review_status_from_str() {
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
    assert_eq!(
        ReviewStatus::from_str("changes_requested"),
        Some(ReviewStatus::ChangesRequested)
    );
    assert_eq!(
        ReviewStatus::from_str("escalated"),
        Some(ReviewStatus::Escalated)
    );
    assert_eq!(
        ReviewStatus::from_str("cancelled"),
        Some(ReviewStatus::Cancelled)
    );
    assert_eq!(ReviewStatus::from_str("invalid"), None);
}

#[test]
fn test_review_status_as_str() {
    assert_eq!(ReviewStatus::Pending.as_str(), "pending");
    assert_eq!(ReviewStatus::InReview.as_str(), "in_review");
    assert_eq!(ReviewStatus::Approved.as_str(), "approved");
    assert_eq!(ReviewStatus::Rejected.as_str(), "rejected");
    assert_eq!(ReviewStatus::ChangesRequested.as_str(), "changes_requested");
    assert_eq!(ReviewStatus::Escalated.as_str(), "escalated");
    assert_eq!(ReviewStatus::Cancelled.as_str(), "cancelled");
}

#[test]
fn test_review_status_is_terminal() {
    assert!(!ReviewStatus::Pending.is_terminal());
    assert!(!ReviewStatus::InReview.is_terminal());
    assert!(ReviewStatus::Approved.is_terminal());
    assert!(ReviewStatus::Rejected.is_terminal());
    assert!(ReviewStatus::ChangesRequested.is_terminal());
    assert!(!ReviewStatus::Escalated.is_terminal());
    assert!(ReviewStatus::Cancelled.is_terminal());
}

#[test]
fn test_priority_from_str() {
    assert_eq!(Priority::from_str("low"), Some(Priority::Low));
    assert_eq!(Priority::from_str("normal"), Some(Priority::Normal));
    assert_eq!(Priority::from_str("high"), Some(Priority::High));
    assert_eq!(Priority::from_str("critical"), Some(Priority::Critical));
    assert_eq!(Priority::from_str("invalid"), None);
}

#[test]
fn test_priority_as_str() {
    assert_eq!(Priority::Low.as_str(), "low");
    assert_eq!(Priority::Normal.as_str(), "normal");
    assert_eq!(Priority::High.as_str(), "high");
    assert_eq!(Priority::Critical.as_str(), "critical");
}

#[test]
fn test_queue_code_from_str() {
    assert_eq!(
        QueueCode::from_str("content_review"),
        QueueCode::ContentReview
    );
    assert_eq!(
        QueueCode::from_str("policy_compliance"),
        QueueCode::PolicyCompliance
    );
    assert_eq!(
        QueueCode::from_str("security_scan"),
        QueueCode::SecurityScan
    );
    assert_eq!(
        QueueCode::from_str("brand_approval"),
        QueueCode::BrandApproval
    );
    assert_eq!(QueueCode::from_str("age_rating"), QueueCode::AgeRating);
    assert_eq!(
        QueueCode::from_str("custom_queue"),
        QueueCode::Custom("custom_queue".to_string())
    );
}

#[test]
fn test_queue_code_as_str() {
    assert_eq!(QueueCode::ContentReview.as_str(), "content_review");
    assert_eq!(QueueCode::PolicyCompliance.as_str(), "policy_compliance");
    assert_eq!(QueueCode::SecurityScan.as_str(), "security_scan");
    assert_eq!(QueueCode::BrandApproval.as_str(), "brand_approval");
    assert_eq!(QueueCode::AgeRating.as_str(), "age_rating");
    assert_eq!(QueueCode::Custom("x".to_string()).as_str(), "x");
}

#[test]
fn test_decision_type_from_str() {
    assert_eq!(
        DecisionType::from_str("APPROVE"),
        Some(DecisionType::Approve)
    );
    assert_eq!(DecisionType::from_str("REJECT"), Some(DecisionType::Reject));
    assert_eq!(
        DecisionType::from_str("REQUEST_CHANGES"),
        Some(DecisionType::RequestChanges)
    );
    assert_eq!(DecisionType::from_str("invalid"), None);
}

#[test]
fn test_decision_type_as_str() {
    assert_eq!(DecisionType::Approve.as_str(), "APPROVE");
    assert_eq!(DecisionType::Reject.as_str(), "REJECT");
    assert_eq!(DecisionType::RequestChanges.as_str(), "REQUEST_CHANGES");
}

#[test]
fn test_decision_status_from_str() {
    assert_eq!(
        DecisionStatus::from_str("draft"),
        Some(DecisionStatus::Draft)
    );
    assert_eq!(
        DecisionStatus::from_str("final"),
        Some(DecisionStatus::Final)
    );
    assert_eq!(
        DecisionStatus::from_str("overturned"),
        Some(DecisionStatus::Overturned)
    );
    assert_eq!(DecisionStatus::from_str("invalid"), None);
}

#[test]
fn test_reason_code_from_str() {
    assert_eq!(
        ReasonCode::from_str("policy_violation"),
        ReasonCode::PolicyViolation
    );
    assert_eq!(
        ReasonCode::from_str("inappropriate_content"),
        ReasonCode::InappropriateContent
    );
    assert_eq!(
        ReasonCode::from_str("security_risk"),
        ReasonCode::SecurityRisk
    );
    assert_eq!(
        ReasonCode::from_str("trademark_infringement"),
        ReasonCode::TrademarkInfringement
    );
    assert_eq!(
        ReasonCode::from_str("metadata_incomplete"),
        ReasonCode::MetadataIncomplete
    );
    assert_eq!(
        ReasonCode::from_str("age_rating_mismatch"),
        ReasonCode::AgeRatingMismatch
    );
    assert_eq!(
        ReasonCode::from_str("custom_reason"),
        ReasonCode::Custom("custom_reason".to_string())
    );
}

#[test]
fn test_reason_code_as_str() {
    assert_eq!(ReasonCode::PolicyViolation.as_str(), "policy_violation");
    assert_eq!(
        ReasonCode::InappropriateContent.as_str(),
        "inappropriate_content"
    );
    assert_eq!(ReasonCode::SecurityRisk.as_str(), "security_risk");
    assert_eq!(ReasonCode::Custom("x".to_string()).as_str(), "x");
}

#[test]
fn test_capability_name() {
    assert_eq!(
        sdkwork_appstore_moderation_service::capability_name(),
        "moderation"
    );
}
