use sqlx::{Pool, Sqlite};

use crate::db::rows::{CompliancePermissionDisclosureRow, ComplianceProfileRow};
use crate::mapper::row_mapper::{
    map_compliance_profile_domain_to_row, map_compliance_profile_row_to_domain,
    map_permission_disclosure_domain_to_row, map_permission_disclosure_row_to_domain,
};

use sdkwork_appstore_compliance_service::context::AppstoreRequestContext;
use sdkwork_appstore_compliance_service::domain::models::{
    CompliancePermissionDisclosure, ComplianceProfile, ComplianceProfileId,
};
use sdkwork_appstore_compliance_service::error::AppstoreServiceError;

#[derive(Debug, Clone)]
pub struct SqlxComplianceRepository {
    pool: Pool<Sqlite>,
}

impl SqlxComplianceRepository {
    pub fn new(pool: Pool<Sqlite>) -> Self {
        Self { pool }
    }
}

#[async_trait::async_trait]
impl sdkwork_appstore_compliance_service::ports::repository::ComplianceRepositoryPort
    for SqlxComplianceRepository
{
    async fn find_compliance_profile_by_listing(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &str,
    ) -> Result<
        Option<ComplianceProfile>,
        sdkwork_appstore_compliance_service::error::AppstoreServiceError,
    > {
        let row = sqlx::query_as::<_, ComplianceProfileRow>(
            r#"
            SELECT id, tenant_id, organization_id, listing_id, compliance_version,
                   privacy_nutrition_json, content_rating_questionnaire_json, data_safety_json,
                   target_audience_json, compliance_status, reviewed_by, reviewed_at,
                   created_at, updated_at
            FROM appstore_compliance_profile
            WHERE listing_id = ? AND tenant_id = ?
            ORDER BY compliance_version DESC
            LIMIT 1
            "#,
        )
        .bind(listing_id)
        .bind(&context.tenant_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_compliance_profile_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_compliance_profile_by_id(
        &self,
        context: &AppstoreRequestContext,
        profile_id: &ComplianceProfileId,
    ) -> Result<
        Option<ComplianceProfile>,
        sdkwork_appstore_compliance_service::error::AppstoreServiceError,
    > {
        let row = sqlx::query_as::<_, ComplianceProfileRow>(
            r#"
            SELECT id, tenant_id, organization_id, listing_id, compliance_version,
                   privacy_nutrition_json, content_rating_questionnaire_json, data_safety_json,
                   target_audience_json, compliance_status, reviewed_by, reviewed_at,
                   created_at, updated_at
            FROM appstore_compliance_profile
            WHERE id = ? AND tenant_id = ?
            "#,
        )
        .bind(profile_id.as_str())
        .bind(&context.tenant_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_compliance_profile_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn insert_compliance_profile(
        &self,
        context: &AppstoreRequestContext,
        profile: &ComplianceProfile,
    ) -> Result<(), sdkwork_appstore_compliance_service::error::AppstoreServiceError> {
        let (
            privacy_nutrition_json,
            content_rating_questionnaire_json,
            data_safety_json,
            target_audience_json,
            compliance_status,
        ) = map_compliance_profile_domain_to_row(profile);

        sqlx::query(
            r#"
            INSERT INTO appstore_compliance_profile (
                id, tenant_id, organization_id, listing_id, compliance_version,
                privacy_nutrition_json, content_rating_questionnaire_json, data_safety_json,
                target_audience_json, compliance_status, reviewed_by, reviewed_at,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(profile.id.as_str())
        .bind(&context.tenant_id)
        .bind(&context.organization_id)
        .bind(&profile.listing_id)
        .bind(profile.compliance_version)
        .bind(&privacy_nutrition_json)
        .bind(&content_rating_questionnaire_json)
        .bind(&data_safety_json)
        .bind(&target_audience_json)
        .bind(&compliance_status)
        .bind(&profile.reviewed_by)
        .bind(profile.reviewed_at)
        .bind(profile.created_at)
        .bind(profile.updated_at)
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn update_compliance_profile(
        &self,
        context: &AppstoreRequestContext,
        profile: &ComplianceProfile,
    ) -> Result<(), sdkwork_appstore_compliance_service::error::AppstoreServiceError> {
        let (
            privacy_nutrition_json,
            content_rating_questionnaire_json,
            data_safety_json,
            target_audience_json,
            compliance_status,
        ) = map_compliance_profile_domain_to_row(profile);

        sqlx::query(
            r#"
            UPDATE appstore_compliance_profile
            SET privacy_nutrition_json = ?, content_rating_questionnaire_json = ?,
                data_safety_json = ?, target_audience_json = ?, compliance_status = ?,
                reviewed_by = ?, reviewed_at = ?, updated_at = ?
            WHERE id = ? AND tenant_id = ?
            "#,
        )
        .bind(&privacy_nutrition_json)
        .bind(&content_rating_questionnaire_json)
        .bind(&data_safety_json)
        .bind(&target_audience_json)
        .bind(&compliance_status)
        .bind(&profile.reviewed_by)
        .bind(profile.reviewed_at)
        .bind(profile.updated_at)
        .bind(profile.id.as_str())
        .bind(&context.tenant_id)
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn find_permission_disclosures_by_listing(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &str,
    ) -> Result<
        Vec<CompliancePermissionDisclosure>,
        sdkwork_appstore_compliance_service::error::AppstoreServiceError,
    > {
        let rows = sqlx::query_as::<_, CompliancePermissionDisclosureRow>(
            r#"
            SELECT id, tenant_id, organization_id, listing_id, permission_code, usage_purpose,
                   is_required, disclosure_status, created_at, updated_at
            FROM appstore_compliance_permission_disclosure
            WHERE listing_id = ? AND tenant_id = ?
            ORDER BY permission_code ASC
            "#,
        )
        .bind(listing_id)
        .bind(&context.tenant_id)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        rows.into_iter()
            .map(map_permission_disclosure_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_permission_disclosure(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &str,
        permission_code: &str,
    ) -> Result<
        Option<CompliancePermissionDisclosure>,
        sdkwork_appstore_compliance_service::error::AppstoreServiceError,
    > {
        let row = sqlx::query_as::<_, CompliancePermissionDisclosureRow>(
            r#"
            SELECT id, tenant_id, organization_id, listing_id, permission_code, usage_purpose,
                   is_required, disclosure_status, created_at, updated_at
            FROM appstore_compliance_permission_disclosure
            WHERE listing_id = ? AND permission_code = ? AND tenant_id = ?
            "#,
        )
        .bind(listing_id)
        .bind(permission_code)
        .bind(&context.tenant_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_permission_disclosure_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn insert_permission_disclosure(
        &self,
        context: &AppstoreRequestContext,
        disclosure: &CompliancePermissionDisclosure,
    ) -> Result<(), sdkwork_appstore_compliance_service::error::AppstoreServiceError> {
        let (is_required, disclosure_status) = map_permission_disclosure_domain_to_row(disclosure);

        sqlx::query(
            r#"
            INSERT INTO appstore_compliance_permission_disclosure (
                id, tenant_id, organization_id, listing_id, permission_code, usage_purpose,
                is_required, disclosure_status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&disclosure.id)
        .bind(&context.tenant_id)
        .bind(&context.organization_id)
        .bind(&disclosure.listing_id)
        .bind(&disclosure.permission_code)
        .bind(&disclosure.usage_purpose)
        .bind(is_required)
        .bind(&disclosure_status)
        .bind(disclosure.created_at)
        .bind(disclosure.updated_at)
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn update_permission_disclosure(
        &self,
        context: &AppstoreRequestContext,
        disclosure: &CompliancePermissionDisclosure,
    ) -> Result<(), sdkwork_appstore_compliance_service::error::AppstoreServiceError> {
        let (is_required, disclosure_status) = map_permission_disclosure_domain_to_row(disclosure);

        sqlx::query(
            r#"
            UPDATE appstore_compliance_permission_disclosure
            SET usage_purpose = ?, is_required = ?, disclosure_status = ?, updated_at = ?
            WHERE id = ? AND tenant_id = ?
            "#,
        )
        .bind(&disclosure.usage_purpose)
        .bind(is_required)
        .bind(&disclosure_status)
        .bind(disclosure.updated_at)
        .bind(&disclosure.id)
        .bind(&context.tenant_id)
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }
}
