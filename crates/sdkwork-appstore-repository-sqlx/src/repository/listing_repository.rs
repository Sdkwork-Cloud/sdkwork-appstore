use sqlx::{Pool, Sqlite};

use crate::db::rows::{
    ListingCategoryBindingRow, ListingLocalizationRow, ListingMediaRow, ListingRow,
    ListingSubmissionRow, RegionalAvailabilityRow, ReleaseRow,
};
use crate::mapper::row_mapper::{
    map_category_binding_row_to_domain, map_listing_domain_to_row, map_listing_row_to_domain,
    map_localization_domain_to_row, map_localization_row_to_domain, map_media_domain_to_row,
    map_media_row_to_domain, map_regional_row_to_domain, map_submission_domain_to_row,
    map_submission_row_to_domain,
};

use sdkwork_appstore_listing_service::context::AppstoreRequestContext;
use sdkwork_appstore_listing_service::domain::models::{
    Listing, ListingCategoryBinding, ListingId, ListingLocalization, ListingMedia,
    ListingSubmission, RegionalAvailability,
};
use sdkwork_appstore_listing_service::error::AppstoreServiceError;
use sdkwork_appstore_listing_service::ports::repository::ListingRepositoryPort;

#[derive(Debug, Clone)]
pub struct SqlxListingRepository {
    pool: Pool<Sqlite>,
}

impl SqlxListingRepository {
    pub fn new(pool: Pool<Sqlite>) -> Self {
        Self { pool }
    }
}

const LISTING_COLUMNS: &str = r#"id, tenant_id, organization_id, app_id, publisher_id, listing_no,
    plus_app_id, plus_app_key, listing_slug, listing_type, pricing_model, listing_status,
    storefront_visibility, review_status, primary_category_id, default_locale, age_rating_code,
    content_rating_json, official_website_url, support_url, privacy_policy_url, comments_thread_id,
    commerce_product_id, current_release_id, featured_score, download_count, average_rating,
    rating_count, version, submitted_at, published_at, delisted_at, deleted_at, created_at, updated_at"#;

