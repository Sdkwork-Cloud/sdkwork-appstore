use sqlx::{Pool, Sqlite};

use crate::db::rows::{
    CatalogChartSnapshotRow, CatalogCollectionItemRow, CatalogCollectionLocalizationRow,
    CatalogCollectionRow, CatalogFeaturedSlotRow, CategoryLocalizationRow, CategoryRow,
    ListingMetricSnapshotRow, ListingSearchRow,
};
use crate::mapper::row_mapper::{
    map_category_domain_to_row, map_category_localization_row_to_domain,
    map_category_row_to_domain, map_chart_snapshot_row_to_domain, map_collection_domain_to_row,
    map_collection_item_domain_to_row, map_collection_item_row_to_domain,
    map_collection_localization_row_to_domain, map_collection_row_to_domain,
    map_featured_slot_domain_to_row, map_featured_slot_row_to_domain,
    map_listing_search_row_to_domain, map_metric_snapshot_row_to_domain,
};

use sdkwork_appstore_catalog_service::context::AppstoreRequestContext;
use sdkwork_appstore_catalog_service::domain::models::{
    CatalogChartSnapshot, CatalogCollection, CatalogCollectionItem, CatalogCollectionLocalization,
    CatalogFeaturedSlot, Category, CategoryId, CategoryLocalization, CollectionId,
    ListingMetricSnapshot, ListingSummary,
};
use sdkwork_appstore_catalog_service::error::AppstoreServiceError;
use sdkwork_appstore_catalog_service::ports::repository::CatalogRepositoryPort;

#[derive(Debug, Clone)]
pub struct SqlxCatalogRepository {
    pool: Pool<Sqlite>,
}

