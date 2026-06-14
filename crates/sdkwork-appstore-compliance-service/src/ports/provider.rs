use async_trait::async_trait;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ContentRatingTemplate {
    pub rating_system: String,
    pub questions: Vec<RatingQuestion>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RatingQuestion {
    pub question_id: String,
    pub question_text: String,
    pub options: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PermissionInfo {
    pub permission_code: String,
    pub description: String,
    pub is_dangerous: bool,
}

#[async_trait]
pub trait ComplianceProviderPort: Send + Sync {
    async fn resolve_content_rating_template(
        &self,
        tenant_id: &str,
        rating_system: &str,
    ) -> Result<ContentRatingTemplate, String>;

    async fn resolve_permission_info(
        &self,
        tenant_id: &str,
        permission_code: &str,
    ) -> Result<Option<PermissionInfo>, String>;

    async fn validate_privacy_nutrition(
        &self,
        tenant_id: &str,
        listing_id: &str,
        privacy_data: &serde_json::Value,
    ) -> Result<ValidationResult, String>;
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ValidationResult {
    pub valid: bool,
    pub errors: Vec<String>,
    pub warnings: Vec<String>,
}
