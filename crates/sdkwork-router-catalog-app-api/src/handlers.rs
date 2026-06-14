use crate::mapper;
use sdkwork_appstore_catalog_service::context::AppstoreRequestContext;
use sdkwork_appstore_catalog_service::domain::results::{
    CategoriesListResult, CategoryRetrieveResult, ChartsRetrieveResult, CollectionRetrieveResult,
    CollectionsListResult, FeaturedListResult, HomeRetrieveResult, ListingsSearchResult,
};
use sdkwork_appstore_catalog_service::error::AppstoreServiceError;
use sdkwork_appstore_catalog_service::CatalogOperations;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteHandlerPlan {
    pub operation_id: &'static str,
    pub handler_name: &'static str,
    pub service_method: &'static str,
}

pub const ROUTE_HANDLER_PLANS: &[RouteHandlerPlan] = &[
    RouteHandlerPlan {
        operation_id: "appstore.catalog.home.retrieve",
        handler_name: "catalog_home_retrieve",
        service_method: "retrieve_home",
    },
    RouteHandlerPlan {
        operation_id: "appstore.catalog.categories.list",
        handler_name: "catalog_categories_list",
        service_method: "list_categories",
    },
    RouteHandlerPlan {
        operation_id: "appstore.catalog.categories.retrieve",
        handler_name: "catalog_categories_retrieve",
        service_method: "retrieve_category",
    },
    RouteHandlerPlan {
        operation_id: "appstore.catalog.collections.list",
        handler_name: "catalog_collections_list",
        service_method: "list_collections",
    },
    RouteHandlerPlan {
        operation_id: "appstore.catalog.collections.retrieve",
        handler_name: "catalog_collections_retrieve",
        service_method: "retrieve_collection",
    },
    RouteHandlerPlan {
        operation_id: "appstore.catalog.featured.list",
        handler_name: "catalog_featured_list",
        service_method: "list_featured",
    },
    RouteHandlerPlan {
        operation_id: "appstore.catalog.charts.retrieve",
        handler_name: "catalog_charts_retrieve",
        service_method: "retrieve_charts",
    },
    RouteHandlerPlan {
        operation_id: "appstore.catalog.listings.search",
        handler_name: "catalog_listings_search",
        service_method: "search_listings",
    },
];

pub fn route_handler_plans() -> &'static [RouteHandlerPlan] {
    ROUTE_HANDLER_PLANS
}

pub async fn catalog_home_retrieve<S: CatalogOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    locale: Option<String>,
    platform: Option<String>,
) -> Result<HomeRetrieveResult, AppstoreServiceError> {
    let cmd = mapper::request::map_home_retrieve(locale, platform);
    service.home_retrieve(context, cmd).await
}

pub async fn catalog_categories_list<S: CatalogOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    locale: Option<String>,
    cursor: Option<String>,
    limit: Option<i32>,
) -> Result<CategoriesListResult, AppstoreServiceError> {
    let cmd = mapper::request::map_categories_list(locale, cursor, limit);
    service.categories_list(context, cmd).await
}

pub async fn catalog_categories_retrieve<S: CatalogOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    category_id: String,
    locale: Option<String>,
) -> Result<CategoryRetrieveResult, AppstoreServiceError> {
    let cmd = mapper::request::map_category_retrieve(category_id, locale);
    service.category_retrieve(context, cmd).await
}

pub async fn catalog_collections_list<S: CatalogOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    cursor: Option<String>,
    limit: Option<i32>,
    audience_scope: Option<String>,
) -> Result<CollectionsListResult, AppstoreServiceError> {
    let cmd = mapper::request::map_collections_list(cursor, limit, audience_scope);
    service.collections_list(context, cmd).await
}

pub async fn catalog_collections_retrieve<S: CatalogOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    collection_id: String,
    locale: Option<String>,
) -> Result<CollectionRetrieveResult, AppstoreServiceError> {
    let cmd = mapper::request::map_collection_retrieve(collection_id, locale);
    service.collection_retrieve(context, cmd).await
}

pub async fn catalog_featured_list<S: CatalogOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    audience_scope: Option<String>,
    platform_scope: Option<String>,
) -> Result<FeaturedListResult, AppstoreServiceError> {
    let cmd = mapper::request::map_featured_list(audience_scope, platform_scope);
    service.featured_list(context, cmd).await
}

pub async fn catalog_charts_retrieve<S: CatalogOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    chart_code: String,
    locale: Option<String>,
    platform_scope: Option<String>,
    snapshot_date: Option<String>,
) -> Result<ChartsRetrieveResult, AppstoreServiceError> {
    let cmd =
        mapper::request::map_charts_retrieve(chart_code, locale, platform_scope, snapshot_date);
    service.charts_retrieve(context, cmd).await
}

pub async fn catalog_listings_search<S: CatalogOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    query: Option<String>,
    category_id: Option<String>,
    cursor: Option<String>,
    limit: Option<i32>,
) -> Result<ListingsSearchResult, AppstoreServiceError> {
    let cmd = mapper::request::map_listings_search(query, category_id, cursor, limit);
    service.listings_search(context, cmd).await
}
