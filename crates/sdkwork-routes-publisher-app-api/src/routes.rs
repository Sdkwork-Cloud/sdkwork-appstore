//! Route registration descriptors for sdkwork-routes-publisher-app-api.

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
        path: "/app/v3/api/publishers/me",
        operation_id: "appstore.publishers.me.retrieve",
        handler: "publishers_me_retrieve",
        service_method: "publishers_me_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/publishers/me/listings",
        operation_id: "appstore.publishers.me.listings.list",
        handler: "publishers_me_listings_list",
        service_method: "list_publisher_listings",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/publishers/me/apps",
        operation_id: "appstore.publishers.me.apps.bootstrap",
        handler: "publishers_me_apps_bootstrap",
        service_method: "bootstrap_publisher_app",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/publishers",
        operation_id: "appstore.publishers.create",
        handler: "publishers_create",
        service_method: "publishers_create",
    },
    RouteDefinition {
        method: "PATCH",
        path: "/app/v3/api/publishers/{publisherId}",
        operation_id: "appstore.publishers.update",
        handler: "publishers_update",
        service_method: "publishers_update",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/publishers/{publisherId}/members",
        operation_id: "appstore.publishers.members.list",
        handler: "publishers_members_list",
        service_method: "publishers_members_list",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/publishers/{publisherId}/members",
        operation_id: "appstore.publishers.members.invite",
        handler: "publishers_members_invite",
        service_method: "publishers_members_invite",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/publishers/{publisherId}/verifications",
        operation_id: "appstore.publishers.verifications.submit",
        handler: "publishers_verifications_submit",
        service_method: "publishers_verifications_submit",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
