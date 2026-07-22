//! Route registration descriptors for sdkwork-routes-market-backend-api.

pub use sdkwork_appstore_routes_common::RouteDefinition;
use sdkwork_web_core::RouteAuth;

pub const ROUTES: &[RouteDefinition] = &[
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/market_channels",
        operation_id: "appstore.marketChannels.list",
        auth: RouteAuth::DualToken,
        handler: "market_channels_list",
        service_method: "market_channels_list",
    },
    RouteDefinition {
        method: "POST",
        path: "/backend/v3/api/market_channels",
        operation_id: "appstore.marketChannels.create",
        auth: RouteAuth::DualToken,
        handler: "market_channels_create",
        service_method: "market_channels_create",
    },
    RouteDefinition {
        method: "PATCH",
        path: "/backend/v3/api/market_channels/{marketChannelId}",
        operation_id: "appstore.marketChannels.update",
        auth: RouteAuth::DualToken,
        handler: "market_channels_update",
        service_method: "market_channels_update",
    },
    RouteDefinition {
        method: "GET",
        path: "/backend/v3/api/market_releases",
        operation_id: "appstore.marketReleases.list",
        auth: RouteAuth::DualToken,
        handler: "market_releases_list",
        service_method: "market_releases_list",
    },
    RouteDefinition {
        method: "POST",
        path: "/backend/v3/api/market_releases/{marketReleaseId}/sync",
        operation_id: "appstore.marketReleases.sync",
        auth: RouteAuth::DualToken,
        handler: "market_releases_sync",
        service_method: "market_releases_sync",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
