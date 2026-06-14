use async_trait::async_trait;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ExternalReleaseStatus {
    pub external_release_id: String,
    pub external_status: String,
    pub store_url: Option<String>,
    pub rejection_reason: Option<String>,
    pub last_synced_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ExternalSubmissionResult {
    pub external_release_id: String,
    pub external_status: String,
    pub submitted_at: chrono::DateTime<chrono::Utc>,
}

#[async_trait]
pub trait MarketProviderPort: Send + Sync {
    async fn submit_release(
        &self,
        channel_code: &str,
        external_app_id: &str,
        artifact_url: &str,
        metadata: &serde_json::Value,
    ) -> Result<ExternalSubmissionResult, String>;

    async fn poll_release_status(
        &self,
        channel_code: &str,
        external_release_id: &str,
    ) -> Result<ExternalReleaseStatus, String>;

    async fn resolve_store_url(
        &self,
        channel_code: &str,
        external_app_id: &str,
    ) -> Result<Option<String>, String>;
}
