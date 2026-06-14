use chrono::Utc;
use uuid::Uuid;

use crate::context::AppstoreRequestContext;
use crate::domain::commands::{
    AssignModerationReviewRequest, CreateModerationDecisionRequest, ListModerationQueueRequest,
    RetrieveModerationReviewRequest,
};
use crate::domain::models::{
    DecisionStatus, DecisionType, ModerationDecision, ModerationDecisionId, ModerationReview,
    ModerationReviewId, ReasonCode, ReviewStatus,
};
use crate::domain::results::{
    AssignModerationReviewResult, CreateModerationDecisionResult, ListModerationQueueResult,
    RetrieveModerationReviewResult,
};
use crate::error::{AppstoreServiceError, AppstoreServiceResult};
use crate::ports::repository::ModerationRepositoryPort;

#[async_trait::async_trait]
pub trait ModerationOperations {
    async fn list_queue(
        &self,
        context: &AppstoreRequestContext,
        request: ListModerationQueueRequest,
    ) -> AppstoreServiceResult<ListModerationQueueResult>;

    async fn retrieve_review(
        &self,
        context: &AppstoreRequestContext,
        request: RetrieveModerationReviewRequest,
    ) -> AppstoreServiceResult<RetrieveModerationReviewResult>;

    async fn assign_review(
        &self,
        context: &AppstoreRequestContext,
        request: AssignModerationReviewRequest,
    ) -> AppstoreServiceResult<AssignModerationReviewResult>;

    async fn create_decision(
        &self,
        context: &AppstoreRequestContext,
        request: CreateModerationDecisionRequest,
    ) -> AppstoreServiceResult<CreateModerationDecisionResult>;
}

#[derive(Debug, Clone)]
pub struct ModerationService<R> {
    repository: R,
}

impl<R> ModerationService<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }
}

#[async_trait::async_trait]
impl<R> ModerationOperations for ModerationService<R>
where
    R: ModerationRepositoryPort,
{
    async fn list_queue(
        &self,
        context: &AppstoreRequestContext,
        request: ListModerationQueueRequest,
    ) -> AppstoreServiceResult<ListModerationQueueResult> {
        let limit = request.limit.unwrap_or(20).min(100);
        let reviews = self
            .repository
            .list_reviews(
                context,
                request.review_status.as_deref(),
                request.cursor.as_deref(),
                limit + 1,
            )
            .await?;

        let has_more = reviews.len() > limit as usize;
        let reviews: Vec<ModerationReview> = reviews.into_iter().take(limit as usize).collect();
        let next_cursor = if has_more {
            reviews.last().map(|r| r.id.as_str().to_string())
        } else {
            None
        };

        Ok(ListModerationQueueResult::new(
            "appstore.moderation.queue.list",
            reviews,
            next_cursor,
            has_more,
        ))
    }

    async fn retrieve_review(
        &self,
        context: &AppstoreRequestContext,
        request: RetrieveModerationReviewRequest,
    ) -> AppstoreServiceResult<RetrieveModerationReviewResult> {
        let review_id = ModerationReviewId::new(&request.review_id);

        let review = self
            .repository
            .find_review_by_id(context, &review_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!(
                    "Moderation review not found: {}",
                    request.review_id
                ))
            })?;

        Ok(RetrieveModerationReviewResult::found(
            "appstore.moderation.reviews.retrieve",
            review,
        ))
    }

    async fn assign_review(
        &self,
        context: &AppstoreRequestContext,
        request: AssignModerationReviewRequest,
    ) -> AppstoreServiceResult<AssignModerationReviewResult> {
        if request.assigned_to.trim().is_empty() {
            return Err(AppstoreServiceError::ValidationFailed(
                "assignedTo is required".to_string(),
            ));
        }

        let review_id = ModerationReviewId::new(&request.review_id);

        let mut review = self
            .repository
            .find_review_by_id(context, &review_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!(
                    "Moderation review not found: {}",
                    request.review_id
                ))
            })?;

        if !review.can_assign() {
            return Err(AppstoreServiceError::InvalidState(format!(
                "Review cannot be assigned in state: {}",
                review.review_status.as_str()
            )));
        }

        let now = Utc::now();
        review.assigned_to = Some(request.assigned_to);
        review.review_status = ReviewStatus::InReview;
        review.started_at = Some(review.started_at.unwrap_or(now));
        review.updated_at = now;

        self.repository.update_review(context, &review).await?;

        Ok(AssignModerationReviewResult::assigned(
            "appstore.moderation.reviews.assign",
            review,
        ))
    }

    async fn create_decision(
        &self,
        context: &AppstoreRequestContext,
        request: CreateModerationDecisionRequest,
    ) -> AppstoreServiceResult<CreateModerationDecisionResult> {
        let review_id = ModerationReviewId::new(&request.review_id);

        let mut review = self
            .repository
            .find_review_by_id(context, &review_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!(
                    "Moderation review not found: {}",
                    request.review_id
                ))
            })?;

        if !review.can_decide() {
            return Err(AppstoreServiceError::InvalidState(format!(
                "Review cannot receive decisions in state: {}",
                review.review_status.as_str()
            )));
        }

        let decision_type = DecisionType::from_str(&request.decision_type).ok_or_else(|| {
            AppstoreServiceError::ValidationFailed(format!(
                "Invalid decision type: {}",
                request.decision_type
            ))
        })?;

        let decision_status =
            DecisionStatus::from_str(&request.decision_status).ok_or_else(|| {
                AppstoreServiceError::ValidationFailed(format!(
                    "Invalid decision status: {}",
                    request.decision_status
                ))
            })?;

        let reason_code = request.reason_code.map(|rc| ReasonCode::from_str(&rc));

        let decided_by = context
            .user_id
            .clone()
            .unwrap_or_else(|| "system".to_string());

        let now = Utc::now();
        let decision_id = ModerationDecisionId::new(Uuid::new_v4().to_string());
        let decision_no = format!(
            "MOD-DEC-{}",
            Uuid::new_v4()
                .to_string()
                .split('-')
                .next()
                .unwrap_or_default()
        );

        let decision = ModerationDecision {
            id: decision_id,
            tenant_id: context.tenant_id.clone(),
            organization_id: context.organization_id.clone().unwrap_or_default(),
            review_id: review_id.clone(),
            decision_no,
            decision_type: decision_type.clone(),
            decision_status: decision_status.clone(),
            reason_code,
            reason_detail: request.reason_detail,
            policy_reference: request.policy_reference,
            decided_by,
            decided_at: now,
            payload_snapshot: serde_json::Value::Object(serde_json::Map::new()),
            created_at: now,
        };

        self.repository.insert_decision(context, &decision).await?;

        match decision_type {
            DecisionType::Approve => {
                review.review_status = ReviewStatus::Approved;
            }
            DecisionType::Reject => {
                review.review_status = ReviewStatus::Rejected;
            }
            DecisionType::RequestChanges => {
                review.review_status = ReviewStatus::ChangesRequested;
            }
        }
        review.completed_at = Some(now);
        review.updated_at = now;

        self.repository.update_review(context, &review).await?;

        Ok(CreateModerationDecisionResult::created(
            "appstore.moderation.decisions.create",
            decision,
            review,
        ))
    }
}
