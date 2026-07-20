//! Bridges moderation decisions back onto listing aggregates.

use std::sync::Arc;

use async_trait::async_trait;
use sdkwork_appstore_listing_service::domain::commands::ApplyModerationDecisionRequest;
use sdkwork_appstore_listing_service::service::listing_service::{
    ListingOperations, ListingService,
};
use sdkwork_appstore_moderation_service::context::AppstoreRequestContext as ModerationContext;
use sdkwork_appstore_moderation_service::domain::models::DecisionType;
use sdkwork_appstore_moderation_service::error::AppstoreServiceError;
use sdkwork_appstore_moderation_service::ports::listing_projection::ModerationListingProjectionPort;
use sdkwork_appstore_repository_sqlx::repository::listing_repository::SqlxListingRepository;

#[derive(Clone)]
pub struct DecisionListingProjectionAdapter {
    listing_service: ListingService<SqlxListingRepository>,
}

impl DecisionListingProjectionAdapter {
    pub fn new(listing_service: ListingService<SqlxListingRepository>) -> Self {
        Self { listing_service }
    }

    fn to_listing_context(
        ctx: &ModerationContext,
        organization_id: &str,
    ) -> sdkwork_appstore_listing_service::context::AppstoreRequestContext {
        sdkwork_appstore_listing_service::context::AppstoreRequestContext {
            tenant_id: ctx.tenant_id.clone(),
            organization_id: organization_id.to_string(),
            user_id: ctx.user_id.clone().unwrap_or_else(|| "system".to_string()),
            request_id: ctx.request_id.clone(),
            trace_id: ctx.trace_id.clone(),
            permission_scopes: ctx.permission_scopes.clone(),
        }
    }
}

#[async_trait]
impl ModerationListingProjectionPort for DecisionListingProjectionAdapter {
    async fn apply_decision_outcome(
        &self,
        context: &ModerationContext,
        submission_id: &str,
        decision_type: DecisionType,
        organization_id: &str,
    ) -> Result<(), AppstoreServiceError> {
        let listing_context = Self::to_listing_context(context, organization_id);
        let request = ApplyModerationDecisionRequest::new(submission_id, decision_type.as_str());

        self.listing_service
            .apply_moderation_decision(&listing_context, request)
            .await
            .map_err(|error| AppstoreServiceError::Internal(error.to_string()))?;

        Ok(())
    }
}

pub fn decision_listing_projection_port(
    listing_service: ListingService<SqlxListingRepository>,
) -> Arc<dyn ModerationListingProjectionPort> {
    Arc::new(DecisionListingProjectionAdapter::new(listing_service))
}
