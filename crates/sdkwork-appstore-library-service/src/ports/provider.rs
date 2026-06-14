use async_trait::async_trait;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct EntitlementGrant {
    pub entitlement_id: String,
    pub app_id: String,
    pub subject_id: String,
    pub entitlement_type: String,
    pub starts_at: chrono::DateTime<chrono::Utc>,
    pub expires_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DownloadUrlResult {
    pub url: String,
    pub expires_at: chrono::DateTime<chrono::Utc>,
    pub artifact_id: String,
}

#[async_trait]
pub trait LibraryProviderPort: Send + Sync {
    async fn check_entitlement(
        &self,
        tenant_id: &str,
        app_id: &str,
        user_id: &str,
    ) -> Result<Option<EntitlementGrant>, String>;

    async fn generate_download_url(
        &self,
        tenant_id: &str,
        artifact_id: &str,
        user_id: &str,
    ) -> Result<DownloadUrlResult, String>;

    async fn resolve_latest_release(
        &self,
        tenant_id: &str,
        listing_id: &str,
        platform: &str,
    ) -> Result<Option<ReleaseInfo>, String>;
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ReleaseInfo {
    pub release_id: String,
    pub version_name: String,
    pub version_code: String,
    pub artifact_id: Option<String>,
}
