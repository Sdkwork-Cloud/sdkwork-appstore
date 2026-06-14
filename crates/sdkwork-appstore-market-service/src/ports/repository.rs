use crate::context::AppstoreRequestContext;
use crate::domain::models::{MarketChannel, MarketChannelId, MarketRelease, MarketReleaseId};
use crate::error::AppstoreServiceResult;

#[async_trait::async_trait]
pub trait MarketRepositoryPort: Send + Sync {
    async fn find_channel_by_id(
        &self,
        context: &AppstoreRequestContext,
        channel_id: &MarketChannelId,
    ) -> AppstoreServiceResult<Option<MarketChannel>>;

    async fn find_channel_by_code(
        &self,
        context: &AppstoreRequestContext,
        channel_code: &str,
    ) -> AppstoreServiceResult<Option<MarketChannel>>;

    async fn list_channels(
        &self,
        context: &AppstoreRequestContext,
        channel_status: Option<&str>,
        cursor: Option<&str>,
        limit: i32,
    ) -> AppstoreServiceResult<Vec<MarketChannel>>;

    async fn insert_channel(
        &self,
        context: &AppstoreRequestContext,
        channel: &MarketChannel,
    ) -> AppstoreServiceResult<()>;

    async fn update_channel(
        &self,
        context: &AppstoreRequestContext,
        channel: &MarketChannel,
    ) -> AppstoreServiceResult<()>;

    async fn find_release_by_id(
        &self,
        context: &AppstoreRequestContext,
        release_id: &MarketReleaseId,
    ) -> AppstoreServiceResult<Option<MarketRelease>>;

    async fn list_releases(
        &self,
        context: &AppstoreRequestContext,
        release_id: Option<&str>,
        channel_id: Option<&str>,
        market_status: Option<&str>,
        cursor: Option<&str>,
        limit: i32,
    ) -> AppstoreServiceResult<Vec<MarketRelease>>;

    async fn update_release(
        &self,
        context: &AppstoreRequestContext,
        release: &MarketRelease,
    ) -> AppstoreServiceResult<()>;
}
