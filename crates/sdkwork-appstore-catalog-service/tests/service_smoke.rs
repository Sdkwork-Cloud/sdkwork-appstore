use sdkwork_appstore_catalog_service::context::AppstoreRequestContext;
use sdkwork_appstore_catalog_service::domain::models::{
    AudienceScope, CategoryStatus, CollectionStatus, CollectionType, FeaturedSlotStatus,
    PlatformScope,
};
use sdkwork_appstore_catalog_service::error::AppstoreServiceError;

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
    let err = AppstoreServiceError::NotFound("category".to_string());
    assert!(format!("{}", err).contains("Not found"));
    assert!(format!("{}", err).contains("category"));
}

#[test]
fn test_error_already_exists_display() {
    let err = AppstoreServiceError::AlreadyExists("category".to_string());
    assert!(format!("{}", err).contains("Already exists"));
}

#[test]
fn test_error_invalid_state_display() {
    let err = AppstoreServiceError::InvalidState("archived".to_string());
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
fn test_category_status_from_str() {
    assert_eq!(
        CategoryStatus::from_str("active"),
        Some(CategoryStatus::Active)
    );
    assert_eq!(
        CategoryStatus::from_str("inactive"),
        Some(CategoryStatus::Inactive)
    );
    assert_eq!(
        CategoryStatus::from_str("deleted"),
        Some(CategoryStatus::Deleted)
    );
    assert_eq!(CategoryStatus::from_str("invalid"), None);
}

#[test]
fn test_category_status_as_str() {
    assert_eq!(CategoryStatus::Active.as_str(), "active");
    assert_eq!(CategoryStatus::Inactive.as_str(), "inactive");
    assert_eq!(CategoryStatus::Deleted.as_str(), "deleted");
}

#[test]
fn test_collection_type_from_str() {
    assert_eq!(
        CollectionType::from_str("editorial"),
        Some(CollectionType::Editorial)
    );
    assert_eq!(
        CollectionType::from_str("algorithmic"),
        Some(CollectionType::Algorithmic)
    );
    assert_eq!(
        CollectionType::from_str("thematic"),
        Some(CollectionType::Thematic)
    );
    assert_eq!(CollectionType::from_str("invalid"), None);
}

#[test]
fn test_collection_status_from_str() {
    assert_eq!(
        CollectionStatus::from_str("draft"),
        Some(CollectionStatus::Draft)
    );
    assert_eq!(
        CollectionStatus::from_str("published"),
        Some(CollectionStatus::Published)
    );
    assert_eq!(
        CollectionStatus::from_str("archived"),
        Some(CollectionStatus::Archived)
    );
    assert_eq!(CollectionStatus::from_str("invalid"), None);
}

#[test]
fn test_featured_slot_status_from_str() {
    assert_eq!(
        FeaturedSlotStatus::from_str("active"),
        Some(FeaturedSlotStatus::Active)
    );
    assert_eq!(
        FeaturedSlotStatus::from_str("paused"),
        Some(FeaturedSlotStatus::Paused)
    );
    assert_eq!(
        FeaturedSlotStatus::from_str("expired"),
        Some(FeaturedSlotStatus::Expired)
    );
    assert_eq!(FeaturedSlotStatus::from_str("invalid"), None);
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
    assert_eq!(AudienceScope::from_str("beta"), Some(AudienceScope::Beta));
    assert_eq!(AudienceScope::from_str("invalid"), None);
}

#[test]
fn test_platform_scope_from_str() {
    assert_eq!(PlatformScope::from_str("ALL"), Some(PlatformScope::All));
    assert_eq!(
        PlatformScope::from_str("ANDROID"),
        Some(PlatformScope::Android)
    );
    assert_eq!(PlatformScope::from_str("IOS"), Some(PlatformScope::Ios));
    assert_eq!(PlatformScope::from_str("WEB"), Some(PlatformScope::Web));
    assert_eq!(
        PlatformScope::from_str("DESKTOP"),
        Some(PlatformScope::Desktop)
    );
    assert_eq!(PlatformScope::from_str("invalid"), None);
}

#[test]
fn test_platform_scope_as_str() {
    assert_eq!(PlatformScope::All.as_str(), "ALL");
    assert_eq!(PlatformScope::Android.as_str(), "ANDROID");
    assert_eq!(PlatformScope::Ios.as_str(), "IOS");
    assert_eq!(PlatformScope::Web.as_str(), "WEB");
    assert_eq!(PlatformScope::Desktop.as_str(), "DESKTOP");
}

#[test]
fn test_capability_name() {
    assert_eq!(
        sdkwork_appstore_catalog_service::capability_name(),
        "catalog"
    );
}