#[async_trait::async_trait]
impl ListingRepositoryPort for SqlxListingRepository {
    async fn find_listing_by_id(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &ListingId,
    ) -> Result<Option<Listing>, AppstoreServiceError> {
        let row = sqlx::query_as::<_, ListingRow>(&format!(
            r#"SELECT {} FROM appstore_listing WHERE id = ? AND tenant_id = ? AND deleted_at IS NULL"#,
            LISTING_COLUMNS
        ))
        .bind(listing_id.as_str())
        .bind(&context.tenant_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_listing_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_listing_by_slug(
        &self,
        _context: &AppstoreRequestContext,
        tenant_id: &str,
        listing_slug: &str,
    ) -> Result<Option<Listing>, AppstoreServiceError> {
        let row = sqlx::query_as::<_, ListingRow>(&format!(
            r#"SELECT {} FROM appstore_listing WHERE tenant_id = ? AND listing_slug = ? AND deleted_at IS NULL"#,
            LISTING_COLUMNS
        ))
        .bind(tenant_id)
        .bind(listing_slug)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_listing_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_listing_by_plus_app_id(
        &self,
        context: &AppstoreRequestContext,
        plus_app_id: &str,
    ) -> Result<Option<Listing>, AppstoreServiceError> {
        let row = sqlx::query_as::<_, ListingRow>(&format!(
            r#"SELECT {} FROM appstore_listing WHERE tenant_id = ? AND plus_app_id = ? AND deleted_at IS NULL"#,
            LISTING_COLUMNS
        ))
        .bind(&context.tenant_id)
        .bind(plus_app_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_listing_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_listings_by_publisher(
        &self,
        context: &AppstoreRequestContext,
        publisher_id: &str,
        cursor: Option<&str>,
        limit: i32,
    ) -> Result<Vec<Listing>, AppstoreServiceError> {
        let rows = if let Some(cursor_id) = cursor {
            sqlx::query_as::<_, ListingRow>(&format!(
                r#"SELECT {} FROM appstore_listing
                WHERE tenant_id = ? AND publisher_id = ? AND deleted_at IS NULL AND id > ?
                ORDER BY id ASC LIMIT ?"#,
                LISTING_COLUMNS
            ))
            .bind(&context.tenant_id)
            .bind(publisher_id)
            .bind(cursor_id)
            .bind(limit)
            .fetch_all(&self.pool)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?
        } else {
            sqlx::query_as::<_, ListingRow>(&format!(
                r#"SELECT {} FROM appstore_listing
                WHERE tenant_id = ? AND publisher_id = ? AND deleted_at IS NULL
                ORDER BY id ASC LIMIT ?"#,
                LISTING_COLUMNS
            ))
            .bind(&context.tenant_id)
            .bind(publisher_id)
            .bind(limit)
            .fetch_all(&self.pool)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?
        };

        rows.into_iter()
            .map(map_listing_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn insert_listing(
        &self,
        context: &AppstoreRequestContext,
        listing: &Listing,
    ) -> Result<(), AppstoreServiceError> {
        let (
            listing_type,
            pricing_model,
            listing_status,
            storefront_visibility,
            review_status,
            content_rating_json,
        ) = map_listing_domain_to_row(listing);

        sqlx::query(
            r#"INSERT INTO appstore_listing (
                id, tenant_id, organization_id, app_id, publisher_id, listing_no,
                plus_app_id, plus_app_key, listing_slug, listing_type, pricing_model,
                listing_status, storefront_visibility, review_status, primary_category_id,
                default_locale, age_rating_code, content_rating_json, official_website_url,
                support_url, privacy_policy_url, comments_thread_id, commerce_product_id,
                current_release_id, featured_score, download_count, average_rating,
                rating_count, version, submitted_at, published_at, delisted_at, deleted_at,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"#,
        )
        .bind(listing.id.as_str())
        .bind(&context.tenant_id)
        .bind(&context.organization_id)
        .bind(&listing.app_id)
        .bind(&listing.publisher_id)
        .bind(&listing.listing_no)
        .bind(&listing.plus_app_id)
        .bind(&listing.plus_app_key)
        .bind(&listing.listing_slug)
        .bind(&listing_type)
        .bind(&pricing_model)
        .bind(&listing_status)
        .bind(&storefront_visibility)
        .bind(&review_status)
        .bind(&listing.primary_category_id)
        .bind(&listing.default_locale)
        .bind(&listing.age_rating_code)
        .bind(&content_rating_json)
        .bind(&listing.official_website_url)
        .bind(&listing.support_url)
        .bind(&listing.privacy_policy_url)
        .bind(&listing.comments_thread_id)
        .bind(&listing.commerce_product_id)
        .bind(&listing.current_release_id)
        .bind(listing.featured_score)
        .bind(listing.download_count)
        .bind(&listing.average_rating)
        .bind(listing.rating_count)
        .bind(listing.version)
        .bind(listing.submitted_at)
        .bind(listing.published_at)
        .bind(listing.delisted_at)
        .bind(listing.deleted_at)
        .bind(listing.created_at)
        .bind(listing.updated_at)
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn update_listing(
        &self,
        context: &AppstoreRequestContext,
        listing: &Listing,
    ) -> Result<(), AppstoreServiceError> {
        let (
            _listing_type,
            pricing_model,
            listing_status,
            storefront_visibility,
            review_status,
            content_rating_json,
        ) = map_listing_domain_to_row(listing);

        let result = sqlx::query(
            r#"UPDATE appstore_listing SET
                app_id = ?, listing_no = ?, plus_app_id = ?, plus_app_key = ?,
                listing_slug = ?, pricing_model = ?, listing_status = ?,
                storefront_visibility = ?, review_status = ?, primary_category_id = ?,
                default_locale = ?, age_rating_code = ?, content_rating_json = ?,
                official_website_url = ?, support_url = ?, privacy_policy_url = ?,
                comments_thread_id = ?, commerce_product_id = ?, current_release_id = ?,
                featured_score = ?, download_count = ?, average_rating = ?,
                rating_count = ?, version = ?, submitted_at = ?, published_at = ?,
                delisted_at = ?, deleted_at = ?, updated_at = ?
            WHERE id = ? AND tenant_id = ? AND version = ?"#,
        )
        .bind(&listing.app_id)
        .bind(&listing.listing_no)
        .bind(&listing.plus_app_id)
        .bind(&listing.plus_app_key)
        .bind(&listing.listing_slug)
        .bind(&pricing_model)
        .bind(&listing_status)
        .bind(&storefront_visibility)
        .bind(&review_status)
        .bind(&listing.primary_category_id)
        .bind(&listing.default_locale)
        .bind(&listing.age_rating_code)
        .bind(&content_rating_json)
        .bind(&listing.official_website_url)
        .bind(&listing.support_url)
        .bind(&listing.privacy_policy_url)
        .bind(&listing.comments_thread_id)
        .bind(&listing.commerce_product_id)
        .bind(&listing.current_release_id)
        .bind(listing.featured_score)
        .bind(listing.download_count)
        .bind(&listing.average_rating)
        .bind(listing.rating_count)
        .bind(listing.version)
        .bind(listing.submitted_at)
        .bind(listing.published_at)
        .bind(listing.delisted_at)
        .bind(listing.deleted_at)
        .bind(listing.updated_at)
        .bind(listing.id.as_str())
        .bind(&context.tenant_id)
        .bind(listing.version - 1)
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        if result.rows_affected() == 0 {
            return Err(AppstoreServiceError::Conflict(
                "Listing was modified by another request".to_string(),
            ));
        }

        Ok(())
    }

    async fn find_localization(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &ListingId,
        locale: &str,
    ) -> Result<Option<ListingLocalization>, AppstoreServiceError> {
        let row = sqlx::query_as::<_, ListingLocalizationRow>(
            r#"SELECT id, tenant_id, organization_id, listing_id, locale, display_name,
                subtitle, short_description, full_description, whats_new_summary,
                keywords_json, created_at, updated_at
            FROM appstore_listing_localization
            WHERE tenant_id = ? AND listing_id = ? AND locale = ?"#,
        )
        .bind(&context.tenant_id)
        .bind(listing_id.as_str())
        .bind(locale)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_localization_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn upsert_localization(
        &self,
        context: &AppstoreRequestContext,
        localization: &ListingLocalization,
    ) -> Result<(), AppstoreServiceError> {
        let keywords_json = map_localization_domain_to_row(localization);

        sqlx::query(
            r#"INSERT INTO appstore_listing_localization (
                id, tenant_id, organization_id, listing_id, locale, display_name,
                subtitle, short_description, full_description, whats_new_summary,
                keywords_json, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (tenant_id, listing_id, locale) DO UPDATE SET
                display_name = excluded.display_name,
                subtitle = excluded.subtitle,
                short_description = excluded.short_description,
                full_description = excluded.full_description,
                whats_new_summary = excluded.whats_new_summary,
                keywords_json = excluded.keywords_json,
                updated_at = excluded.updated_at"#,
        )
        .bind(&localization.id)
        .bind(&context.tenant_id)
        .bind(&context.organization_id)
        .bind(localization.listing_id.as_str())
        .bind(&localization.locale)
        .bind(&localization.display_name)
        .bind(&localization.subtitle)
        .bind(&localization.short_description)
        .bind(&localization.full_description)
        .bind(&localization.whats_new_summary)
        .bind(&keywords_json)
        .bind(localization.created_at)
        .bind(localization.updated_at)
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn find_media_by_listing(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &ListingId,
    ) -> Result<Vec<ListingMedia>, AppstoreServiceError> {
        let rows = sqlx::query_as::<_, ListingMediaRow>(
            r#"SELECT id, tenant_id, organization_id, listing_id, media_role, media_resource_id,
                drive_node_id, platform_scope, sort_order, locale, created_at, updated_at
            FROM appstore_listing_media
            WHERE tenant_id = ? AND listing_id = ?
            ORDER BY sort_order ASC"#,
        )
        .bind(&context.tenant_id)
        .bind(listing_id.as_str())
        .fetch_all(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        rows.into_iter()
            .map(map_media_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_media_by_id(
        &self,
        context: &AppstoreRequestContext,
        media_id: &str,
    ) -> Result<Option<ListingMedia>, AppstoreServiceError> {
        let row = sqlx::query_as::<_, ListingMediaRow>(
            r#"SELECT id, tenant_id, organization_id, listing_id, media_role, media_resource_id,
                drive_node_id, platform_scope, sort_order, locale, created_at, updated_at
            FROM appstore_listing_media
            WHERE tenant_id = ? AND id = ?"#,
        )
        .bind(&context.tenant_id)
        .bind(media_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_media_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn insert_media(
        &self,
        context: &AppstoreRequestContext,
        media: &ListingMedia,
    ) -> Result<(), AppstoreServiceError> {
        let media_role = map_media_domain_to_row(media);

        sqlx::query(
            r#"INSERT INTO appstore_listing_media (
                id, tenant_id, organization_id, listing_id, media_role, media_resource_id,
                drive_node_id, platform_scope, sort_order, locale, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"#,
        )
        .bind(&media.id)
        .bind(&context.tenant_id)
        .bind(&context.organization_id)
        .bind(media.listing_id.as_str())
        .bind(&media_role)
        .bind(&media.media_resource_id)
        .bind(&media.drive_node_id)
        .bind(&media.platform_scope)
        .bind(media.sort_order)
        .bind(&media.locale)
        .bind(media.created_at)
        .bind(media.updated_at)
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn delete_media(
        &self,
        context: &AppstoreRequestContext,
        media_id: &str,
    ) -> Result<(), AppstoreServiceError> {
        sqlx::query(r#"DELETE FROM appstore_listing_media WHERE tenant_id = ? AND id = ?"#)
            .bind(&context.tenant_id)
            .bind(media_id)
            .execute(&self.pool)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn find_category_bindings(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &ListingId,
    ) -> Result<Vec<ListingCategoryBinding>, AppstoreServiceError> {
        let rows = sqlx::query_as::<_, ListingCategoryBindingRow>(
            r#"SELECT id, tenant_id, listing_id, category_id, is_primary, created_at
            FROM appstore_listing_category_binding
            WHERE tenant_id = ? AND listing_id = ?"#,
        )
        .bind(&context.tenant_id)
        .bind(listing_id.as_str())
        .fetch_all(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        rows.into_iter()
            .map(map_category_binding_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn replace_category_bindings(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &ListingId,
        bindings: &[ListingCategoryBinding],
    ) -> Result<(), AppstoreServiceError> {
        let mut tx = self
            .pool
            .begin()
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        sqlx::query(
            r#"DELETE FROM appstore_listing_category_binding WHERE tenant_id = ? AND listing_id = ?"#,
        )
        .bind(&context.tenant_id)
        .bind(listing_id.as_str())
        .execute(&mut *tx)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        for binding in bindings {
            sqlx::query(
                r#"INSERT INTO appstore_listing_category_binding
                (id, tenant_id, listing_id, category_id, is_primary, created_at)
                VALUES (?, ?, ?, ?, ?, ?)"#,
            )
            .bind(&binding.id)
            .bind(&context.tenant_id)
            .bind(binding.listing_id.as_str())
            .bind(&binding.category_id)
            .bind(if binding.is_primary { 1 } else { 0 })
            .bind(binding.created_at)
            .execute(&mut *tx)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;
        }

        tx.commit()
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn find_regional_availability(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &ListingId,
    ) -> Result<Vec<RegionalAvailability>, AppstoreServiceError> {
        let rows = sqlx::query_as::<_, RegionalAvailabilityRow>(
            r#"SELECT id, tenant_id, organization_id, listing_id, region_code,
                availability_status, effective_at, expires_at, created_at, updated_at
            FROM appstore_regional_availability
            WHERE tenant_id = ? AND listing_id = ?"#,
        )
        .bind(&context.tenant_id)
        .bind(listing_id.as_str())
        .fetch_all(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        rows.into_iter()
            .map(map_regional_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn replace_regional_availability(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &ListingId,
        availabilities: &[RegionalAvailability],
    ) -> Result<(), AppstoreServiceError> {
        let mut tx = self
            .pool
            .begin()
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        sqlx::query(
            r#"DELETE FROM appstore_regional_availability WHERE tenant_id = ? AND listing_id = ?"#,
        )
        .bind(&context.tenant_id)
        .bind(listing_id.as_str())
        .execute(&mut *tx)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        for avail in availabilities {
            sqlx::query(
                r#"INSERT INTO appstore_regional_availability
                (id, tenant_id, organization_id, listing_id, region_code,
                 availability_status, effective_at, expires_at, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"#,
            )
            .bind(&avail.id)
            .bind(&context.tenant_id)
            .bind(&context.organization_id)
            .bind(avail.listing_id.as_str())
            .bind(&avail.region_code)
            .bind(&avail.availability_status)
            .bind(avail.effective_at)
            .bind(avail.expires_at)
            .bind(avail.created_at)
            .bind(avail.updated_at)
            .execute(&mut *tx)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;
        }

        tx.commit()
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn find_releases_by_listing(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &ListingId,
        cursor: Option<&str>,
        limit: i32,
    ) -> Result<Vec<serde_json::Value>, AppstoreServiceError> {
        let release_cols = r#"id, tenant_id, organization_id, listing_id, release_no, channel_id,
            version_name, version_code, build_number, release_status, minimum_os_version,
            release_notes_default_locale, manifest_snapshot_json, submitted_at, approved_at,
            published_at, retired_at, version, created_at, updated_at"#;

        let rows = if let Some(cursor_id) = cursor {
            sqlx::query_as::<_, ReleaseRow>(&format!(
                r#"SELECT {} FROM appstore_release
                WHERE tenant_id = ? AND listing_id = ? AND id > ?
                ORDER BY id ASC LIMIT ?"#,
                release_cols
            ))
            .bind(&context.tenant_id)
            .bind(listing_id.as_str())
            .bind(cursor_id)
            .bind(limit)
            .fetch_all(&self.pool)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?
        } else {
            sqlx::query_as::<_, ReleaseRow>(&format!(
                r#"SELECT {} FROM appstore_release
                WHERE tenant_id = ? AND listing_id = ?
                ORDER BY id ASC LIMIT ?"#,
                release_cols
            ))
            .bind(&context.tenant_id)
            .bind(listing_id.as_str())
            .bind(limit)
            .fetch_all(&self.pool)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?
        };

        let values: Vec<serde_json::Value> = rows
            .into_iter()
            .map(|r| {
                serde_json::json!({
                    "id": r.id,
                    "tenant_id": r.tenant_id,
                    "organization_id": r.organization_id,
                    "listing_id": r.listing_id,
                    "release_no": r.release_no,
                    "channel_id": r.channel_id,
                    "version_name": r.version_name,
                    "version_code": r.version_code,
                    "build_number": r.build_number,
                    "release_status": r.release_status,
                    "minimum_os_version": r.minimum_os_version,
                    "release_notes_default_locale": r.release_notes_default_locale,
                    "manifest_snapshot_json": r.manifest_snapshot_json,
                    "submitted_at": r.submitted_at,
                    "approved_at": r.approved_at,
                    "published_at": r.published_at,
                    "retired_at": r.retired_at,
                    "version": r.version,
                    "created_at": r.created_at,
                    "updated_at": r.updated_at,
                })
            })
            .collect();

        Ok(values)
    }

    async fn insert_submission(
        &self,
        context: &AppstoreRequestContext,
        submission: &ListingSubmission,
    ) -> Result<(), AppstoreServiceError> {
        let (submission_type, submission_status, payload_snapshot_json) =
            map_submission_domain_to_row(submission);

        sqlx::query(
            r#"INSERT INTO appstore_listing_submission (
                id, tenant_id, organization_id, listing_id, release_id, submission_no,
                submission_type, submission_status, submitted_by, submitted_at,
                payload_snapshot_json, idempotency_key, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"#,
        )
        .bind(&submission.id)
        .bind(&context.tenant_id)
        .bind(&context.organization_id)
        .bind(submission.listing_id.as_str())
        .bind(&submission.release_id)
        .bind(&submission.submission_no)
        .bind(&submission_type)
        .bind(&submission_status)
        .bind(&submission.submitted_by)
        .bind(submission.submitted_at)
        .bind(&payload_snapshot_json)
        .bind(&submission.idempotency_key)
        .bind(submission.created_at)
        .bind(submission.updated_at)
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn find_submissions_by_listing(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &ListingId,
    ) -> Result<Vec<ListingSubmission>, AppstoreServiceError> {
        let rows = sqlx::query_as::<_, ListingSubmissionRow>(
            r#"SELECT id, tenant_id, organization_id, listing_id, release_id, submission_no,
                submission_type, submission_status, submitted_by, submitted_at,
                payload_snapshot_json, idempotency_key, created_at, updated_at
            FROM appstore_listing_submission
            WHERE tenant_id = ? AND listing_id = ?
            ORDER BY created_at DESC"#,
        )
        .bind(&context.tenant_id)
        .bind(listing_id.as_str())
        .fetch_all(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        rows.into_iter()
            .map(map_submission_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn admin_list_listings(
        &self,
        context: &AppstoreRequestContext,
        status_filter: Option<&str>,
        review_status_filter: Option<&str>,
        publisher_id: Option<&str>,
        cursor: Option<&str>,
        limit: i32,
    ) -> Result<Vec<Listing>, AppstoreServiceError> {
        let mut sql = format!(
            r#"SELECT {} FROM appstore_listing WHERE tenant_id = ? AND deleted_at IS NULL"#,
            LISTING_COLUMNS
        );

        if status_filter.is_some() {
            sql.push_str(&format!(" AND listing_status = ?"));
        }
        if review_status_filter.is_some() {
            sql.push_str(&format!(" AND review_status = ?"));
        }
        if publisher_id.is_some() {
            sql.push_str(&format!(" AND publisher_id = ?"));
        }
        if cursor.is_some() {
            sql.push_str(&format!(" AND id > ?"));
        }
        sql.push_str(" ORDER BY id ASC LIMIT ?");

        let mut query = sqlx::query_as::<_, ListingRow>(&sql);
        query = query.bind(&context.tenant_id);
        if let Some(s) = status_filter {
            query = query.bind(s);
        }
        if let Some(s) = review_status_filter {
            query = query.bind(s);
        }
        if let Some(s) = publisher_id {
            query = query.bind(s);
        }
        if let Some(c) = cursor {
            query = query.bind(c);
        }
        query = query.bind(limit);

        let rows = query
            .fetch_all(&self.pool)
            .await
            .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        rows.into_iter()
            .map(map_listing_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }
}
