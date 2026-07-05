use crate::mapper;
use sdkwork_appstore_moderation_service::context::AppstoreRequestContext;
use sdkwork_appstore_moderation_service::domain::results::{
    AssignModerationReviewResult, CreateModerationAppealResult, CreateModerationDecisionResult,
    DecideModerationAppealResult, ListModerationAppealsResult, ListModerationQueueResult,
    RetrieveModerationAppealResult, RetrieveModerationReviewResult,
};
use sdkwork_appstore_moderation_service::error::AppstoreServiceError;
use sdkwork_appstore_moderation_service::ModerationOperations;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteHandlerPlan {
    pub operation_id: &'static str,
    pub handler_name: &'static str,
    pub service_method: &'static str,
}

pub const ROUTE_HANDLER_PLANS: &[RouteHandlerPlan] = &[
    RouteHandlerPlan {
        operation_id: "appstore.moderation.queue.list",
        handler_name: "moderation_queue_list",
        service_method: "list_moderation_queue",
    },
    RouteHandlerPlan {
        operation_id: "appstore.moderation.reviews.retrieve",
        handler_name: "moderation_reviews_retrieve",
        service_method: "retrieve_moderation_review",
    },
    RouteHandlerPlan {
        operation_id: "appstore.moderation.reviews.assign",
        handler_name: "moderation_reviews_assign",
        service_method: "assign_moderation_review",
    },
    RouteHandlerPlan {
        operation_id: "appstore.moderation.decisions.create",
        handler_name: "moderation_decisions_create",
        service_method: "create_moderation_decision",
    },
    RouteHandlerPlan {
        operation_id: "appstore.moderation.appeals.create",
        handler_name: "moderation_appeals_create",
        service_method: "create_appeal",
    },
    RouteHandlerPlan {
        operation_id: "appstore.moderation.appeals.list",
        handler_name: "moderation_appeals_list",
        service_method: "list_appeals",
    },
    RouteHandlerPlan {
        operation_id: "appstore.moderation.appeals.retrieve",
        handler_name: "moderation_appeals_retrieve",
        service_method: "retrieve_appeal",
    },
    RouteHandlerPlan {
        operation_id: "appstore.moderation.appeals.decide",
        handler_name: "moderation_appeals_decide",
        service_method: "decide_appeal",
    },
];

pub fn route_handler_plans() -> &'static [RouteHandlerPlan] {
    ROUTE_HANDLER_PLANS
}

pub async fn moderation_queue_list<S: ModerationOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    review_status: Option<String>,
    cursor: Option<String>,
    limit: Option<i32>,
) -> Result<ListModerationQueueResult, AppstoreServiceError> {
    let cmd = mapper::request::map_list_moderation_queue(review_status, cursor, limit);
    service.list_queue(context, cmd).await
}

pub async fn moderation_reviews_retrieve<S: ModerationOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    review_id: String,
) -> Result<RetrieveModerationReviewResult, AppstoreServiceError> {
    let cmd = mapper::request::map_retrieve_moderation_review(review_id);
    service.retrieve_review(context, cmd).await
}

pub async fn moderation_reviews_assign<S: ModerationOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    review_id: String,
    assigned_to: String,
) -> Result<AssignModerationReviewResult, AppstoreServiceError> {
    let cmd = mapper::request::map_assign_moderation_review(review_id, assigned_to);
    service.assign_review(context, cmd).await
}

pub async fn moderation_decisions_create<S: ModerationOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    review_id: String,
    decision_type: String,
    decision_status: String,
    reason_code: Option<String>,
    reason_detail: Option<String>,
    policy_reference: Option<String>,
) -> Result<CreateModerationDecisionResult, AppstoreServiceError> {
    let cmd = mapper::request::map_create_moderation_decision(
        review_id,
        decision_type,
        decision_status,
        reason_code,
        reason_detail,
        policy_reference,
    );
    service.create_decision(context, cmd).await
}

pub async fn moderation_appeals_create<S: ModerationOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    decision_id: String,
    appeal_reason: String,
) -> Result<CreateModerationAppealResult, AppstoreServiceError> {
    let cmd = mapper::request::map_create_moderation_appeal(decision_id, appeal_reason);
    service.create_appeal(context, cmd).await
}

pub async fn moderation_appeals_list<S: ModerationOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    status: Option<String>,
    cursor: Option<String>,
    limit: Option<i32>,
) -> Result<ListModerationAppealsResult, AppstoreServiceError> {
    let cmd = mapper::request::map_list_moderation_appeals(status, cursor, limit);
    service.list_appeals(context, cmd).await
}

pub async fn moderation_appeals_retrieve<S: ModerationOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    appeal_id: String,
) -> Result<RetrieveModerationAppealResult, AppstoreServiceError> {
    let cmd = mapper::request::map_retrieve_moderation_appeal(appeal_id);
    service.retrieve_appeal(context, cmd).await
}

pub async fn moderation_appeals_decide<S: ModerationOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    appeal_id: String,
    decision: String,
    note: String,
) -> Result<DecideModerationAppealResult, AppstoreServiceError> {
    let cmd = mapper::request::map_decide_moderation_appeal(appeal_id, decision, note);
    service.decide_appeal(context, cmd).await
}
