//! Repository port for catalog use cases.

use crate::context::AppstoreRequestContext;
use crate::domain::models::{
    CatalogChartSnapshot, CatalogCollection, CatalogCollectionItem, CatalogCollectionLocalization,
    CatalogFeaturedSlot, Category, CategoryId, CategoryLocalization, CollectionId,
    ListingMetricSnapshot, ListingSummary,
};
use crate::error::AppstoreServiceResult;

#[async_trait::async_trait]
pub trait CatalogRepositoryPort: Send + Sync {
    async fn find_categories(
        &self,
        context: &AppstoreRequestContext,
        cursor: Option<&str>,
        limit: i32,
    ) -> AppstoreServiceResult<Vec<Category>>;

    async fn find_category_by_id(
        &self,
        context: &AppstoreRequestContext,
        category_id: &CategoryId,
    ) -> AppstoreServiceResult<Option<Category>>;

    async fn find_category_by_code(
        &self,
        context: &AppstoreRequestContext,
        category_code: &str,
    ) -> AppstoreServiceResult<Option<Category>>;

    async fn find_category_localizations(
        &self,
        context: &AppstoreRequestContext,
        category_id: &CategoryId,
    ) -> AppstoreServiceResult<Vec<CategoryLocalization>>;

    async fn insert_category(
        &self,
        context: &AppstoreRequestContext,
        category: &Category,
    ) -> AppstoreServiceResult<()>;

    async fn update_category(
        &self,
        context: &AppstoreRequestContext,
        category: &Category,
    ) -> AppstoreServiceResult<()>;

    async fn upsert_category_localization(
        &self,
        context: &AppstoreRequestContext,
        localization: &CategoryLocalization,
    ) -> AppstoreServiceResult<()>;

    async fn find_collections(
        &self,
        context: &AppstoreRequestContext,
        cursor: Option<&str>,
        limit: i32,
    ) -> AppstoreServiceResult<Vec<CatalogCollection>>;

    async fn find_collection_by_id(
        &self,
        context: &AppstoreRequestContext,
        collection_id: &CollectionId,
    ) -> AppstoreServiceResult<Option<CatalogCollection>>;

    async fn find_collection_by_code(
        &self,
        context: &AppstoreRequestContext,
        collection_code: &str,
    ) -> AppstoreServiceResult<Option<CatalogCollection>>;

    async fn find_collection_localizations(
        &self,
        context: &AppstoreRequestContext,
        collection_id: &CollectionId,
    ) -> AppstoreServiceResult<Vec<CatalogCollectionLocalization>>;

    async fn find_collection_items(
        &self,
        context: &AppstoreRequestContext,
        collection_id: &CollectionId,
    ) -> AppstoreServiceResult<Vec<CatalogCollectionItem>>;

    async fn insert_collection(
        &self,
        context: &AppstoreRequestContext,
        collection: &CatalogCollection,
    ) -> AppstoreServiceResult<()>;

    async fn update_collection(
        &self,
        context: &AppstoreRequestContext,
        collection: &CatalogCollection,
    ) -> AppstoreServiceResult<()>;

    async fn upsert_collection_localization(
        &self,
        context: &AppstoreRequestContext,
        localization: &CatalogCollectionLocalization,
    ) -> AppstoreServiceResult<()>;

    async fn delete_collection_items(
        &self,
        context: &AppstoreRequestContext,
        collection_id: &CollectionId,
    ) -> AppstoreServiceResult<()>;

    async fn insert_collection_item(
        &self,
        context: &AppstoreRequestContext,
        item: &CatalogCollectionItem,
    ) -> AppstoreServiceResult<()>;

    async fn find_featured_slots(
        &self,
        context: &AppstoreRequestContext,
    ) -> AppstoreServiceResult<Vec<CatalogFeaturedSlot>>;

    async fn find_featured_slot_by_code(
        &self,
        context: &AppstoreRequestContext,
        slot_code: &str,
    ) -> AppstoreServiceResult<Option<CatalogFeaturedSlot>>;

    async fn upsert_featured_slot(
        &self,
        context: &AppstoreRequestContext,
        slot: &CatalogFeaturedSlot,
    ) -> AppstoreServiceResult<()>;

    async fn find_chart_snapshot(
        &self,
        context: &AppstoreRequestContext,
        chart_code: &str,
        snapshot_date: &str,
        locale: &str,
        platform_scope: &str,
    ) -> AppstoreServiceResult<Option<CatalogChartSnapshot>>;

    async fn find_latest_chart_snapshot(
        &self,
        context: &AppstoreRequestContext,
        chart_code: &str,
        locale: &str,
        platform_scope: &str,
    ) -> AppstoreServiceResult<Option<CatalogChartSnapshot>>;

    async fn search_listings(
        &self,
        context: &AppstoreRequestContext,
        query: Option<&str>,
        category_id: Option<&str>,
        cursor: Option<&str>,
        limit: i32,
    ) -> AppstoreServiceResult<Vec<ListingSummary>>;

    async fn find_metric_snapshots(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &str,
        start_date: Option<&str>,
        end_date: Option<&str>,
    ) -> AppstoreServiceResult<Vec<ListingMetricSnapshot>>;
}
