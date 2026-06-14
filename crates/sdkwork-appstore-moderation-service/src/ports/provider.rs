use async_trait::async_trait;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SubmissionSnapshot {
    pub submission_id: String,
    pub listing_id: String,
    pub release_id: Option<String>,
    pub submission_type: String,
    pub payload_snapshot: serde_json::Value,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct OperatorProfile {
    pub user_id: String,
    pub display_name: String,
    pub roles: Vec<String>,
}

#[async_trait]
pub trait ModerationProviderPort: Send + Sync {
    async fn resolve_submission_snapshot(
        &self,
        tenant_id: &str,
        submission_id: &str,
    ) -> Result<SubmissionSnapshot, String>;

    async fn resolve_operator_profile(
        &self,
        tenant_id: &str,
        user_id: &str,
    ) -> Result<OperatorProfile, String>;

    async fn notify_publisher(
        &self,
        tenant_id: &str,
        publisher_id: &str,
        notification_type: &str,
        payload: &serde_json::Value,
    ) -> Result<(), String>;
}
