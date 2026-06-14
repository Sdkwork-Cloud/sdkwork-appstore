use async_trait::async_trait;

use crate::domain::events::PublisherDomainEvent;

#[async_trait]
pub trait PublisherEventPublisher: Send + Sync {
    async fn publish(&self, event: &PublisherDomainEvent) -> Result<(), String>;

    async fn publish_batch(&self, events: &[PublisherDomainEvent]) -> Result<(), String>;
}
