//! Route registration descriptors for sdkwork-router-catalog-backend-api.

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
        method: "POST",
        path: "/backend/v3/api/catalog/collections",
        operation_id: "appstore.catalog.collections.create",
        handler: "catalog_collections_create",
        service_method: "catalog_collections_create",
    },
    RouteDefinition {
        method: "PATCH",
        path: "/backend/v3/api/catalog/collections/{collectionId}",
        operation_id: "appstore.catalog.collections.update",
        handler: "catalog_collections_update",
        service_method: "catalog_collections_update",
    },
    RouteDefinition {
        method: "PUT",
        path: "/backend/v3/api/catalog/collections/{collectionId}/items",
        operation_id: "appstore.catalog.collections.items.upsert",
        handler: "catalog_collections_items_upsert",
        service_method: "catalog_collections_items_upsert",
    },
    RouteDefinition {
        method: "PUT",
        path: "/backend/v3/api/catalog/featured/{slotCode}",
        operation_id: "appstore.catalog.featured.upsert",
        handler: "catalog_featured_upsert",
        service_method: "catalog_featured_upsert",
    },
    RouteDefinition {
        method: "POST",
        path: "/backend/v3/api/catalog/categories",
        operation_id: "appstore.catalog.categories.create",
        handler: "catalog_categories_create",
        service_method: "catalog_categories_create",
    },
    RouteDefinition {
        method: "PATCH",
        path: "/backend/v3/api/catalog/categories/{categoryId}",
        operation_id: "appstore.catalog.categories.update",
        handler: "catalog_categories_update",
        service_method: "catalog_categories_update",
    },
];

pub fn route_definitions() -> &'static [RouteDefinition] {
    ROUTES
}
