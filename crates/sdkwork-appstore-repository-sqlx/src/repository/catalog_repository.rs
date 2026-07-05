use crate::pool::AppstoreSqlxDb;

use crate::db::columns::{
    columns_csv, APPSTORE_CATALOG_CHART_SNAPSHOT_COLUMNS, APPSTORE_CATALOG_COLLECTION_COLUMNS,
    APPSTORE_CATALOG_COLLECTION_ITEM_COLUMNS, APPSTORE_CATALOG_COLLECTION_LOCALIZATION_COLUMNS,
    APPSTORE_CATALOG_FEATURED_SLOT_COLUMNS, APPSTORE_CATALOG_SEARCH_HISTORY_COLUMNS,
    APPSTORE_CATALOG_TRENDING_TERM_COLUMNS, APPSTORE_CATEGORY_COLUMNS,
    APPSTORE_CATEGORY_LOCALIZATION_COLUMNS, APPSTORE_LISTING_METRIC_SNAPSHOT_COLUMNS,
};
use crate::db::rows::{
    CatalogChartSnapshotRow, CatalogCollectionItemRow, CatalogCollectionLocalizationRow,
    CatalogCollectionRow, CatalogFeaturedSlotRow, CatalogSearchHistoryRow, CatalogTrendingTermRow,
    CategoryLocalizationRow, CategoryRow, ListingMetricSnapshotRow, ListingSearchRow,
    ListingSuggestionRow,
};
use crate::mapper::row_mapper::{
    map_category_domain_to_row, map_category_localization_row_to_domain,
    map_category_row_to_domain, map_chart_snapshot_row_to_domain, map_collection_domain_to_row,
    map_collection_item_domain_to_row, map_collection_item_row_to_domain,
    map_collection_localization_row_to_domain, map_collection_row_to_domain,
    map_featured_slot_domain_to_row, map_featured_slot_row_to_domain,
    map_listing_search_row_to_domain, map_metric_snapshot_row_to_domain,
    map_search_history_row_to_domain, map_trending_term_row_to_domain,
};

use sdkwork_appstore_catalog_service::context::AppstoreRequestContext;
use sdkwork_appstore_catalog_service::domain::models::{
    CatalogChartSnapshot, CatalogCollection, CatalogCollectionItem, CatalogCollectionLocalization,
    CatalogFeaturedSlot, Category, CategoryId, CategoryLocalization, CollectionId,
    ListingMetricSnapshot, ListingSummary, OperatorDashboardStats, OperatorSearchAnalytics,
    PublisherAnalyticsOverview, PublisherListingMetricsSummary, SearchHistoryEntry,
    SearchSuggestion, TrendingTerm,
};
use sdkwork_appstore_catalog_service::error::AppstoreServiceError;
use sdkwork_appstore_catalog_service::ports::repository::CatalogRepositoryPort;

#[derive(Debug, Clone)]
pub struct SqlxCatalogRepository {
    db: AppstoreSqlxDb,
}

impl SqlxCatalogRepository {
    pub fn new(db: AppstoreSqlxDb) -> Self {
        Self { db }
    }
}

