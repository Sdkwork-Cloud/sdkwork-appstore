use sdkwork_appstore_moderation_service::domain::results::{
    AssignModerationReviewResult, CreateModerationDecisionResult, ListModerationQueueResult,
    RetrieveModerationReviewResult,
};

pub fn map_list_moderation_queue_response(
    result: ListModerationQueueResult,
) -> ListModerationQueueResult {
    result
}

pub fn map_retrieve_moderation_review_response(
    result: RetrieveModerationReviewResult,
) -> RetrieveModerationReviewResult {
    result
}

pub fn map_assign_moderation_review_response(
    result: AssignModerationReviewResult,
) -> AssignModerationReviewResult {
    result
}

pub fn map_create_moderation_decision_response(
    result: CreateModerationDecisionResult,
) -> CreateModerationDecisionResult {
    result
}
