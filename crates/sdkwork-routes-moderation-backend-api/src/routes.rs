//! Route registration descriptors for sdkwork-routes-moderation-backend-api.

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteDefinition {
    pub method: &'static str,
    pub path: &'static str,
    pub operation_id: &'static str,
    pub handler: &'static str,
    pub service_method: &'static str,
}

pub const ROUTES: &[RouteDefinition] = &[
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/moderation/queue",
        operation_id: "appstore.moderation.queue.list",
        handler: "moderation_queue_list",
        service_method: "moderation_queue_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/moderation/reviews/{reviewId}",
        operation_id: "appstore.moderation.reviews.retrieve",
        handler: "moderation_reviews_retrieve",
        service_method: "moderation_reviews_retrieve",
    },
    RouteDefinition {
        method: "POST",
        path: "/backend/v3/api/moderation/reviews/{reviewId}/assign",
        operation_id: "appstore.moderation.reviews.assign",
        handler: "moderation_reviews_assign",
        service_method: "moderation_reviews_assign",
    },
    RouteDefinition {
        method: "POST",
        path: "/backend/v3/api/moderation/reviews/{reviewId}/decisions",
        operation_id: "appstore.moderation.decisions.create",
        handler: "moderation_decisions_create",
        service_method: "moderation_decisions_create",
    },
    RouteDefinition {
        method: "POST",
        path: "/backend/v3/api/moderation/appeals",
        operation_id: "appstore.moderation.appeals.create",
        handler: "moderation_appeals_create",
        service_method: "moderation_appeals_create",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/moderation/appeals",
        operation_id: "appstore.moderation.appeals.list",
        handler: "moderation_appeals_list",
        service_method: "moderation_appeals_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/moderation/appeals/{appealId}",
        operation_id: "appstore.moderation.appeals.retrieve",
        handler: "moderation_appeals_retrieve",
        service_method: "moderation_appeals_retrieve",
    },
    RouteDefinition {
        method: "POST",
        path: "/backend/v3/api/moderation/appeals/{appealId}/decide",
        operation_id: "appstore.moderation.appeals.decide",
        handler: "moderation_appeals_decide",
        service_method: "moderation_appeals_decide",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
