use async_trait::async_trait;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct OrganizationContext {
    pub organization_id: String,
    pub tenant_id: String,
    pub org_name: String,
    pub org_status: String,
}

#[async_trait]
pub trait PublisherProviderPort: Send + Sync {
    async fn resolve_organization_context(
        &self,
        tenant_id: &str,
        organization_id: &str,
    ) -> Result<OrganizationContext, String>;

    async fn validate_user_membership(
        &self,
        tenant_id: &str,
        organization_id: &str,
        user_id: &str,
    ) -> Result<bool, String>;

    async fn resolve_user_profile(
        &self,
        tenant_id: &str,
        user_id: &str,
    ) -> Result<UserProfile, String>;
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UserProfile {
    pub user_id: String,
    pub display_name: String,
    pub email: Option<String>,
}
