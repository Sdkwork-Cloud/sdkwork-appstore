use crate::domain::events::LibraryDomainEvent;
use crate::error::AppstoreServiceResult;

#[async_trait::async_trait]
pub trait LibraryEventPublisher: Send + Sync {
    async fn publish(&self, event: &LibraryDomainEvent) -> AppstoreServiceResult<()>;
}
