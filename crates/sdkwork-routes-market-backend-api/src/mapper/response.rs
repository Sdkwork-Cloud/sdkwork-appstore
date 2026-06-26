use sdkwork_appstore_market_service::domain::results::{
    CreateMarketChannelResult, ListMarketChannelsResult, ListMarketReleasesResult,
    SyncMarketReleaseResult, UpdateMarketChannelResult,
};

pub fn map_list_market_channels_response(
    result: ListMarketChannelsResult,
) -> ListMarketChannelsResult {
    result
}

pub fn map_create_market_channel_response(
    result: CreateMarketChannelResult,
) -> CreateMarketChannelResult {
    result
}

pub fn map_update_market_channel_response(
    result: UpdateMarketChannelResult,
) -> UpdateMarketChannelResult {
    result
}

pub fn map_list_market_releases_response(
    result: ListMarketReleasesResult,
) -> ListMarketReleasesResult {
    result
}

pub fn map_sync_market_release_response(
    result: SyncMarketReleaseResult,
) -> SyncMarketReleaseResult {
    result
}
