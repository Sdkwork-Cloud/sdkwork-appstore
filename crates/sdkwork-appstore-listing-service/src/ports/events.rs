use async_trait::async_trait;

use crate::domain::events::ListingDomainEvent;

#[async_trait]
pub trait ListingEventPublisher: Send + Sync {
    async fn publish(&self, event: &ListingDomainEvent) -> Result<(), String>;

    async fn publish_batch(&self, events: &[ListingDomainEvent]) -> Result<(), String>;
}
