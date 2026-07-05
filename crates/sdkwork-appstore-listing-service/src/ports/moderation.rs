use async_trait::async_trait;

use crate::context::AppstoreRequestContext;
use crate::domain::models::ListingSubmission;
use crate::error::AppstoreServiceError;

#[async_trait]
pub trait SubmissionModerationPort: Send + Sync {
    async fn enqueue_submission_review(
        &self,
        context: &AppstoreRequestContext,
        submission: &ListingSubmission,
    ) -> Result<(), AppstoreServiceError>;
}
