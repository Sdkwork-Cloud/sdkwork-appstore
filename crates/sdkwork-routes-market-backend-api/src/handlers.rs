use crate::mapper;
use sdkwork_appstore_market_service::context::AppstoreRequestContext;
use sdkwork_appstore_market_service::domain::results::{
    CreateMarketChannelResult, ListMarketChannelsResult, ListMarketReleasesResult,
    SyncMarketReleaseResult, UpdateMarketChannelResult,
};
use sdkwork_appstore_market_service::error::AppstoreServiceError;
use sdkwork_appstore_market_service::MarketOperations;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteHandlerPlan {
    pub operation_id: &'static str,
    pub handler_name: &'static str,
    pub service_method: &'static str,
}

pub const ROUTE_HANDLER_PLANS: &[RouteHandlerPlan] = &[
    RouteHandlerPlan {
        operation_id: "appstore.marketChannels.list",
        handler_name: "market_channels_list",
        service_method: "list_market_channels",
    },
    RouteHandlerPlan {
        operation_id: "appstore.marketChannels.create",
        handler_name: "market_channels_create",
        service_method: "create_market_channel",
    },
    RouteHandlerPlan {
        operation_id: "appstore.marketChannels.update",
        handler_name: "market_channels_update",
        service_method: "update_market_channel",
    },
    RouteHandlerPlan {
        operation_id: "appstore.marketReleases.list",
        handler_name: "market_releases_list",
        service_method: "list_market_releases",
    },
    RouteHandlerPlan {
        operation_id: "appstore.marketReleases.sync",
        handler_name: "market_releases_sync",
        service_method: "sync_market_release",
    },
];

pub fn route_handler_plans() -> &'static [RouteHandlerPlan] {
    ROUTE_HANDLER_PLANS
}

pub async fn market_channels_list<S: MarketOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    channel_status: Option<String>,
    cursor: Option<String>,
    page_size: Option<i32>,
) -> Result<ListMarketChannelsResult, AppstoreServiceError> {
    let cmd = mapper::request::map_list_market_channels(channel_status, cursor, page_size);
    service.list_channels(context, cmd).await
}

pub async fn market_channels_create<S: MarketOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    channel_code: String,
    channel_type: String,
    provider: String,
    external_store_code: Option<String>,
    api_capability: Option<serde_json::Value>,
    config: Option<serde_json::Value>,
) -> Result<CreateMarketChannelResult, AppstoreServiceError> {
    let cmd = mapper::request::map_create_market_channel(
        channel_code,
        channel_type,
        provider,
        external_store_code,
        api_capability,
        config,
    );
    service.create_channel(context, cmd).await
}

pub async fn market_channels_update<S: MarketOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    market_channel_id: String,
    channel_status: Option<String>,
    external_store_code: Option<String>,
    api_capability: Option<serde_json::Value>,
    config: Option<serde_json::Value>,
) -> Result<UpdateMarketChannelResult, AppstoreServiceError> {
    let cmd = mapper::request::map_update_market_channel(
        market_channel_id,
        channel_status,
        external_store_code,
        api_capability,
        config,
    );
    service.update_channel(context, cmd).await
}

pub async fn market_releases_list<S: MarketOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    release_id: Option<String>,
    channel_id: Option<String>,
    market_status: Option<String>,
    cursor: Option<String>,
    page_size: Option<i32>,
) -> Result<ListMarketReleasesResult, AppstoreServiceError> {
    let cmd = mapper::request::map_list_market_releases(
        release_id,
        channel_id,
        market_status,
        cursor,
        page_size,
    );
    service.list_releases(context, cmd).await
}

pub async fn market_releases_sync<S: MarketOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    market_release_id: String,
    sync_mode: String,
    external_status: Option<serde_json::Value>,
    note: Option<String>,
) -> Result<SyncMarketReleaseResult, AppstoreServiceError> {
    let cmd = mapper::request::map_sync_market_release(
        market_release_id,
        sync_mode,
        external_status,
        note,
    );
    service.sync_release(context, cmd).await
}
