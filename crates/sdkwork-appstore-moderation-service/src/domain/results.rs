use serde::{Deserialize, Serialize};

use super::models::{ModerationDecision, ModerationReview};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ModerationOperationResult {
    pub operation_id: &'static str,
    pub accepted: bool,
}

impl ModerationOperationResult {
    pub fn accepted(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            accepted: true,
        }
    }

    pub fn rejected(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            accepted: false,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ListModerationQueueResult {
    pub operation_id: &'static str,
    pub reviews: Vec<ModerationReview>,
    pub next_cursor: Option<String>,
    pub has_more: bool,
}

impl ListModerationQueueResult {
    pub fn new(
        operation_id: &'static str,
        reviews: Vec<ModerationReview>,
        next_cursor: Option<String>,
        has_more: bool,
    ) -> Self {
        Self {
            operation_id,
            reviews,
            next_cursor,
            has_more,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct RetrieveModerationReviewResult {
    pub operation_id: &'static str,
    pub review: ModerationReview,
}

impl RetrieveModerationReviewResult {
    pub fn found(operation_id: &'static str, review: ModerationReview) -> Self {
        Self {
            operation_id,
            review,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct AssignModerationReviewResult {
    pub operation_id: &'static str,
    pub review: ModerationReview,
}

impl AssignModerationReviewResult {
    pub fn assigned(operation_id: &'static str, review: ModerationReview) -> Self {
        Self {
            operation_id,
            review,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CreateModerationDecisionResult {
    pub operation_id: &'static str,
    pub decision: ModerationDecision,
    pub review: ModerationReview,
}

impl CreateModerationDecisionResult {
    pub fn created(
        operation_id: &'static str,
        decision: ModerationDecision,
        review: ModerationReview,
    ) -> Self {
        Self {
            operation_id,
            decision,
            review,
        }
    }
}
