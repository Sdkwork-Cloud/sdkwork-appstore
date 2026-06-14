use sdkwork_appstore_library_service::context::AppstoreRequestContext;
use sdkwork_appstore_library_service::domain::models::{
    DownloadGrantReason, DownloadGrantStatus, InstallEventStatus, InstallEventType, InstallSource,
    LibraryStatus, WishlistStatus,
};
use sdkwork_appstore_library_service::error::AppstoreServiceError;

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
    let err = AppstoreServiceError::NotFound("library_item".to_string());
    assert!(format!("{}", err).contains("Not found"));
    assert!(format!("{}", err).contains("library_item"));
}

#[test]
fn test_error_already_exists_display() {
    let err = AppstoreServiceError::AlreadyExists("library_item".to_string());
    assert!(format!("{}", err).contains("Already exists"));
}

#[test]
fn test_error_invalid_state_display() {
    let err = AppstoreServiceError::InvalidState("uninstalled".to_string());
    assert!(format!("{}", err).contains("Invalid state"));
}

#[test]
fn test_error_validation_failed_display() {
    let err = AppstoreServiceError::ValidationFailed("listing_id".to_string());
    assert!(format!("{}", err).contains("Validation failed"));
}

#[test]
fn test_error_permission_denied_display() {
    let err = AppstoreServiceError::PermissionDenied("user".to_string());
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
fn test_library_status_from_str() {
    assert_eq!(
        LibraryStatus::from_str("installed"),
        Some(LibraryStatus::Installed)
    );
    assert_eq!(
        LibraryStatus::from_str("uninstalled"),
        Some(LibraryStatus::Uninstalled)
    );
    assert_eq!(
        LibraryStatus::from_str("update_available"),
        Some(LibraryStatus::UpdateAvailable)
    );
    assert_eq!(LibraryStatus::from_str("invalid"), None);
}

#[test]
fn test_library_status_as_str() {
    assert_eq!(LibraryStatus::Installed.as_str(), "installed");
    assert_eq!(LibraryStatus::Uninstalled.as_str(), "uninstalled");
    assert_eq!(LibraryStatus::UpdateAvailable.as_str(), "update_available");
}

#[test]
fn test_wishlist_status_from_str() {
    assert_eq!(
        WishlistStatus::from_str("active"),
        Some(WishlistStatus::Active)
    );
    assert_eq!(
        WishlistStatus::from_str("removed"),
        Some(WishlistStatus::Removed)
    );
    assert_eq!(WishlistStatus::from_str("invalid"), None);
}

#[test]
fn test_install_event_type_from_str() {
    assert_eq!(
        InstallEventType::from_str("install"),
        Some(InstallEventType::Install)
    );
    assert_eq!(
        InstallEventType::from_str("uninstall"),
        Some(InstallEventType::Uninstall)
    );
    assert_eq!(
        InstallEventType::from_str("update"),
        Some(InstallEventType::Update)
    );
    assert_eq!(
        InstallEventType::from_str("reinstall"),
        Some(InstallEventType::Reinstall)
    );
    assert_eq!(InstallEventType::from_str("invalid"), None);
}

#[test]
fn test_install_source_from_str() {
    assert_eq!(InstallSource::from_str("store"), Some(InstallSource::Store));
    assert_eq!(
        InstallSource::from_str("direct_link"),
        Some(InstallSource::DirectLink)
    );
    assert_eq!(
        InstallSource::from_str("update"),
        Some(InstallSource::Update)
    );
    assert_eq!(
        InstallSource::from_str("silent"),
        Some(InstallSource::Silent)
    );
    assert_eq!(InstallSource::from_str("invalid"), None);
}

#[test]
fn test_install_event_status_from_str() {
    assert_eq!(
        InstallEventStatus::from_str("recorded"),
        Some(InstallEventStatus::Recorded)
    );
    assert_eq!(
        InstallEventStatus::from_str("processed"),
        Some(InstallEventStatus::Processed)
    );
    assert_eq!(
        InstallEventStatus::from_str("failed"),
        Some(InstallEventStatus::Failed)
    );
    assert_eq!(InstallEventStatus::from_str("invalid"), None);
}

#[test]
fn test_download_grant_status_from_str() {
    assert_eq!(
        DownloadGrantStatus::from_str("active"),
        Some(DownloadGrantStatus::Active)
    );
    assert_eq!(
        DownloadGrantStatus::from_str("consumed"),
        Some(DownloadGrantStatus::Consumed)
    );
    assert_eq!(
        DownloadGrantStatus::from_str("expired"),
        Some(DownloadGrantStatus::Expired)
    );
    assert_eq!(
        DownloadGrantStatus::from_str("revoked"),
        Some(DownloadGrantStatus::Revoked)
    );
    assert_eq!(DownloadGrantStatus::from_str("invalid"), None);
}

#[test]
fn test_download_grant_reason_from_str() {
    assert_eq!(
        DownloadGrantReason::from_str("purchase"),
        Some(DownloadGrantReason::Purchase)
    );
    assert_eq!(
        DownloadGrantReason::from_str("free_download"),
        Some(DownloadGrantReason::FreeDownload)
    );
    assert_eq!(
        DownloadGrantReason::from_str("promotion"),
        Some(DownloadGrantReason::Promotion)
    );
    assert_eq!(
        DownloadGrantReason::from_str("restore"),
        Some(DownloadGrantReason::Restore)
    );
    assert_eq!(DownloadGrantReason::from_str("invalid"), None);
}

#[test]
fn test_capability_name() {
    assert_eq!(
        sdkwork_appstore_library_service::capability_name(),
        "library"
    );
}
