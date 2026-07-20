//! Bridges listing submissions into the moderation queue.

use std::sync::Arc;

use async_trait::async_trait;
use sdkwork_appstore_listing_service::context::AppstoreRequestContext as ListingContext;
use sdkwork_appstore_listing_service::domain::models::ListingSubmission;
use sdkwork_appstore_listing_service::error::AppstoreServiceError;
use sdkwork_appstore_listing_service::ports::moderation::SubmissionModerationPort;
use sdkwork_appstore_moderation_service::{
    domain::commands::EnqueueSubmissionReviewRequest, ModerationOperations, ModerationService,
};
use sdkwork_appstore_repository_sqlx::repository::moderation_repository::SqlxModerationRepository;

#[derive(Clone)]
pub struct SubmissionModerationAdapter {
    moderation_service: ModerationService<SqlxModerationRepository>,
}

impl SubmissionModerationAdapter {
    pub fn new(moderation_service: ModerationService<SqlxModerationRepository>) -> Self {
        Self { moderation_service }
    }

    fn to_moderation_context(
        ctx: &ListingContext,
    ) -> sdkwork_appstore_moderation_service::context::AppstoreRequestContext {
        sdkwork_appstore_moderation_service::context::AppstoreRequestContext {
            tenant_id: ctx.tenant_id.clone(),
            organization_id: Some(ctx.organization_id.clone()),
            user_id: Some(ctx.user_id.clone()),
            request_id: ctx.request_id.clone(),
            trace_id: ctx.trace_id.clone(),
            permission_scopes: ctx.permission_scopes.clone(),
        }
    }
}

#[async_trait]
impl SubmissionModerationPort for SubmissionModerationAdapter {
    async fn enqueue_submission_review(
        &self,
        context: &ListingContext,
        submission: &ListingSubmission,
    ) -> Result<(), AppstoreServiceError> {
        let moderation_context = Self::to_moderation_context(context);
        let request = EnqueueSubmissionReviewRequest::new(
            submission.id.clone(),
            context.organization_id.clone(),
        )
        .with_idempotency_key(submission.idempotency_key.clone());

        self.moderation_service
            .enqueue_submission_review(&moderation_context, request)
            .await
            .map_err(|error| AppstoreServiceError::Internal(error.to_string()))?;

        Ok(())
    }
}

pub fn submission_moderation_port(
    moderation_service: ModerationService<SqlxModerationRepository>,
) -> Arc<dyn SubmissionModerationPort> {
    Arc::new(SubmissionModerationAdapter::new(moderation_service))
}
