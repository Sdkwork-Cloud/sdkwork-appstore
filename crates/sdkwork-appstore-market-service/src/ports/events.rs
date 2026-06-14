use async_trait::async_trait;

use crate::domain::events::MarketDomainEvent;

#[async_trait]
pub trait MarketEventPublisher: Send + Sync {
    async fn publish(&self, event: &MarketDomainEvent) -> Result<(), String>;

    async fn publish_batch(&self, events: &[MarketDomainEvent]) -> Result<(), String>;
}
