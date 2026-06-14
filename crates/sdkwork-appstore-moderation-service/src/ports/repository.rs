use crate::context::AppstoreRequestContext;
use crate::domain::models::{
    ModerationDecision, ModerationDecisionId, ModerationReview, ModerationReviewId,
};
use crate::error::AppstoreServiceResult;

#[async_trait::async_trait]
pub trait ModerationRepositoryPort: Send + Sync {
    async fn find_review_by_id(
        &self,
        context: &AppstoreRequestContext,
        review_id: &ModerationReviewId,
    ) -> AppstoreServiceResult<Option<ModerationReview>>;

    async fn find_review_by_submission(
        &self,
        context: &AppstoreRequestContext,
        submission_id: &str,
    ) -> AppstoreServiceResult<Option<ModerationReview>>;

    async fn list_reviews(
        &self,
        context: &AppstoreRequestContext,
        review_status: Option<&str>,
        cursor: Option<&str>,
        limit: i32,
    ) -> AppstoreServiceResult<Vec<ModerationReview>>;

    async fn insert_review(
        &self,
        context: &AppstoreRequestContext,
        review: &ModerationReview,
    ) -> AppstoreServiceResult<()>;

    async fn update_review(
        &self,
        context: &AppstoreRequestContext,
        review: &ModerationReview,
    ) -> AppstoreServiceResult<()>;

    async fn find_decision_by_id(
        &self,
        context: &AppstoreRequestContext,
        decision_id: &ModerationDecisionId,
    ) -> AppstoreServiceResult<Option<ModerationDecision>>;

    async fn find_decisions_by_review(
        &self,
        context: &AppstoreRequestContext,
        review_id: &ModerationReviewId,
    ) -> AppstoreServiceResult<Vec<ModerationDecision>>;

    async fn insert_decision(
        &self,
        context: &AppstoreRequestContext,
        decision: &ModerationDecision,
    ) -> AppstoreServiceResult<()>;
}
