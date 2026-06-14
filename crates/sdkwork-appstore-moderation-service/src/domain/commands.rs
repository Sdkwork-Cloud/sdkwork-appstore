use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ModerationOperationRequest {
    pub operation_id: &'static str,
    pub idempotency_key: Option<String>,
}

impl ModerationOperationRequest {
    pub fn new(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            idempotency_key: None,
        }
    }

    pub fn with_idempotency_key(mut self, key: impl Into<String>) -> Self {
        self.idempotency_key = Some(key.into());
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ListModerationQueueRequest {
    pub review_status: Option<String>,
    pub cursor: Option<String>,
    pub limit: Option<i32>,
    pub idempotency_key: Option<String>,
}

impl ListModerationQueueRequest {
    pub fn new() -> Self {
        Self {
            review_status: None,
            cursor: None,
            limit: None,
            idempotency_key: None,
        }
    }

    pub fn with_review_status(mut self, status: impl Into<String>) -> Self {
        self.review_status = Some(status.into());
        self
    }

    pub fn with_cursor(mut self, cursor: impl Into<String>) -> Self {
        self.cursor = Some(cursor.into());
        self
    }

    pub fn with_limit(mut self, limit: i32) -> Self {
        self.limit = Some(limit);
        self
    }

    pub fn with_idempotency_key(mut self, key: impl Into<String>) -> Self {
        self.idempotency_key = Some(key.into());
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct RetrieveModerationReviewRequest {
    pub review_id: String,
    pub idempotency_key: Option<String>,
}

impl RetrieveModerationReviewRequest {
    pub fn new(review_id: impl Into<String>) -> Self {
        Self {
            review_id: review_id.into(),
            idempotency_key: None,
        }
    }

    pub fn with_idempotency_key(mut self, key: impl Into<String>) -> Self {
        self.idempotency_key = Some(key.into());
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct AssignModerationReviewRequest {
    pub review_id: String,
    pub assigned_to: String,
    pub idempotency_key: Option<String>,
}

impl AssignModerationReviewRequest {
    pub fn new(review_id: impl Into<String>, assigned_to: impl Into<String>) -> Self {
        Self {
            review_id: review_id.into(),
            assigned_to: assigned_to.into(),
            idempotency_key: None,
        }
    }

    pub fn with_idempotency_key(mut self, key: impl Into<String>) -> Self {
        self.idempotency_key = Some(key.into());
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CreateModerationDecisionRequest {
    pub review_id: String,
    pub decision_type: String,
    pub decision_status: String,
    pub reason_code: Option<String>,
    pub reason_detail: Option<String>,
    pub policy_reference: Option<String>,
    pub idempotency_key: Option<String>,
}

impl CreateModerationDecisionRequest {
    pub fn new(
        review_id: impl Into<String>,
        decision_type: impl Into<String>,
        decision_status: impl Into<String>,
    ) -> Self {
        Self {
            review_id: review_id.into(),
            decision_type: decision_type.into(),
            decision_status: decision_status.into(),
            reason_code: None,
            reason_detail: None,
            policy_reference: None,
            idempotency_key: None,
        }
    }

    pub fn with_reason_code(mut self, code: impl Into<String>) -> Self {
        self.reason_code = Some(code.into());
        self
    }

    pub fn with_reason_detail(mut self, detail: impl Into<String>) -> Self {
        self.reason_detail = Some(detail.into());
        self
    }

    pub fn with_policy_reference(mut self, reference: impl Into<String>) -> Self {
        self.policy_reference = Some(reference.into());
        self
    }

    pub fn with_idempotency_key(mut self, key: impl Into<String>) -> Self {
        self.idempotency_key = Some(key.into());
        self
    }
}
