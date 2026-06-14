use async_trait::async_trait;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PlusAppReference {
    pub plus_app_id: String,
    pub plus_app_key: String,
    pub app_name: String,
    pub manifest_snapshot: serde_json::Value,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MediaUploadResult {
    pub media_resource_id: String,
    pub drive_node_id: String,
    pub content_type: String,
    pub file_size_bytes: i64,
}

#[async_trait]
pub trait ListingProviderPort: Send + Sync {
    async fn resolve_plus_app(
        &self,
        tenant_id: &str,
        plus_app_id: &str,
    ) -> Result<PlusAppReference, String>;

    async fn resolve_media_resource(
        &self,
        tenant_id: &str,
        media_resource_id: &str,
    ) -> Result<MediaUploadResult, String>;

    async fn validate_publisher_access(
        &self,
        tenant_id: &str,
        publisher_id: &str,
        user_id: &str,
    ) -> Result<bool, String>;
}
