use async_trait::async_trait;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ListingPublicView {
    pub listing_id: String,
    pub display_name: String,
    pub subtitle: Option<String>,
    pub short_description: String,
    pub icon_media_id: Option<String>,
    pub average_rating: Option<String>,
    pub download_count: i32,
    pub primary_category_id: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SearchQuery {
    pub query: String,
    pub category_id: Option<String>,
    pub locale: Option<String>,
    pub limit: i32,
    pub offset: i32,
}

#[async_trait]
pub trait CatalogProviderPort: Send + Sync {
    async fn search_listings(
        &self,
        tenant_id: &str,
        query: &SearchQuery,
    ) -> Result<Vec<ListingPublicView>, String>;

    async fn resolve_listing_public_view(
        &self,
        tenant_id: &str,
        listing_id: &str,
        locale: &str,
    ) -> Result<Option<ListingPublicView>, String>;

    async fn refresh_search_index(&self, tenant_id: &str, listing_id: &str) -> Result<(), String>;
}
