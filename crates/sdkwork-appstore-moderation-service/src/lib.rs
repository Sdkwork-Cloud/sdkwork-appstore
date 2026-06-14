pub mod context;
pub mod domain;
pub mod error;
pub mod ports;
pub mod service;

pub use context::AppstoreRequestContext;
pub use domain::commands::{
    AssignModerationReviewRequest, CreateModerationDecisionRequest, ListModerationQueueRequest,
    ModerationOperationRequest, RetrieveModerationReviewRequest,
};
pub use domain::models::{
    DecisionStatus, DecisionType, ModerationDecision, ModerationDecisionId, ModerationReview,
    ModerationReviewId, Priority, QueueCode, ReasonCode, ReviewStatus,
};
pub use domain::results::{
    AssignModerationReviewResult, CreateModerationDecisionResult, ListModerationQueueResult,
    ModerationOperationResult, RetrieveModerationReviewResult,
};
pub use error::{AppstoreServiceError, AppstoreServiceResult};
pub use ports::repository::ModerationRepositoryPort;
pub use service::moderation_service::{ModerationOperations, ModerationService};

pub const CAPABILITY: &str = "moderation";

pub fn capability_name() -> &'static str {
    CAPABILITY
}
