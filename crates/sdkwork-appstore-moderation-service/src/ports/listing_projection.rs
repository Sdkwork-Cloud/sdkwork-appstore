//! Projects moderation decisions back onto listing aggregates.

use async_trait::async_trait;

use crate::context::AppstoreRequestContext;
use crate::domain::models::DecisionType;
use crate::error::AppstoreServiceError;

#[async_trait]
pub trait ModerationListingProjectionPort: Send + Sync {
    async fn apply_decision_outcome(
        &self,
        context: &AppstoreRequestContext,
        submission_id: &str,
        decision_type: DecisionType,
        organization_id: &str,
    ) -> Result<(), AppstoreServiceError>;
}