impl SqlxCatalogRepository {
    pub fn new(pool: Pool<Sqlite>) -> Self {
        Self { pool }
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
            sqlx::query_as::<_, CategoryRow>(
                r#"
                SELECT id, tenant_id, category_code, parent_category_id, category_level,
                       category_status, sort_order, icon_media_resource_id, created_at, updated_at
                FROM appstore_category
                WHERE tenant_id = ? AND category_status != 'deleted' AND id > ?
                ORDER BY id ASC
                LIMIT ?
                "#,
            )
            .bind(&context.tenant_id)
            .bind(cursor_id)
            .bind(limit)
            .fetch_all(&self.pool)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?
        } else {
            sqlx::query_as::<_, CategoryRow>(
                r#"
                SELECT id, tenant_id, category_code, parent_category_id, category_level,
                       category_status, sort_order, icon_media_resource_id, created_at, updated_at
                FROM appstore_category
                WHERE tenant_id = ? AND category_status != 'deleted'
                ORDER BY id ASC
                LIMIT ?
                "#,
            )
            .bind(&context.tenant_id)
            .bind(limit)
            .fetch_all(&self.pool)
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
        let row = sqlx::query_as::<_, CategoryRow>(
            r#"
            SELECT id, tenant_id, category_code, parent_category_id, category_level,
                   category_status, sort_order, icon_media_resource_id, created_at, updated_at
            FROM appstore_category
            WHERE id = ? AND tenant_id = ? AND category_status != 'deleted'
            "#,
        )
        .bind(category_id.as_str())
        .bind(&context.tenant_id)
        .fetch_optional(&self.pool)
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
        let row = sqlx::query_as::<_, CategoryRow>(
            r#"
            SELECT id, tenant_id, category_code, parent_category_id, category_level,
                   category_status, sort_order, icon_media_resource_id, created_at, updated_at
            FROM appstore_category
            WHERE category_code = ? AND tenant_id = ? AND category_status != 'deleted'
            "#,
        )
        .bind(category_code)
        .bind(&context.tenant_id)
        .fetch_optional(&self.pool)
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
        let rows = sqlx::query_as::<_, CategoryLocalizationRow>(
            r#"
            SELECT id, tenant_id, category_id, locale, display_name, description, created_at, updated_at
            FROM appstore_category_localization
            WHERE category_id = ? AND tenant_id = ?
            "#,
        )
        .bind(category_id.as_str())
        .bind(&context.tenant_id)
        .fetch_all(&self.pool)
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

        sqlx::query(
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
        .execute(&self.pool)
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

        sqlx::query(
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
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn upsert_category_localization(
        &self,
        context: &AppstoreRequestContext,
        localization: &CategoryLocalization,
    ) -> Result<(), AppstoreServiceError> {
        sqlx::query(
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
        .execute(&self.pool)
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
            sqlx::query_as::<_, CatalogCollectionRow>(
                r#"
                SELECT id, tenant_id, collection_code, collection_type, collection_status,
                       audience_scope, sort_order, cover_media_resource_id, starts_at, ends_at,
                       created_at, updated_at
                FROM appstore_catalog_collection
                WHERE tenant_id = ? AND collection_status != 'archived' AND id > ?
                ORDER BY id ASC
                LIMIT ?
                "#,
            )
            .bind(&context.tenant_id)
            .bind(cursor_id)
            .bind(limit)
            .fetch_all(&self.pool)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?
        } else {
            sqlx::query_as::<_, CatalogCollectionRow>(
                r#"
                SELECT id, tenant_id, collection_code, collection_type, collection_status,
                       audience_scope, sort_order, cover_media_resource_id, starts_at, ends_at,
                       created_at, updated_at
                FROM appstore_catalog_collection
                WHERE tenant_id = ? AND collection_status != 'archived'
                ORDER BY id ASC
                LIMIT ?
                "#,
            )
            .bind(&context.tenant_id)
            .bind(limit)
            .fetch_all(&self.pool)
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
        let row = sqlx::query_as::<_, CatalogCollectionRow>(
            r#"
            SELECT id, tenant_id, collection_code, collection_type, collection_status,
                   audience_scope, sort_order, cover_media_resource_id, starts_at, ends_at,
                   created_at, updated_at
            FROM appstore_catalog_collection
            WHERE id = ? AND tenant_id = ?
            "#,
        )
        .bind(collection_id.as_str())
        .bind(&context.tenant_id)
        .fetch_optional(&self.pool)
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
        let row = sqlx::query_as::<_, CatalogCollectionRow>(
            r#"
            SELECT id, tenant_id, collection_code, collection_type, collection_status,
                   audience_scope, sort_order, cover_media_resource_id, starts_at, ends_at,
                   created_at, updated_at
            FROM appstore_catalog_collection
            WHERE collection_code = ? AND tenant_id = ?
            "#,
        )
        .bind(collection_code)
        .bind(&context.tenant_id)
        .fetch_optional(&self.pool)
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
        let rows = sqlx::query_as::<_, CatalogCollectionLocalizationRow>(
            r#"
            SELECT id, tenant_id, collection_id, locale, display_name, description, created_at, updated_at
            FROM appstore_catalog_collection_localization
            WHERE collection_id = ? AND tenant_id = ?
            "#,
        )
        .bind(collection_id.as_str())
        .bind(&context.tenant_id)
        .fetch_all(&self.pool)
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
        let rows = sqlx::query_as::<_, CatalogCollectionItemRow>(
            r#"
            SELECT id, tenant_id, collection_id, listing_id, sort_order,
                   highlight_json, starts_at, ends_at, created_at
            FROM appstore_catalog_collection_item
            WHERE collection_id = ? AND tenant_id = ?
            ORDER BY sort_order ASC
            "#,
        )
        .bind(collection_id.as_str())
        .bind(&context.tenant_id)
        .fetch_all(&self.pool)
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

        sqlx::query(
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
        .execute(&self.pool)
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

        sqlx::query(
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
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn upsert_collection_localization(
        &self,
        context: &AppstoreRequestContext,
        localization: &CatalogCollectionLocalization,
    ) -> Result<(), AppstoreServiceError> {
        sqlx::query(
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
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn delete_collection_items(
        &self,
        context: &AppstoreRequestContext,
        collection_id: &CollectionId,
    ) -> Result<(), AppstoreServiceError> {
        sqlx::query(
            r#"
            DELETE FROM appstore_catalog_collection_item
            WHERE collection_id = ? AND tenant_id = ?
            "#,
        )
        .bind(collection_id.as_str())
        .bind(&context.tenant_id)
        .execute(&self.pool)
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

        sqlx::query(
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
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn find_featured_slots(
        &self,
        context: &AppstoreRequestContext,
    ) -> Result<Vec<CatalogFeaturedSlot>, AppstoreServiceError> {
        let rows = sqlx::query_as::<_, CatalogFeaturedSlotRow>(
            r#"
            SELECT id, tenant_id, slot_code, listing_id, slot_status, audience_scope,
                   platform_scope, region_scope_json, starts_at, ends_at, created_at, updated_at
            FROM appstore_catalog_featured_slot
            WHERE tenant_id = ? AND slot_status = 'active'
            ORDER BY starts_at DESC
            "#,
        )
        .bind(&context.tenant_id)
        .fetch_all(&self.pool)
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
        let row = sqlx::query_as::<_, CatalogFeaturedSlotRow>(
            r#"
            SELECT id, tenant_id, slot_code, listing_id, slot_status, audience_scope,
                   platform_scope, region_scope_json, starts_at, ends_at, created_at, updated_at
            FROM appstore_catalog_featured_slot
            WHERE slot_code = ? AND tenant_id = ? AND slot_status = 'active'
            ORDER BY starts_at DESC
            LIMIT 1
            "#,
        )
        .bind(slot_code)
        .bind(&context.tenant_id)
        .fetch_optional(&self.pool)
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

        sqlx::query(
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
        .execute(&self.pool)
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
        let row = sqlx::query_as::<_, CatalogChartSnapshotRow>(
            r#"
            SELECT id, tenant_id, chart_code, snapshot_date, locale, platform_scope,
                   ranking_json, generated_at, created_at
            FROM appstore_catalog_chart_snapshot
            WHERE chart_code = ? AND snapshot_date = ? AND locale = ? AND platform_scope = ?
                  AND tenant_id = ?
            "#,
        )
        .bind(chart_code)
        .bind(snapshot_date)
        .bind(locale)
        .bind(platform_scope)
        .bind(&context.tenant_id)
        .fetch_optional(&self.pool)
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
        let row = sqlx::query_as::<_, CatalogChartSnapshotRow>(
            r#"
            SELECT id, tenant_id, chart_code, snapshot_date, locale, platform_scope,
                   ranking_json, generated_at, created_at
            FROM appstore_catalog_chart_snapshot
            WHERE chart_code = ? AND locale = ? AND platform_scope = ? AND tenant_id = ?
            ORDER BY snapshot_date DESC
            LIMIT 1
            "#,
        )
        .bind(chart_code)
        .bind(locale)
        .bind(platform_scope)
        .bind(&context.tenant_id)
        .fetch_optional(&self.pool)
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
            SELECT l.id, l.plus_app_id, l.plus_app_key, ll.display_name, ll.subtitle,
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

        let mut q = sqlx::query_as::<_, ListingSearchRow>(&sql).bind(&context.tenant_id);

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
            .fetch_all(&self.pool)
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
        let mut sql = String::from(
            r#"
            SELECT id, tenant_id, listing_id, snapshot_date, impression_count,
                   detail_view_count, install_count, uninstall_count, update_count,
                   conversion_rate, created_at
            FROM appstore_listing_metric_snapshot
            WHERE listing_id = ? AND tenant_id = ?
            "#,
        );

        if start_date.is_some() {
            sql.push_str("  AND snapshot_date >= ?\n");
        }
        if end_date.is_some() {
            sql.push_str("  AND snapshot_date <= ?\n");
        }
        sql.push_str("ORDER BY snapshot_date ASC\n");

        let mut q = sqlx::query_as::<_, ListingMetricSnapshotRow>(&sql)
            .bind(listing_id)
            .bind(&context.tenant_id);

        if let Some(sd) = start_date {
            q = q.bind(sd);
        }
        if let Some(ed) = end_date {
            q = q.bind(ed);
        }

        let rows = q
            .fetch_all(&self.pool)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        rows.into_iter()
            .map(map_metric_snapshot_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }
}
