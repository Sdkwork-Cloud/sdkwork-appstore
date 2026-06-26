use sdkwork_appstore_market_service::domain::commands::{
    CreateMarketChannelRequest, ListMarketChannelsRequest, ListMarketReleasesRequest,
    SyncMarketReleaseRequest, UpdateMarketChannelRequest,
};

pub fn map_list_market_channels(
    channel_status: Option<String>,
    cursor: Option<String>,
    limit: Option<i32>,
) -> ListMarketChannelsRequest {
    let mut req = ListMarketChannelsRequest::new();
    if let Some(v) = channel_status {
        req = req.with_channel_status(v);
    }
    if let Some(v) = cursor {
        req = req.with_cursor(v);
    }
    if let Some(v) = limit {
        req = req.with_limit(v);
    }
    req
}

pub fn map_create_market_channel(
    channel_code: String,
    channel_type: String,
    provider: String,
    external_store_code: Option<String>,
    api_capability: Option<serde_json::Value>,
    config: Option<serde_json::Value>,
) -> CreateMarketChannelRequest {
    let mut req = CreateMarketChannelRequest::new(channel_code, channel_type, provider);
    if let Some(v) = external_store_code {
        req = req.with_external_store_code(v);
    }
    if let Some(v) = api_capability {
        req = req.with_api_capability(v);
    }
    if let Some(v) = config {
        req = req.with_config(v);
    }
    req
}

pub fn map_update_market_channel(
    market_channel_id: String,
    channel_status: Option<String>,
    external_store_code: Option<String>,
    api_capability: Option<serde_json::Value>,
    config: Option<serde_json::Value>,
) -> UpdateMarketChannelRequest {
    let mut req = UpdateMarketChannelRequest::new(market_channel_id);
    if let Some(v) = channel_status {
        req = req.with_channel_status(v);
    }
    if let Some(v) = external_store_code {
        req = req.with_external_store_code(v);
    }
    if let Some(v) = api_capability {
        req = req.with_api_capability(v);
    }
    if let Some(v) = config {
        req = req.with_config(v);
    }
    req
}

pub fn map_list_market_releases(
    release_id: Option<String>,
    channel_id: Option<String>,
    market_status: Option<String>,
    cursor: Option<String>,
    limit: Option<i32>,
) -> ListMarketReleasesRequest {
    let mut req = ListMarketReleasesRequest::new();
    if let Some(v) = release_id {
        req = req.with_release_id(v);
    }
    if let Some(v) = channel_id {
        req = req.with_channel_id(v);
    }
    if let Some(v) = market_status {
        req = req.with_market_status(v);
    }
    if let Some(v) = cursor {
        req = req.with_cursor(v);
    }
    if let Some(v) = limit {
        req = req.with_limit(v);
    }
    req
}

pub fn map_sync_market_release(
    market_release_id: String,
    sync_mode: String,
    external_status: Option<serde_json::Value>,
    note: Option<String>,
) -> SyncMarketReleaseRequest {
    let mut req = SyncMarketReleaseRequest::new(market_release_id, sync_mode);
    if let Some(v) = external_status {
        req = req.with_external_status(v);
    }
    if let Some(v) = note {
        req = req.with_note(v);
    }
    req
}
