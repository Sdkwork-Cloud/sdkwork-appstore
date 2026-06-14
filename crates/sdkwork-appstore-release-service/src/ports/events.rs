use async_trait::async_trait;

use crate::domain::events::ReleaseDomainEvent;

#[async_trait]
pub trait ReleaseEventPublisher: Send + Sync {
    async fn publish(&self, event: &ReleaseDomainEvent) -> Result<(), String>;

    async fn publish_batch(&self, events: &[ReleaseDomainEvent]) -> Result<(), String>;
}
