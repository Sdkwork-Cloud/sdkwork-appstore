//! Route registration descriptors for sdkwork-routes-publisher-app-api.

pub use sdkwork_appstore_routes_common::RouteDefinition;
use sdkwork_web_core::RouteAuth;

pub const ROUTES: &[RouteDefinition] = &[
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/publishers/me",
        operation_id: "appstore.publishers.me.retrieve",
        auth: RouteAuth::DualToken,
        handler: "publishers_me_retrieve",
        service_method: "publishers_me_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/publishers/me/listings",
        operation_id: "appstore.publishers.me.listings.list",
        auth: RouteAuth::DualToken,
        handler: "publishers_me_listings_list",
        service_method: "list_publisher_listings",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/publishers/me/apps",
        operation_id: "appstore.publishers.me.apps.create",
        auth: RouteAuth::DualToken,
        handler: "publishers_me_apps_bootstrap",
        service_method: "bootstrap_publisher_app",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/publishers",
        operation_id: "appstore.publishers.create",
        auth: RouteAuth::DualToken,
        handler: "publishers_create",
        service_method: "publishers_create",
    },
    RouteDefinition {
        method: "PATCH",
        path: "/app/v3/api/publishers/{publisherId}",
        operation_id: "appstore.publishers.update",
        auth: RouteAuth::DualToken,
        handler: "publishers_update",
        service_method: "publishers_update",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/publishers/{publisherId}/members",
        operation_id: "appstore.publishers.members.list",
        auth: RouteAuth::DualToken,
        handler: "publishers_members_list",
        service_method: "publishers_members_list",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/publishers/{publisherId}/members",
        operation_id: "appstore.publishers.members.create",
        auth: RouteAuth::DualToken,
        handler: "publishers_members_invite",
        service_method: "publishers_members_invite",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/publishers/{publisherId}/verifications",
        operation_id: "appstore.publishers.verifications.create",
        auth: RouteAuth::DualToken,
        handler: "publishers_verifications_submit",
        service_method: "publishers_verifications_submit",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
