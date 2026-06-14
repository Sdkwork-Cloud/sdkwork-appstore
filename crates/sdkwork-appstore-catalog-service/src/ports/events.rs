use async_trait::async_trait;

use crate::domain::events::CatalogDomainEvent;

#[async_trait]
pub trait CatalogEventPublisher: Send + Sync {
    async fn publish(&self, event: &CatalogDomainEvent) -> Result<(), String>;

    async fn publish_batch(&self, events: &[CatalogDomainEvent]) -> Result<(), String>;
}
