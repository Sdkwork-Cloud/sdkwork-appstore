//! Project published listings into sdkwork-search backend indexes.

use async_trait::async_trait;
use serde_json::json;

use sdkwork_appstore_listing_service::ports::search_projection::{
    ListingSearchProjectionPort, PublishedListingSearchDocument,
};

use super::http_client::IntegrationHttpClient;

#[derive(Debug, Clone)]
pub struct SearchProjectionAdapter {
    http: IntegrationHttpClient,
    index_id: String,
}

impl SearchProjectionAdapter {
    pub fn from_env() -> Result<Self, String> {
        let enabled = matches!(
            std::env::var("APPSTORE_SEARCH_PROJECTION_ENABLED").as_deref(),
            Ok("1") | Ok("true") | Ok("on")
        );
        if !enabled {
            return Err("APPSTORE_SEARCH_PROJECTION_ENABLED is not set".to_string());
        }
        let base_url = std::env::var("APPSTORE_SEARCH_BACKEND_BASE_URL").map_err(|_| {
            "APPSTORE_SEARCH_BACKEND_BASE_URL is required for search index projection".to_string()
        })?;
        let index_id = std::env::var("APPSTORE_SEARCH_INDEX_ID").map_err(|_| {
            "APPSTORE_SEARCH_INDEX_ID is required for search index projection".to_string()
        })?;
        let auth_token = std::env::var("APPSTORE_SEARCH_SERVICE_AUTH_TOKEN")
            .ok()
            .or_else(|| std::env::var("APPSTORE_SEARCH_API_KEY").ok());
        let access_token = std::env::var("APPSTORE_SEARCH_SERVICE_ACCESS_TOKEN")
            .ok()
            .or_else(|| std::env::var("APPSTORE_SEARCH_ACCESS_TOKEN").ok());
        let http =
            IntegrationHttpClient::with_access_token(base_url, auth_token, access_token, 30)?;
        Ok(Self { http, index_id })
    }
}

#[async_trait]
impl ListingSearchProjectionPort for SearchProjectionAdapter {
    async fn upsert_published_listing(
        &self,
        document: &PublishedListingSearchDocument,
    ) -> Result<(), String> {
        let path = format!(
            "/backend/v3/api/search/indexes/{}/documents/{}",
            urlencoding::encode(&self.index_id),
            urlencoding::encode(&document.listing_id),
        );
        let body = json!({
            "document": {
                "id": document.listing_id,
                "title": document.title,
                "description": document.description,
                "enabled": true,
                "group": document.category_id,
                "scope": document.tenant_id,
                "source": "sdkwork-appstore",
                "metadata": {
                    "listingSlug": document.listing_slug,
                    "tenantId": document.tenant_id,
                },
            }
        });
        let _: serde_json::Value = self
            .http
            .put_envelope_item(&path, &body)
            .await
            .map_err(|error| format!("search document upsert failed: {error}"))?;
        Ok(())
    }

    async fn remove_listing(
        &self,
        _tenant_id: &str,
        listing_id: &str,
    ) -> Result<(), String> {
        let path = format!(
            "/backend/v3/api/search/indexes/{}/documents/{}",
            urlencoding::encode(&self.index_id),
            urlencoding::encode(listing_id),
        );
        self.http
            .delete_envelope(&path)
            .await
            .map_err(|error| format!("search document delete failed: {error}"))
    }
}
