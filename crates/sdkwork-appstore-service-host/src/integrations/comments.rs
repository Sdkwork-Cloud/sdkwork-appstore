use super::registry::{IntegrationCapability, IntegrationOwner, IntegrationSurface};
use async_trait::async_trait;

pub const CAPABILITY: IntegrationCapability = IntegrationCapability {
    key: "comments",
    owner: IntegrationOwner::Dependency("sdkwork-comments"),
    purpose:
        "Review threads, rating summaries, favorites, visit history, and abuse-report linkage.",
    surfaces: &[
        IntegrationSurface::AppApi,
        IntegrationSurface::BackendApi,
        IntegrationSurface::ServicePort,
    ],
    required: true,
    todo: "",
};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CommentThread {
    pub thread_id: String,
    pub entity_type: String,
    pub entity_id: String,
    pub comment_count: i32,
    pub average_rating: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RatingSummary {
    pub average_rating: String,
    pub rating_count: i32,
    pub distribution: Vec<RatingBucket>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RatingBucket {
    pub stars: i32,
    pub count: i32,
}

#[async_trait]
pub trait CommentsConnector: Send + Sync {
    async fn resolve_thread(
        &self,
        tenant_id: &str,
        entity_type: &str,
        entity_id: &str,
    ) -> Result<Option<CommentThread>, String>;

    async fn create_thread(
        &self,
        tenant_id: &str,
        entity_type: &str,
        entity_id: &str,
    ) -> Result<CommentThread, String>;

    async fn resolve_rating_summary(
        &self,
        tenant_id: &str,
        thread_id: &str,
    ) -> Result<RatingSummary, String>;

    async fn bind_thread_to_listing(
        &self,
        tenant_id: &str,
        listing_id: &str,
        thread_id: &str,
    ) -> Result<(), String>;
}
