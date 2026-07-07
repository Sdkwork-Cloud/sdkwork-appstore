//! Optional federated search via sdkwork-search with SQL fallback in catalog-service.

use async_trait::async_trait;

#[async_trait]
pub trait CatalogSearchFederationPort: Send + Sync {
    async fn resolve_listing_ids(
        &self,
        tenant_id: &str,
        query: &str,
        category_id: Option<&str>,
        limit: i32,
    ) -> Result<Vec<String>, String>;
}
