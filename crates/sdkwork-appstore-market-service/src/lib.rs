pub mod context;
pub mod domain;
pub mod error;
pub mod ports;
pub mod service;

pub use context::AppstoreRequestContext;
pub use domain::commands::{
    CreateMarketChannelRequest, ListMarketChannelsRequest, ListMarketReleasesRequest,
    SyncMarketReleaseRequest, UpdateMarketChannelRequest,
};
pub use domain::models::{
    ChannelStatus, ChannelType, MarketChannel, MarketChannelId, MarketRelease, MarketReleaseId,
    MarketStatus,
};
pub use domain::results::{
    CreateMarketChannelResult, ListMarketChannelsResult, ListMarketReleasesResult,
    SyncMarketReleaseResult, UpdateMarketChannelResult,
};
pub use error::{AppstoreServiceError, AppstoreServiceResult};
pub use ports::repository::MarketRepositoryPort;
pub use service::market_service::{MarketOperations, MarketService};

pub const CAPABILITY: &str = "market";

pub fn capability_name() -> &'static str {
    CAPABILITY
}
