use super::registry::{IntegrationCapability, IntegrationOwner, IntegrationSurface};
use async_trait::async_trait;

pub const CAPABILITY: IntegrationCapability = IntegrationCapability {
    key: "commerce",
    owner: IntegrationOwner::Dependency("sdkwork-commerce"),
    purpose: "Paid app and in-app-purchase product references for future entitlement flows.",
    surfaces: &[
        IntegrationSurface::BackendApi,
        IntegrationSurface::ServicePort,
        IntegrationSurface::Event,
    ],
    required: false,
    todo: "",
};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CommerceProduct {
    pub product_id: String,
    pub product_type: String,
    pub price_micros: i64,
    pub currency: String,
    pub status: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct EntitlementCheck {
    pub has_entitlement: bool,
    pub entitlement_type: Option<String>,
    pub expires_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[async_trait]
pub trait CommerceConnector: Send + Sync {
    async fn resolve_product(
        &self,
        tenant_id: &str,
        commerce_product_id: &str,
    ) -> Result<Option<CommerceProduct>, String>;

    async fn check_entitlement(
        &self,
        tenant_id: &str,
        app_id: &str,
        subject_id: &str,
    ) -> Result<EntitlementCheck, String>;

    async fn link_product_to_listing(
        &self,
        tenant_id: &str,
        listing_id: &str,
        commerce_product_id: &str,
    ) -> Result<(), String>;
}
