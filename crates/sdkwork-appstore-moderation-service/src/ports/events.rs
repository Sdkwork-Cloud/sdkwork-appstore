use async_trait::async_trait;

use crate::domain::events::ModerationDomainEvent;

#[async_trait]
pub trait ModerationEventPublisher: Send + Sync {
    async fn publish(&self, event: &ModerationDomainEvent) -> Result<(), String>;

    async fn publish_batch(&self, events: &[ModerationDomainEvent]) -> Result<(), String>;
}