#[async_trait::async_trait]
impl CatalogRepositoryPort for SqlxCatalogRepository {
    async fn find_categories(
        &self,
        context: &AppstoreRequestContext,
        cursor: Option<&str>,
        limit: i32,
    ) -> Result<Vec<Category>, AppstoreServiceError> {
        let rows = if let Some(cursor_id) = cursor {
            self.db.query_as::< CategoryRow>(&format!(
                r#"
                SELECT {}
                FROM appstore_category
                WHERE tenant_id = ? AND category_status != 'deleted' AND id > ?
                ORDER BY id ASC
                LIMIT ?
                "#,
                columns_csv(APPSTORE_CATEGORY_COLUMNS)
            ))
            .bind(&context.tenant_id)
            .bind(cursor_id)
            .bind(limit)
            .fetch_all(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?
        } else {
            self.db.query_as::< CategoryRow>(&format!(
                r#"
                SELECT {}
                FROM appstore_category
                WHERE tenant_id = ? AND category_status != 'deleted'
                ORDER BY id ASC
                LIMIT ?
                "#,
                columns_csv(APPSTORE_CATEGORY_COLUMNS)
            ))
            .bind(&context.tenant_id)
            .bind(limit)
            .fetch_all(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?
        };

        rows.into_iter()
            .map(map_category_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_category_by_id(
        &self,
        context: &AppstoreRequestContext,
        category_id: &CategoryId,
    ) -> Result<Option<Category>, AppstoreServiceError> {
        let row = self.db.query_as::< CategoryRow>(&format!(
            r#"
            SELECT {}
            FROM appstore_category
            WHERE id = ? AND tenant_id = ? AND category_status != 'deleted'
            "#,
            columns_csv(APPSTORE_CATEGORY_COLUMNS)
        ))
        .bind(category_id.as_str())
        .bind(&context.tenant_id)
        .fetch_optional(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_category_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_category_by_code(
        &self,
        context: &AppstoreRequestContext,
        category_code: &str,
    ) -> Result<Option<Category>, AppstoreServiceError> {
        let row = self.db.query_as::< CategoryRow>(&format!(
            r#"
            SELECT {}
            FROM appstore_category
            WHERE category_code = ? AND tenant_id = ? AND category_status != 'deleted'
            "#,
            columns_csv(APPSTORE_CATEGORY_COLUMNS)
        ))
        .bind(category_code)
        .bind(&context.tenant_id)
        .fetch_optional(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_category_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_category_localizations(
        &self,
        context: &AppstoreRequestContext,
        category_id: &CategoryId,
    ) -> Result<Vec<CategoryLocalization>, AppstoreServiceError> {
        let rows = self.db.query_as::< CategoryLocalizationRow>(&format!(
            r#"
            SELECT {}
            FROM appstore_category_localization
            WHERE category_id = ? AND tenant_id = ?
            "#,
            columns_csv(APPSTORE_CATEGORY_LOCALIZATION_COLUMNS)
        ))
        .bind(category_id.as_str())
        .bind(&context.tenant_id)
        .fetch_all(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        rows.into_iter()
            .map(map_category_localization_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn insert_category(
        &self,
        context: &AppstoreRequestContext,
        category: &Category,
    ) -> Result<(), AppstoreServiceError> {
        let status = map_category_domain_to_row(category);

        self.db.query(
            r#"
            INSERT INTO appstore_category (
                id, tenant_id, category_code, parent_category_id, category_level,
                category_status, sort_order, icon_media_resource_id, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(category.id.as_str())
        .bind(&context.tenant_id)
        .bind(&category.category_code)
        .bind(&category.parent_category_id)
        .bind(category.category_level)
        .bind(&status)
        .bind(category.sort_order)
        .bind(&category.icon_media_resource_id)
        .bind(category.created_at)
        .bind(category.updated_at)
        .execute_unified(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn update_category(
        &self,
        context: &AppstoreRequestContext,
        category: &Category,
    ) -> Result<(), AppstoreServiceError> {
        let status = map_category_domain_to_row(category);

        self.db.query(
            r#"
            UPDATE appstore_category
            SET category_code = ?, parent_category_id = ?, category_level = ?,
                category_status = ?, sort_order = ?, icon_media_resource_id = ?, updated_at = ?
            WHERE id = ? AND tenant_id = ?
            "#,
        )
        .bind(&category.category_code)
        .bind(&category.parent_category_id)
        .bind(category.category_level)
        .bind(&status)
        .bind(category.sort_order)
        .bind(&category.icon_media_resource_id)
        .bind(category.updated_at)
        .bind(category.id.as_str())
        .bind(&context.tenant_id)
        .execute_unified(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn upsert_category_localization(
        &self,
        context: &AppstoreRequestContext,
        localization: &CategoryLocalization,
    ) -> Result<(), AppstoreServiceError> {
        self.db.query(
            r#"
            INSERT INTO appstore_category_localization (
                id, tenant_id, category_id, locale, display_name, description, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (tenant_id, category_id, locale) DO UPDATE SET
                display_name = excluded.display_name,
                description = excluded.description,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(&localization.id)
        .bind(&context.tenant_id)
        .bind(localization.category_id.as_str())
        .bind(&localization.locale)
        .bind(&localization.display_name)
        .bind(&localization.description)
        .bind(localization.created_at)
        .bind(localization.updated_at)
        .execute_unified(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn find_collections(
        &self,
        context: &AppstoreRequestContext,
        cursor: Option<&str>,
        limit: i32,
    ) -> Result<Vec<CatalogCollection>, AppstoreServiceError> {
        let rows = if let Some(cursor_id) = cursor {
            self.db.query_as::< CatalogCollectionRow>(&format!(
                r#"
                SELECT {}
                FROM appstore_catalog_collection
                WHERE tenant_id = ? AND collection_status != 'archived' AND id > ?
                ORDER BY id ASC
                LIMIT ?
                "#,
                columns_csv(APPSTORE_CATALOG_COLLECTION_COLUMNS)
            ))
            .bind(&context.tenant_id)
            .bind(cursor_id)
            .bind(limit)
            .fetch_all(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?
        } else {
            self.db.query_as::< CatalogCollectionRow>(&format!(
                r#"
                SELECT {}
                FROM appstore_catalog_collection
                WHERE tenant_id = ? AND collection_status != 'archived'
                ORDER BY id ASC
                LIMIT ?
                "#,
                columns_csv(APPSTORE_CATALOG_COLLECTION_COLUMNS)
            ))
            .bind(&context.tenant_id)
            .bind(limit)
            .fetch_all(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?
        };

        rows.into_iter()
            .map(map_collection_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_collection_by_id(
        &self,
        context: &AppstoreRequestContext,
        collection_id: &CollectionId,
    ) -> Result<Option<CatalogCollection>, AppstoreServiceError> {
        let row = self.db.query_as::< CatalogCollectionRow>(&format!(
            r#"
            SELECT {}
            FROM appstore_catalog_collection
            WHERE id = ? AND tenant_id = ?
            "#,
            columns_csv(APPSTORE_CATALOG_COLLECTION_COLUMNS)
        ))
        .bind(collection_id.as_str())
        .bind(&context.tenant_id)
        .fetch_optional(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_collection_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_collection_by_code(
        &self,
        context: &AppstoreRequestContext,
        collection_code: &str,
    ) -> Result<Option<CatalogCollection>, AppstoreServiceError> {
        let row = self.db.query_as::< CatalogCollectionRow>(&format!(
            r#"
            SELECT {}
            FROM appstore_catalog_collection
            WHERE collection_code = ? AND tenant_id = ?
            "#,
            columns_csv(APPSTORE_CATALOG_COLLECTION_COLUMNS)
        ))
        .bind(collection_code)
        .bind(&context.tenant_id)
        .fetch_optional(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_collection_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_collection_localizations(
        &self,
        context: &AppstoreRequestContext,
        collection_id: &CollectionId,
    ) -> Result<Vec<CatalogCollectionLocalization>, AppstoreServiceError> {
        let rows = self.db.query_as::< CatalogCollectionLocalizationRow>(&format!(
            r#"
            SELECT {}
            FROM appstore_catalog_collection_localization
            WHERE collection_id = ? AND tenant_id = ?
            "#,
            columns_csv(APPSTORE_CATALOG_COLLECTION_LOCALIZATION_COLUMNS)
        ))
        .bind(collection_id.as_str())
        .bind(&context.tenant_id)
        .fetch_all(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        rows.into_iter()
            .map(map_collection_localization_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_collection_items(
        &self,
        context: &AppstoreRequestContext,
        collection_id: &CollectionId,
    ) -> Result<Vec<CatalogCollectionItem>, AppstoreServiceError> {
        let rows = self.db.query_as::< CatalogCollectionItemRow>(&format!(
            r#"
            SELECT {}
            FROM appstore_catalog_collection_item
            WHERE collection_id = ? AND tenant_id = ?
            ORDER BY sort_order ASC
            "#,
            columns_csv(APPSTORE_CATALOG_COLLECTION_ITEM_COLUMNS)
        ))
        .bind(collection_id.as_str())
        .bind(&context.tenant_id)
        .fetch_all(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        rows.into_iter()
            .map(map_collection_item_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn insert_collection(
        &self,
        context: &AppstoreRequestContext,
        collection: &CatalogCollection,
    ) -> Result<(), AppstoreServiceError> {
        let (collection_type, collection_status, audience_scope) =
            map_collection_domain_to_row(collection);

        self.db.query(
            r#"
            INSERT INTO appstore_catalog_collection (
                id, tenant_id, collection_code, collection_type, collection_status,
                audience_scope, sort_order, cover_media_resource_id, starts_at, ends_at,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(collection.id.as_str())
        .bind(&context.tenant_id)
        .bind(&collection.collection_code)
        .bind(&collection_type)
        .bind(&collection_status)
        .bind(&audience_scope)
        .bind(collection.sort_order)
        .bind(&collection.cover_media_resource_id)
        .bind(collection.starts_at)
        .bind(collection.ends_at)
        .bind(collection.created_at)
        .bind(collection.updated_at)
        .execute_unified(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn update_collection(
        &self,
        context: &AppstoreRequestContext,
        collection: &CatalogCollection,
    ) -> Result<(), AppstoreServiceError> {
        let (collection_type, collection_status, audience_scope) =
            map_collection_domain_to_row(collection);

        self.db.query(
            r#"
            UPDATE appstore_catalog_collection
            SET collection_code = ?, collection_type = ?, collection_status = ?,
                audience_scope = ?, sort_order = ?, cover_media_resource_id = ?,
                starts_at = ?, ends_at = ?, updated_at = ?
            WHERE id = ? AND tenant_id = ?
            "#,
        )
        .bind(&collection.collection_code)
        .bind(&collection_type)
        .bind(&collection_status)
        .bind(&audience_scope)
        .bind(collection.sort_order)
        .bind(&collection.cover_media_resource_id)
        .bind(collection.starts_at)
        .bind(collection.ends_at)
        .bind(collection.updated_at)
        .bind(collection.id.as_str())
        .bind(&context.tenant_id)
        .execute_unified(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn upsert_collection_localization(
        &self,
        context: &AppstoreRequestContext,
        localization: &CatalogCollectionLocalization,
    ) -> Result<(), AppstoreServiceError> {
        self.db.query(
            r#"
            INSERT INTO appstore_catalog_collection_localization (
                id, tenant_id, collection_id, locale, display_name, description, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (tenant_id, collection_id, locale) DO UPDATE SET
                display_name = excluded.display_name,
                description = excluded.description,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(&localization.id)
        .bind(&context.tenant_id)
        .bind(localization.collection_id.as_str())
        .bind(&localization.locale)
        .bind(&localization.display_name)
        .bind(&localization.description)
        .bind(localization.created_at)
        .bind(localization.updated_at)
        .execute_unified(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn delete_collection_items(
        &self,
        context: &AppstoreRequestContext,
        collection_id: &CollectionId,
    ) -> Result<(), AppstoreServiceError> {
        self.db.query(
            r#"
            DELETE FROM appstore_catalog_collection_item
            WHERE collection_id = ? AND tenant_id = ?
            "#,
        )
        .bind(collection_id.as_str())
        .bind(&context.tenant_id)
        .execute_unified(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn insert_collection_item(
        &self,
        context: &AppstoreRequestContext,
        item: &CatalogCollectionItem,
    ) -> Result<(), AppstoreServiceError> {
        let highlight_json = map_collection_item_domain_to_row(item);

        self.db.query(
            r#"
            INSERT INTO appstore_catalog_collection_item (
                id, tenant_id, collection_id, listing_id, sort_order,
                highlight_json, starts_at, ends_at, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&item.id)
        .bind(&context.tenant_id)
        .bind(item.collection_id.as_str())
        .bind(&item.listing_id)
        .bind(item.sort_order)
        .bind(&highlight_json)
        .bind(item.starts_at)
        .bind(item.ends_at)
        .bind(item.created_at)
        .execute_unified(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn find_featured_slots(
        &self,
        context: &AppstoreRequestContext,
    ) -> Result<Vec<CatalogFeaturedSlot>, AppstoreServiceError> {
        let rows = self.db.query_as::< CatalogFeaturedSlotRow>(&format!(
            r#"
            SELECT {}
            FROM appstore_catalog_featured_slot
            WHERE tenant_id = ? AND slot_status = 'active'
            ORDER BY starts_at DESC
            "#,
            columns_csv(APPSTORE_CATALOG_FEATURED_SLOT_COLUMNS)
        ))
        .bind(&context.tenant_id)
        .fetch_all(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        rows.into_iter()
            .map(map_featured_slot_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_featured_slot_by_code(
        &self,
        context: &AppstoreRequestContext,
        slot_code: &str,
    ) -> Result<Option<CatalogFeaturedSlot>, AppstoreServiceError> {
        let row = self.db.query_as::< CatalogFeaturedSlotRow>(&format!(
            r#"
            SELECT {}
            FROM appstore_catalog_featured_slot
            WHERE slot_code = ? AND tenant_id = ? AND slot_status = 'active'
            ORDER BY starts_at DESC
            LIMIT 1
            "#,
            columns_csv(APPSTORE_CATALOG_FEATURED_SLOT_COLUMNS)
        ))
        .bind(slot_code)
        .bind(&context.tenant_id)
        .fetch_optional(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_featured_slot_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn upsert_featured_slot(
        &self,
        context: &AppstoreRequestContext,
        slot: &CatalogFeaturedSlot,
    ) -> Result<(), AppstoreServiceError> {
        let (slot_status, audience_scope, platform_scope, region_scope_json) =
            map_featured_slot_domain_to_row(slot);

        self.db.query(
            r#"
            INSERT INTO appstore_catalog_featured_slot (
                id, tenant_id, slot_code, listing_id, slot_status, audience_scope,
                platform_scope, region_scope_json, starts_at, ends_at, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (tenant_id, slot_code, starts_at) DO UPDATE SET
                listing_id = excluded.listing_id,
                slot_status = excluded.slot_status,
                audience_scope = excluded.audience_scope,
                platform_scope = excluded.platform_scope,
                region_scope_json = excluded.region_scope_json,
                ends_at = excluded.ends_at,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(slot.id.as_str())
        .bind(&context.tenant_id)
        .bind(&slot.slot_code)
        .bind(&slot.listing_id)
        .bind(&slot_status)
        .bind(&audience_scope)
        .bind(&platform_scope)
        .bind(&region_scope_json)
        .bind(slot.starts_at)
        .bind(slot.ends_at)
        .bind(slot.created_at)
        .bind(slot.updated_at)
        .execute_unified(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn find_chart_snapshot(
        &self,
        context: &AppstoreRequestContext,
        chart_code: &str,
        snapshot_date: &str,
        locale: &str,
        platform_scope: &str,
    ) -> Result<Option<CatalogChartSnapshot>, AppstoreServiceError> {
        let row = self.db.query_as::< CatalogChartSnapshotRow>(&format!(
            r#"
            SELECT {}
            FROM appstore_catalog_chart_snapshot
            WHERE chart_code = ? AND snapshot_date = ? AND locale = ? AND platform_scope = ?
                  AND tenant_id = ?
            "#,
            columns_csv(APPSTORE_CATALOG_CHART_SNAPSHOT_COLUMNS)
        ))
        .bind(chart_code)
        .bind(snapshot_date)
        .bind(locale)
        .bind(platform_scope)
        .bind(&context.tenant_id)
        .fetch_optional(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_chart_snapshot_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_latest_chart_snapshot(
        &self,
        context: &AppstoreRequestContext,
        chart_code: &str,
        locale: &str,
        platform_scope: &str,
    ) -> Result<Option<CatalogChartSnapshot>, AppstoreServiceError> {
        let row = self.db.query_as::< CatalogChartSnapshotRow>(&format!(
            r#"
            SELECT {}
            FROM appstore_catalog_chart_snapshot
            WHERE chart_code = ? AND locale = ? AND platform_scope = ? AND tenant_id = ?
            ORDER BY snapshot_date DESC
            LIMIT 1
            "#,
            columns_csv(APPSTORE_CATALOG_CHART_SNAPSHOT_COLUMNS)
        ))
        .bind(chart_code)
        .bind(locale)
        .bind(platform_scope)
        .bind(&context.tenant_id)
        .fetch_optional(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_chart_snapshot_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn search_listings(
        &self,
        context: &AppstoreRequestContext,
        query: Option<&str>,
        category_id: Option<&str>,
        cursor: Option<&str>,
        limit: i32,
    ) -> Result<Vec<ListingSummary>, AppstoreServiceError> {
        let mut sql = String::from(
            r#"
            SELECT l.id, l.app_id, l.app_key, ll.display_name, ll.subtitle,
                   l.listing_slug, l.pricing_model, l.icon_media_resource_id,
                   l.average_rating, l.rating_count
            FROM appstore_listing l
            LEFT JOIN appstore_listing_localization ll
                ON ll.listing_id = l.id AND ll.locale = l.default_locale AND ll.tenant_id = l.tenant_id
            WHERE l.tenant_id = ?
              AND l.listing_status = 'published'
              AND l.storefront_visibility = 'visible'
              AND l.deleted_at IS NULL
            "#,
        );

        if query.is_some() {
            sql.push_str("  AND (ll.display_name LIKE ? OR ll.subtitle LIKE ?)\n");
        }
        if category_id.is_some() {
            sql.push_str("  AND l.primary_category_id = ?\n");
        }
        if cursor.is_some() {
            sql.push_str("  AND l.listing_no > ?\n");
        }
        sql.push_str("ORDER BY l.featured_score DESC, l.rating_count DESC, l.listing_no ASC\n");
        sql.push_str("LIMIT ?\n");

        let mut q = self.db.query_as::<ListingSearchRow>(&self.db.adapt_sql(&sql)).bind(&context.tenant_id);

        if let Some(qs) = query {
            let pattern = format!("%{}%", qs);
            q = q.bind(pattern.clone()).bind(pattern);
        }
        if let Some(cid) = category_id {
            q = q.bind(cid);
        }
        if let Some(cursor_no) = cursor {
            q = q.bind(cursor_no);
        }
        q = q.bind(limit);

        let rows = q
            .fetch_all(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(rows
            .into_iter()
            .map(map_listing_search_row_to_domain)
            .collect())
    }

    async fn find_metric_snapshots(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &str,
        start_date: Option<&str>,
        end_date: Option<&str>,
    ) -> Result<Vec<ListingMetricSnapshot>, AppstoreServiceError> {
        let mut sql = format!(
            r#"
            SELECT {}
            FROM appstore_listing_metric_snapshot
            WHERE listing_id = ? AND tenant_id = ?
            "#,
            columns_csv(APPSTORE_LISTING_METRIC_SNAPSHOT_COLUMNS)
        );

        if start_date.is_some() {
            sql.push_str("  AND snapshot_date >= ?\n");
        }
        if end_date.is_some() {
            sql.push_str("  AND snapshot_date <= ?\n");
        }
        sql.push_str("ORDER BY snapshot_date ASC\n");

        let mut q = self
            .db
            .query_as::<ListingMetricSnapshotRow>(&self.db.adapt_sql(&sql))
            .bind(listing_id)
            .bind(&context.tenant_id);

        if let Some(sd) = start_date {
            q = q.bind(sd);
        }
        if let Some(ed) = end_date {
            q = q.bind(ed);
        }

        let rows = q
            .fetch_all(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        rows.into_iter()
            .map(map_metric_snapshot_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_listings_by_ids(
        &self,
        context: &AppstoreRequestContext,
        listing_ids: &[String],
        locale: Option<&str>,
    ) -> Result<Vec<ListingSummary>, AppstoreServiceError> {
        if listing_ids.is_empty() {
            return Ok(Vec::new());
        }

        let locale_filter = locale.unwrap_or("en-US");
        let placeholders = listing_ids
            .iter()
            .map(|_| "?")
            .collect::<Vec<_>>()
            .join(", ");
        let sql = format!(
            r#"
            SELECT l.id, l.app_id, l.app_key, ll.display_name, ll.subtitle,
                   l.listing_slug, l.pricing_model, l.icon_media_resource_id,
                   l.average_rating, l.rating_count
            FROM appstore_listing l
            LEFT JOIN appstore_listing_localization ll
                ON ll.listing_id = l.id
               AND ll.locale = ?
               AND ll.tenant_id = l.tenant_id
            WHERE l.tenant_id = ?
              AND l.id IN ({placeholders})
              AND l.listing_status = 'published'
              AND l.storefront_visibility = 'visible'
              AND l.deleted_at IS NULL
            "#,
        );

        let mut query = self
            .db
            .query_as::<ListingSearchRow>(&self.db.adapt_sql(&sql))
            .bind(locale_filter)
            .bind(&context.tenant_id);
        for listing_id in listing_ids {
            query = query.bind(listing_id);
        }

        let rows = query
            .fetch_all(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(rows
            .into_iter()
            .map(map_listing_search_row_to_domain)
            .collect())
    }

    async fn find_recently_updated_listings(
        &self,
        context: &AppstoreRequestContext,
        locale: Option<&str>,
        cursor: Option<&str>,
        limit: i32,
    ) -> Result<Vec<ListingSummary>, AppstoreServiceError> {
        let locale_filter = locale.unwrap_or("en-US");
        let mut sql = String::from(
            r#"
            SELECT l.id, l.app_id, l.app_key, ll.display_name, ll.subtitle,
                   l.listing_slug, l.pricing_model, l.icon_media_resource_id,
                   l.average_rating, l.rating_count
            FROM appstore_listing l
            LEFT JOIN appstore_listing_localization ll
                ON ll.listing_id = l.id
               AND ll.locale = ?
               AND ll.tenant_id = l.tenant_id
            WHERE l.tenant_id = ?
              AND l.listing_status = 'published'
              AND l.storefront_visibility = 'visible'
              AND l.deleted_at IS NULL
            "#,
        );

        if cursor.is_some() {
            sql.push_str(
                r#"
              AND (
                l.updated_at < (SELECT updated_at FROM appstore_listing WHERE id = ? AND tenant_id = ?)
                OR (
                  l.updated_at = (SELECT updated_at FROM appstore_listing WHERE id = ? AND tenant_id = ?)
                  AND l.id < ?
                )
              )
            "#,
            );
        }
        sql.push_str("ORDER BY l.updated_at DESC, l.id DESC\nLIMIT ?\n");

        let mut query = self
            .db
            .query_as::<ListingSearchRow>(&self.db.adapt_sql(&sql))
            .bind(locale_filter)
            .bind(&context.tenant_id);
        if let Some(cursor_id) = cursor {
            query = query
                .bind(cursor_id)
                .bind(&context.tenant_id)
                .bind(cursor_id)
                .bind(&context.tenant_id)
                .bind(cursor_id);
        }
        query = query.bind(limit);

        let rows = query
            .fetch_all(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(rows
            .into_iter()
            .map(map_listing_search_row_to_domain)
            .collect())
    }

    async fn find_event_collections(
        &self,
        context: &AppstoreRequestContext,
        status: Option<&str>,
        cursor: Option<&str>,
        limit: i32,
    ) -> Result<Vec<CatalogCollection>, AppstoreServiceError> {
        let now = chrono::Utc::now();
        let mut sql = format!(
            r#"
            SELECT {}
            FROM appstore_catalog_collection
            WHERE tenant_id = ?
              AND collection_status = 'published'
              AND starts_at IS NOT NULL
              AND ends_at IS NOT NULL
            "#,
            columns_csv(APPSTORE_CATALOG_COLLECTION_COLUMNS)
        );

        if let Some(status_filter) = status {
            match status_filter {
                "upcoming" => sql.push_str("  AND starts_at > ?\n"),
                "active" => sql.push_str("  AND starts_at <= ? AND ends_at >= ?\n"),
                "ended" => sql.push_str("  AND ends_at < ?\n"),
                _ => {}
            }
        }
        if cursor.is_some() {
            sql.push_str(
                r#"
              AND (
                starts_at < (SELECT starts_at FROM appstore_catalog_collection WHERE id = ? AND tenant_id = ?)
                OR (
                  starts_at = (SELECT starts_at FROM appstore_catalog_collection WHERE id = ? AND tenant_id = ?)
                  AND id < ?
                )
              )
            "#,
            );
        }
        sql.push_str("ORDER BY starts_at DESC, id DESC\nLIMIT ?\n");

        let mut query = self
            .db
            .query_as::<CatalogCollectionRow>(&self.db.adapt_sql(&sql))
            .bind(&context.tenant_id);
        if let Some(status_filter) = status {
            match status_filter {
                "upcoming" => query = query.bind(now),
                "active" => query = query.bind(now).bind(now),
                "ended" => query = query.bind(now),
                _ => {}
            }
        }
        if let Some(cursor_id) = cursor {
            query = query
                .bind(cursor_id)
                .bind(&context.tenant_id)
                .bind(cursor_id)
                .bind(&context.tenant_id)
                .bind(cursor_id);
        }
        query = query.bind(limit);

        let rows = query
            .fetch_all(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        rows.into_iter()
            .map(map_collection_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_listing_name_suggestions(
        &self,
        context: &AppstoreRequestContext,
        prefix: &str,
        locale: Option<&str>,
        limit: i32,
    ) -> Result<Vec<SearchSuggestion>, AppstoreServiceError> {
        let locale_filter = locale.unwrap_or("en-US");
        let pattern = format!("{}%", prefix);

        let rows = self.db.query_as::< ListingSuggestionRow>(
            r#"
            SELECT l.id AS listing_id, ll.display_name
            FROM appstore_listing l
            INNER JOIN appstore_listing_localization ll
                ON ll.listing_id = l.id
               AND ll.locale = ?
               AND ll.tenant_id = l.tenant_id
            WHERE l.tenant_id = ?
              AND l.listing_status = 'published'
              AND l.storefront_visibility = 'visible'
              AND l.deleted_at IS NULL
              AND ll.display_name LIKE ?
            ORDER BY l.featured_score DESC, ll.display_name ASC
            LIMIT ?
            "#,
        )
        .bind(locale_filter)
        .bind(&context.tenant_id)
        .bind(pattern)
        .bind(limit)
        .fetch_all(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(rows
            .into_iter()
            .map(|row| SearchSuggestion {
                text: row.display_name,
                suggestion_type: "listing".to_string(),
                listing_id: Some(row.listing_id),
            })
            .collect())
    }

    async fn find_trending_term_suggestions(
        &self,
        context: &AppstoreRequestContext,
        prefix: &str,
        locale: Option<&str>,
        limit: i32,
    ) -> Result<Vec<SearchSuggestion>, AppstoreServiceError> {
        let locale_filter = locale.unwrap_or("en-US");
        let pattern = format!("{}%", prefix);

        let rows = self.db.query_as::< CatalogTrendingTermRow>(&format!(
            r#"
            SELECT {}
            FROM appstore_catalog_trending_term
            WHERE tenant_id = ?
              AND locale = ?
              AND snapshot_date = (
                SELECT MAX(snapshot_date)
                FROM appstore_catalog_trending_term
                WHERE tenant_id = ? AND locale = ?
              )
              AND term LIKE ?
            ORDER BY rank ASC
            LIMIT ?
            "#,
            columns_csv(APPSTORE_CATALOG_TRENDING_TERM_COLUMNS)
        ))
        .bind(&context.tenant_id)
        .bind(locale_filter)
        .bind(&context.tenant_id)
        .bind(locale_filter)
        .bind(pattern)
        .bind(limit)
        .fetch_all(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(rows
            .into_iter()
            .map(|row| SearchSuggestion {
                text: row.term,
                suggestion_type: "trending".to_string(),
                listing_id: None,
            })
            .collect())
    }

    async fn find_trending_terms(
        &self,
        context: &AppstoreRequestContext,
        locale: Option<&str>,
        limit: i32,
    ) -> Result<Vec<TrendingTerm>, AppstoreServiceError> {
        let locale_filter = locale.unwrap_or("en-US");

        let rows = self.db.query_as::< CatalogTrendingTermRow>(&format!(
            r#"
            SELECT {}
            FROM appstore_catalog_trending_term
            WHERE tenant_id = ?
              AND locale = ?
              AND snapshot_date = (
                SELECT MAX(snapshot_date)
                FROM appstore_catalog_trending_term
                WHERE tenant_id = ? AND locale = ?
              )
            ORDER BY rank ASC
            LIMIT ?
            "#,
            columns_csv(APPSTORE_CATALOG_TRENDING_TERM_COLUMNS)
        ))
        .bind(&context.tenant_id)
        .bind(locale_filter)
        .bind(&context.tenant_id)
        .bind(locale_filter)
        .bind(limit)
        .fetch_all(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(rows
            .into_iter()
            .map(map_trending_term_row_to_domain)
            .collect())
    }

    async fn find_search_history(
        &self,
        context: &AppstoreRequestContext,
        user_id: &str,
        cursor: Option<&str>,
        limit: i32,
    ) -> Result<Vec<SearchHistoryEntry>, AppstoreServiceError> {
        let rows = if let Some(cursor_id) = cursor {
            self.db.query_as::< CatalogSearchHistoryRow>(&format!(
                r#"
                SELECT {}
                FROM appstore_catalog_search_history
                WHERE tenant_id = ? AND user_id = ?
                  AND (
                    created_at < (SELECT created_at FROM appstore_catalog_search_history WHERE id = ? AND tenant_id = ? AND user_id = ?)
                    OR (
                      created_at = (SELECT created_at FROM appstore_catalog_search_history WHERE id = ? AND tenant_id = ? AND user_id = ?)
                      AND id < ?
                    )
                  )
                ORDER BY created_at DESC, id DESC
                LIMIT ?
                "#,
                columns_csv(APPSTORE_CATALOG_SEARCH_HISTORY_COLUMNS)
            ))
            .bind(&context.tenant_id)
            .bind(user_id)
            .bind(cursor_id)
            .bind(&context.tenant_id)
            .bind(user_id)
            .bind(cursor_id)
            .bind(&context.tenant_id)
            .bind(user_id)
            .bind(cursor_id)
            .bind(limit)
            .fetch_all(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?
        } else {
            self.db.query_as::< CatalogSearchHistoryRow>(&format!(
                r#"
                SELECT {}
                FROM appstore_catalog_search_history
                WHERE tenant_id = ? AND user_id = ?
                ORDER BY created_at DESC, id DESC
                LIMIT ?
                "#,
                columns_csv(APPSTORE_CATALOG_SEARCH_HISTORY_COLUMNS)
            ))
            .bind(&context.tenant_id)
            .bind(user_id)
            .bind(limit)
            .fetch_all(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?
        };

        Ok(rows
            .into_iter()
            .map(map_search_history_row_to_domain)
            .collect())
    }

    async fn insert_search_history(
        &self,
        context: &AppstoreRequestContext,
        entry: &SearchHistoryEntry,
    ) -> Result<(), AppstoreServiceError> {
        self.db.query(
            r#"
            INSERT INTO appstore_catalog_search_history (
                id, tenant_id, user_id, query_text, filters_json, result_count, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&entry.id)
        .bind(&context.tenant_id)
        .bind(&entry.user_id)
        .bind(&entry.query_text)
        .bind(&entry.filters_json)
        .bind(entry.result_count)
        .bind(entry.created_at)
        .execute_unified(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn clear_search_history(
        &self,
        context: &AppstoreRequestContext,
        user_id: &str,
    ) -> Result<(), AppstoreServiceError> {
        self.db.query(
            r#"
            DELETE FROM appstore_catalog_search_history
            WHERE tenant_id = ? AND user_id = ?
            "#,
        )
        .bind(&context.tenant_id)
        .bind(user_id)
        .execute_unified(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn find_publisher_id_by_owner(
        &self,
        context: &AppstoreRequestContext,
        owner_user_id: &str,
    ) -> Result<Option<String>, AppstoreServiceError> {
        let row: Option<(String,)> = self
            .db
            .query_as::<(String,)>(
                r#"SELECT id FROM appstore_publisher
               WHERE tenant_id = ? AND owner_user_id = ? AND deleted_at IS NULL
               LIMIT 1"#,
            )
            .bind(&context.tenant_id)
            .bind(owner_user_id)
            .fetch_optional(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {e}")))?;

        Ok(row.map(|(id,)| id))
    }

    async fn aggregate_publisher_metrics(
        &self,
        context: &AppstoreRequestContext,
        publisher_id: &str,
        date_from: Option<&str>,
        date_to: Option<&str>,
    ) -> Result<PublisherAnalyticsOverview, AppstoreServiceError> {
        let mut sql = String::from(
            r#"
            SELECT
              COUNT(DISTINCT l.id) AS listing_count,
              COALESCE(SUM(m.impression_count), 0) AS total_impressions,
              COALESCE(SUM(m.detail_view_count), 0) AS total_detail_views,
              COALESCE(SUM(m.install_count), 0) AS total_installs,
              COALESCE(SUM(m.uninstall_count), 0) AS total_uninstalls,
              COALESCE(SUM(m.update_count), 0) AS total_updates
            FROM appstore_listing l
            LEFT JOIN appstore_listing_metric_snapshot m
              ON m.listing_id = l.id AND m.tenant_id = l.tenant_id
            WHERE l.tenant_id = ? AND l.publisher_id = ? AND l.deleted_at IS NULL
            "#,
        );

        if date_from.is_some() {
            sql.push_str(" AND (m.snapshot_date IS NULL OR m.snapshot_date >= ?)\n");
        }
        if date_to.is_some() {
            sql.push_str(" AND (m.snapshot_date IS NULL OR m.snapshot_date <= ?)\n");
        }

        let mut q = self
            .db
            .query_as::<(i64, i64, i64, i64, i64, i64)>(&self.db.adapt_sql(&sql))
            .bind(&context.tenant_id)
            .bind(publisher_id);

        if let Some(from) = date_from {
            q = q.bind(from);
        }
        if let Some(to) = date_to {
            q = q.bind(to);
        }

        let (
            listing_count,
            total_impressions,
            total_detail_views,
            total_installs,
            total_uninstalls,
            total_updates,
        ) = q
            .fetch_one(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {e}")))?;

        Ok(PublisherAnalyticsOverview {
            publisher_id: publisher_id.to_string(),
            listing_count: listing_count as i32,
            total_impressions,
            total_detail_views,
            total_installs,
            total_uninstalls,
            total_updates,
        })
    }

    async fn list_publisher_listing_metrics(
        &self,
        context: &AppstoreRequestContext,
        publisher_id: &str,
        date_from: Option<&str>,
        date_to: Option<&str>,
        cursor: Option<&str>,
        limit: i32,
    ) -> Result<Vec<PublisherListingMetricsSummary>, AppstoreServiceError> {
        let mut sql = String::from(
            r#"
            SELECT
              l.id,
              l.listing_slug,
              ll.display_name,
              COALESCE(SUM(m.impression_count), 0) AS impression_count,
              COALESCE(SUM(m.detail_view_count), 0) AS detail_view_count,
              COALESCE(SUM(m.install_count), 0) AS install_count,
              COALESCE(SUM(m.uninstall_count), 0) AS uninstall_count,
              COALESCE(SUM(m.update_count), 0) AS update_count
            FROM appstore_listing l
            LEFT JOIN appstore_listing_localization ll
              ON ll.listing_id = l.id AND ll.locale = l.default_locale AND ll.tenant_id = l.tenant_id
            LEFT JOIN appstore_listing_metric_snapshot m
              ON m.listing_id = l.id AND m.tenant_id = l.tenant_id
            WHERE l.tenant_id = ? AND l.publisher_id = ? AND l.deleted_at IS NULL
            "#,
        );

        if date_from.is_some() {
            sql.push_str(" AND (m.snapshot_date IS NULL OR m.snapshot_date >= ?)\n");
        }
        if date_to.is_some() {
            sql.push_str(" AND (m.snapshot_date IS NULL OR m.snapshot_date <= ?)\n");
        }
        if cursor.is_some() {
            sql.push_str(" AND l.id > ?\n");
        }
        sql.push_str(
            "GROUP BY l.id, l.listing_slug, ll.display_name\nORDER BY l.id ASC\nLIMIT ?\n",
        );

        let mut q =
            self.db.query_as::<(String, String, Option<String>, i64, i64, i64, i64, i64)>(&self.db.adapt_sql(&sql))
                .bind(&context.tenant_id)
                .bind(publisher_id);

        if let Some(from) = date_from {
            q = q.bind(from);
        }
        if let Some(to) = date_to {
            q = q.bind(to);
        }
        if let Some(cursor_id) = cursor {
            q = q.bind(cursor_id);
        }
        q = q.bind(limit);

        let rows = q
            .fetch_all(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {e}")))?;

        Ok(rows
            .into_iter()
            .map(
                |(
                    listing_id,
                    listing_slug,
                    display_name,
                    impression_count,
                    detail_view_count,
                    install_count,
                    uninstall_count,
                    update_count,
                )| PublisherListingMetricsSummary {
                    listing_id,
                    listing_slug,
                    display_name,
                    impression_count,
                    detail_view_count,
                    install_count,
                    uninstall_count,
                    update_count,
                },
            )
            .collect())
    }

    async fn listing_belongs_to_publisher(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &str,
        publisher_id: &str,
    ) -> Result<bool, AppstoreServiceError> {
        let row: Option<(i64,)> = self
            .db
            .query_as::<(i64,)>(
                r#"SELECT COUNT(*) FROM appstore_listing
               WHERE tenant_id = ? AND id = ? AND publisher_id = ? AND deleted_at IS NULL"#,
            )
            .bind(&context.tenant_id)
            .bind(listing_id)
            .bind(publisher_id)
            .fetch_optional(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {e}")))?;

        Ok(row.map(|(count,)| count > 0).unwrap_or(false))
    }

    async fn count_operator_dashboard_stats(
        &self,
        context: &AppstoreRequestContext,
    ) -> Result<OperatorDashboardStats, AppstoreServiceError> {
        let listing_count: (i64,) = self
            .db
            .query_as::<(i64,)>(
                r#"SELECT COUNT(*) FROM appstore_listing
               WHERE tenant_id = ? AND deleted_at IS NULL"#,
            )
            .bind(&context.tenant_id)
            .fetch_one(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {e}")))?;

        let publisher_count: (i64,) = self
            .db
            .query_as::<(i64,)>(
                r#"SELECT COUNT(*) FROM appstore_publisher
               WHERE tenant_id = ? AND deleted_at IS NULL"#,
            )
            .bind(&context.tenant_id)
            .fetch_one(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {e}")))?;

        let pending_review_count: (i64,) = self
            .db
            .query_as::<(i64,)>(
                r#"SELECT COUNT(*) FROM appstore_moderation_review
               WHERE tenant_id = ? AND review_status IN ('pending', 'in_review')"#,
            )
            .bind(&context.tenant_id)
            .fetch_one(&self.db)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {e}")))?;

        Ok(OperatorDashboardStats {
            listing_count: listing_count.0 as i32,
            publisher_count: publisher_count.0 as i32,
            pending_review_count: pending_review_count.0 as i32,
        })
    }

    async fn find_operator_search_analytics(
        &self,
        context: &AppstoreRequestContext,
        query: Option<&str>,
        date_from: Option<&str>,
        date_to: Option<&str>,
        limit: i32,
    ) -> Result<OperatorSearchAnalytics, AppstoreServiceError> {
        let mut sql = format!(
            r#"
            SELECT {}
            FROM appstore_catalog_search_history
            WHERE tenant_id = ?
            "#,
            columns_csv(APPSTORE_CATALOG_SEARCH_HISTORY_COLUMNS)
        );

        if query.is_some() {
            sql.push_str(" AND query_text LIKE ?\n");
        }
        if date_from.is_some() {
            sql.push_str(" AND created_at >= ?\n");
        }
        if date_to.is_some() {
            sql.push_str(" AND created_at <= ?\n");
        }
        sql.push_str("ORDER BY created_at DESC, id DESC\nLIMIT ?\n");

        let mut q = self
            .db
            .query_as::<CatalogSearchHistoryRow>(&self.db.adapt_sql(&sql))
            .bind(&context.tenant_id);

        if let Some(qs) = query {
            q = q.bind(format!("%{qs}%"));
        }
        if let Some(from) = date_from {
            q = q.bind(from);
        }
        if let Some(to) = date_to {
            q = q.bind(to);
        }
        q = q.bind(limit);

        let search_rows = q
            .fetch_all(&self.db)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {e}")))?;

        let trending_terms = self.find_trending_terms(context, None, limit).await?;

        Ok(OperatorSearchAnalytics {
            recent_searches: search_rows
                .into_iter()
                .map(map_search_history_row_to_domain)
                .collect(),
            trending_terms,
        })
    }
}
