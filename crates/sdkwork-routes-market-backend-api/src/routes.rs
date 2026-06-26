//! Route registration descriptors for sdkwork-routes-market-backend-api.

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteDefinition {
    pub method: &'static str,
    pub path: &'static str,
    pub operation_id: &'static str,
    pub handler: &'static str,
    pub service_method: &'static str,
}

pub const ROUTES: &[RouteDefinition] = &[
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/market_channels",
        operation_id: "appstore.marketChannels.list",
        handler: "market_channels_list",
        service_method: "market_channels_list",
    },
    RouteDefinition {
        method: "POST",
        path: "/backend/v3/api/market_channels",
        operation_id: "appstore.marketChannels.create",
        handler: "market_channels_create",
        service_method: "market_channels_create",
    },
    RouteDefinition {
        method: "PATCH",
        path: "/backend/v3/api/market_channels/{marketChannelId}",
        operation_id: "appstore.marketChannels.update",
        handler: "market_channels_update",
        service_method: "market_channels_update",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/market_releases",
        operation_id: "appstore.marketReleases.list",
        handler: "market_releases_list",
        service_method: "market_releases_list",
    },
    RouteDefinition {
        method: "POST",
        path: "/backend/v3/api/market_releases/{marketReleaseId}/sync",
        operation_id: "appstore.marketReleases.sync",
        handler: "market_releases_sync",
        service_method: "market_releases_sync",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
