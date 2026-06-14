use sqlx::{Pool, Sqlite};

use crate::db::rows::{ModerationDecisionRow, ModerationReviewRow};
use crate::mapper::row_mapper::{
    map_moderation_decision_domain_to_row, map_moderation_decision_row_to_domain,
    map_moderation_review_domain_to_row, map_moderation_review_row_to_domain,
};

use sdkwork_appstore_moderation_service::context::AppstoreRequestContext;
use sdkwork_appstore_moderation_service::domain::models::{
    ModerationDecision, ModerationDecisionId, ModerationReview, ModerationReviewId,
};
use sdkwork_appstore_moderation_service::error::AppstoreServiceError;

#[derive(Debug, Clone)]
pub struct SqlxModerationRepository {
    pool: Pool<Sqlite>,
}

impl SqlxModerationRepository {
    pub fn new(pool: Pool<Sqlite>) -> Self {
        Self { pool }
    }
}

#[async_trait::async_trait]
impl sdkwork_appstore_moderation_service::ports::repository::ModerationRepositoryPort
    for SqlxModerationRepository
{
    async fn find_review_by_id(
        &self,
        context: &AppstoreRequestContext,
        review_id: &ModerationReviewId,
    ) -> Result<
        Option<ModerationReview>,
        sdkwork_appstore_moderation_service::error::AppstoreServiceError,
    > {
        let row = sqlx::query_as::<_, ModerationReviewRow>(
            r#"
            SELECT id, tenant_id, organization_id, submission_id, review_no, review_status,
                   priority, assigned_to, queue_code, sla_due_at, started_at, completed_at,
                   created_at, updated_at
            FROM appstore_moderation_review
            WHERE id = ? AND tenant_id = ?
            "#,
        )
        .bind(review_id.as_str())
        .bind(&context.tenant_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_moderation_review_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_review_by_submission(
        &self,
        context: &AppstoreRequestContext,
        submission_id: &str,
    ) -> Result<
        Option<ModerationReview>,
        sdkwork_appstore_moderation_service::error::AppstoreServiceError,
    > {
        let row = sqlx::query_as::<_, ModerationReviewRow>(
            r#"
            SELECT id, tenant_id, organization_id, submission_id, review_no, review_status,
                   priority, assigned_to, queue_code, sla_due_at, started_at, completed_at,
                   created_at, updated_at
            FROM appstore_moderation_review
            WHERE submission_id = ? AND tenant_id = ?
            "#,
        )
        .bind(submission_id)
        .bind(&context.tenant_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_moderation_review_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn list_reviews(
        &self,
        context: &AppstoreRequestContext,
        review_status: Option<&str>,
        cursor: Option<&str>,
        limit: i32,
    ) -> Result<
        Vec<ModerationReview>,
        sdkwork_appstore_moderation_service::error::AppstoreServiceError,
    > {
        let rows = if let Some(cursor_id) = cursor {
            if let Some(status) = review_status {
                sqlx::query_as::<_, ModerationReviewRow>(
                    r#"
                    SELECT id, tenant_id, organization_id, submission_id, review_no, review_status,
                           priority, assigned_to, queue_code, sla_due_at, started_at, completed_at,
                           created_at, updated_at
                    FROM appstore_moderation_review
                    WHERE tenant_id = ? AND review_status = ? AND id > ?
                    ORDER BY id ASC
                    LIMIT ?
                    "#,
                )
                .bind(&context.tenant_id)
                .bind(status)
                .bind(cursor_id)
                .bind(limit)
                .fetch_all(&self.pool)
                .await
            } else {
                sqlx::query_as::<_, ModerationReviewRow>(
                    r#"
                    SELECT id, tenant_id, organization_id, submission_id, review_no, review_status,
                           priority, assigned_to, queue_code, sla_due_at, started_at, completed_at,
                           created_at, updated_at
                    FROM appstore_moderation_review
                    WHERE tenant_id = ? AND id > ?
                    ORDER BY id ASC
                    LIMIT ?
                    "#,
                )
                .bind(&context.tenant_id)
                .bind(cursor_id)
                .bind(limit)
                .fetch_all(&self.pool)
                .await
            }
        } else if let Some(status) = review_status {
            sqlx::query_as::<_, ModerationReviewRow>(
                r#"
                SELECT id, tenant_id, organization_id, submission_id, review_no, review_status,
                       priority, assigned_to, queue_code, sla_due_at, started_at, completed_at,
                       created_at, updated_at
                FROM appstore_moderation_review
                WHERE tenant_id = ? AND review_status = ?
                ORDER BY id ASC
                LIMIT ?
                "#,
            )
            .bind(&context.tenant_id)
            .bind(status)
            .bind(limit)
            .fetch_all(&self.pool)
            .await
        } else {
            sqlx::query_as::<_, ModerationReviewRow>(
                r#"
                SELECT id, tenant_id, organization_id, submission_id, review_no, review_status,
                       priority, assigned_to, queue_code, sla_due_at, started_at, completed_at,
                       created_at, updated_at
                FROM appstore_moderation_review
                WHERE tenant_id = ?
                ORDER BY id ASC
                LIMIT ?
                "#,
            )
            .bind(&context.tenant_id)
            .bind(limit)
            .fetch_all(&self.pool)
            .await
        }
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        rows.into_iter()
            .map(map_moderation_review_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn insert_review(
        &self,
        context: &AppstoreRequestContext,
        review: &ModerationReview,
    ) -> Result<(), sdkwork_appstore_moderation_service::error::AppstoreServiceError> {
        let (review_status, priority, queue_code) = map_moderation_review_domain_to_row(review);

        sqlx::query(
            r#"
            INSERT INTO appstore_moderation_review (
                id, tenant_id, organization_id, submission_id, review_no, review_status,
                priority, assigned_to, queue_code, sla_due_at, started_at, completed_at,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(review.id.as_str())
        .bind(&context.tenant_id)
        .bind(&context.organization_id)
        .bind(&review.submission_id)
        .bind(&review.review_no)
        .bind(&review_status)
        .bind(&priority)
        .bind(&review.assigned_to)
        .bind(&queue_code)
        .bind(review.sla_due_at)
        .bind(review.started_at)
        .bind(review.completed_at)
        .bind(review.created_at)
        .bind(review.updated_at)
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn update_review(
        &self,
        context: &AppstoreRequestContext,
        review: &ModerationReview,
    ) -> Result<(), sdkwork_appstore_moderation_service::error::AppstoreServiceError> {
        let (review_status, priority, queue_code) = map_moderation_review_domain_to_row(review);

        sqlx::query(
            r#"
            UPDATE appstore_moderation_review
            SET review_status = ?, priority = ?, assigned_to = ?, queue_code = ?,
                sla_due_at = ?, started_at = ?, completed_at = ?, updated_at = ?
            WHERE id = ? AND tenant_id = ?
            "#,
        )
        .bind(&review_status)
        .bind(&priority)
        .bind(&review.assigned_to)
        .bind(&queue_code)
        .bind(review.sla_due_at)
        .bind(review.started_at)
        .bind(review.completed_at)
        .bind(review.updated_at)
        .bind(review.id.as_str())
        .bind(&context.tenant_id)
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }

    async fn find_decision_by_id(
        &self,
        context: &AppstoreRequestContext,
        decision_id: &ModerationDecisionId,
    ) -> Result<
        Option<ModerationDecision>,
        sdkwork_appstore_moderation_service::error::AppstoreServiceError,
    > {
        let row = sqlx::query_as::<_, ModerationDecisionRow>(
            r#"
            SELECT id, tenant_id, organization_id, review_id, decision_no, decision_type,
                   decision_status, reason_code, reason_detail, policy_reference, decided_by,
                   decided_at, payload_snapshot_json, created_at
            FROM appstore_moderation_decision
            WHERE id = ? AND tenant_id = ?
            "#,
        )
        .bind(decision_id.as_str())
        .bind(&context.tenant_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        row.map(map_moderation_decision_row_to_domain)
            .transpose()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn find_decisions_by_review(
        &self,
        context: &AppstoreRequestContext,
        review_id: &ModerationReviewId,
    ) -> Result<
        Vec<ModerationDecision>,
        sdkwork_appstore_moderation_service::error::AppstoreServiceError,
    > {
        let rows = sqlx::query_as::<_, ModerationDecisionRow>(
            r#"
            SELECT id, tenant_id, organization_id, review_id, decision_no, decision_type,
                   decision_status, reason_code, reason_detail, policy_reference, decided_by,
                   decided_at, payload_snapshot_json, created_at
            FROM appstore_moderation_decision
            WHERE review_id = ? AND tenant_id = ?
            ORDER BY created_at ASC
            "#,
        )
        .bind(review_id.as_str())
        .bind(&context.tenant_id)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        rows.into_iter()
            .map(map_moderation_decision_row_to_domain)
            .collect::<Result<Vec<_>, _>>()
            .map_err(AppstoreServiceError::Internal)
    }

    async fn insert_decision(
        &self,
        context: &AppstoreRequestContext,
        decision: &ModerationDecision,
    ) -> Result<(), sdkwork_appstore_moderation_service::error::AppstoreServiceError> {
        let (decision_type, decision_status, reason_code, payload_snapshot_json) =
            map_moderation_decision_domain_to_row(decision);

        sqlx::query(
            r#"
            INSERT INTO appstore_moderation_decision (
                id, tenant_id, organization_id, review_id, decision_no, decision_type,
                decision_status, reason_code, reason_detail, policy_reference, decided_by,
                decided_at, payload_snapshot_json, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(decision.id.as_str())
        .bind(&context.tenant_id)
        .bind(&context.organization_id)
        .bind(decision.review_id.as_str())
        .bind(&decision.decision_no)
        .bind(&decision_type)
        .bind(&decision_status)
        .bind(&reason_code)
        .bind(&decision.reason_detail)
        .bind(&decision.policy_reference)
        .bind(&decision.decided_by)
        .bind(decision.decided_at)
        .bind(&payload_snapshot_json)
        .bind(decision.created_at)
        .execute(&self.pool)
        .await
        .map_err(|e| AppstoreServiceError::Internal(format!("Database error: {}", e)))?;

        Ok(())
    }
}
