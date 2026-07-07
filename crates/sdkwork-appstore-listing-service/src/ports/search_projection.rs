//! Optional search index projection when listings are published.

use async_trait::async_trait;

use crate::domain::models::Listing;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PublishedListingSearchDocument {
    pub listing_id: String,
    pub tenant_id: String,
    pub title: String,
    pub description: String,
    pub listing_slug: String,
    pub category_id: Option<String>,
}

#[async_trait]
pub trait ListingSearchProjectionPort: Send + Sync {
    async fn upsert_published_listing(
        &self,
        document: &PublishedListingSearchDocument,
    ) -> Result<(), String>;

    async fn remove_listing(
        &self,
        tenant_id: &str,
        listing_id: &str,
    ) -> Result<(), String>;
}

impl PublishedListingSearchDocument {
    pub fn from_listing(listing: &Listing, title: String, description: String) -> Self {
        Self {
            listing_id: listing.id.as_str().to_string(),
            tenant_id: listing.tenant_id.clone(),
            title,
            description,
            listing_slug: listing.listing_slug.clone(),
            category_id: listing.primary_category_id.clone(),
        }
    }
}
