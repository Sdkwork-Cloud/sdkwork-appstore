//! Route registration descriptors for sdkwork-routes-listing-app-api.

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
        path: "/app/v3/api/listings/{listingId}",
        operation_id: "appstore.listings.retrieve",
        handler: "listings_retrieve",
        service_method: "listings_retrieve",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/listings/{listingId}/media",
        operation_id: "appstore.listings.media.list",
        handler: "listings_media_list",
        service_method: "listings_media_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/listings/{listingId}/releases",
        operation_id: "appstore.listings.releases.list",
        handler: "listings_releases_list",
        service_method: "listings_releases_list",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/listings",
        operation_id: "appstore.listings.create",
        handler: "listings_create",
        service_method: "listings_create",
    },
    RouteDefinition {
        method: "PATCH",
        path: "/app/v3/api/listings/{listingId}",
        operation_id: "appstore.listings.update",
        handler: "listings_update",
        service_method: "listings_update",
    },
    RouteDefinition {
        method: "PUT",
        path: "/app/v3/api/listings/{listingId}/localizations/{locale}",
        operation_id: "appstore.listings.localization.upsert",
        handler: "listings_localization_upsert",
        service_method: "listings_localization_upsert",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/listings/{listingId}/media",
        operation_id: "appstore.listings.media.attach",
        handler: "listings_media_attach",
        service_method: "listings_media_attach",
    },
    RouteDefinition {
        method: "DELETE",
        path: "/app/v3/api/listings/{listingId}/media/{mediaId}",
        operation_id: "appstore.listings.media.remove",
        handler: "listings_media_remove",
        service_method: "listings_media_remove",
    },
    RouteDefinition {
        method: "PUT",
        path: "/app/v3/api/listings/{listingId}/categories",
        operation_id: "appstore.listings.categories.bind",
        handler: "listings_categories_bind",
        service_method: "listings_categories_bind",
    },
    RouteDefinition {
        method: "PUT",
        path: "/app/v3/api/listings/{listingId}/regions",
        operation_id: "appstore.listings.regions.update",
        handler: "listings_regions_update",
        service_method: "listings_regions_update",
    },
    RouteDefinition {
        method: "POST",
        path: "/app/v3/api/listings/{listingId}/submissions",
        operation_id: "appstore.listings.submissions.create",
        handler: "listings_submissions_create",
        service_method: "listings_submissions_create",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/listings/{listingId}/releases/history",
        operation_id: "appstore.listings.releases.history.list",
        handler: "listings_releases_history_list",
        service_method: "listings_releases_history_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/listings/{listingId}/similar",
        operation_id: "appstore.listings.similar.list",
        handler: "listings_similar_list",
        service_method: "listings_similar_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/listings/{listingId}/developer_other",
        operation_id: "appstore.listings.developerOther.list",
        handler: "listings_developer_other_list",
        service_method: "listings_developer_other_list",
    },
    RouteDefinition {
        method: "GET",
        path: "/app/v3/api/listings/{listingId}/editorial",
        operation_id: "appstore.listings.editorial.retrieve",
        handler: "listings_editorial_retrieve",
        service_method: "listings_editorial_retrieve",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
