use async_trait::async_trait;

use crate::domain::events::ComplianceDomainEvent;

#[async_trait]
pub trait ComplianceEventPublisher: Send + Sync {
    async fn publish(&self, event: &ComplianceDomainEvent) -> Result<(), String>;

    async fn publish_batch(&self, events: &[ComplianceDomainEvent]) -> Result<(), String>;
}
