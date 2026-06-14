use sdkwork_appstore_moderation_service::domain::commands::{
    AssignModerationReviewRequest, CreateModerationDecisionRequest, ListModerationQueueRequest,
    RetrieveModerationReviewRequest,
};

pub fn map_list_moderation_queue(
    review_status: Option<String>,
    cursor: Option<String>,
    limit: Option<i32>,
) -> ListModerationQueueRequest {
    let mut req = ListModerationQueueRequest::new();
    if let Some(v) = review_status {
        req = req.with_review_status(v);
    }
    if let Some(v) = cursor {
        req = req.with_cursor(v);
    }
    if let Some(v) = limit {
        req = req.with_limit(v);
    }
    req
}

pub fn map_retrieve_moderation_review(review_id: String) -> RetrieveModerationReviewRequest {
    RetrieveModerationReviewRequest::new(review_id)
}

pub fn map_assign_moderation_review(
    review_id: String,
    assigned_to: String,
) -> AssignModerationReviewRequest {
    AssignModerationReviewRequest::new(review_id, assigned_to)
}

pub fn map_create_moderation_decision(
    review_id: String,
    decision_type: String,
    decision_status: String,
    reason_code: Option<String>,
    reason_detail: Option<String>,
    policy_reference: Option<String>,
) -> CreateModerationDecisionRequest {
    let mut req = CreateModerationDecisionRequest::new(review_id, decision_type, decision_status);
    if let Some(v) = reason_code {
        req = req.with_reason_code(v);
    }
    if let Some(v) = reason_detail {
        req = req.with_reason_detail(v);
    }
    if let Some(v) = policy_reference {
        req = req.with_policy_reference(v);
    }
    req
}
