use sdkwork_appstore_catalog_service::domain::commands::{
    CategoriesListRequest, CategoryRetrieveRequest, ChartsRetrieveRequest,
    CollectionRetrieveRequest, CollectionsListRequest, FeaturedListRequest, HomeRetrieveRequest,
    ListingsSearchRequest,
};

pub fn map_home_retrieve(locale: Option<String>, platform: Option<String>) -> HomeRetrieveRequest {
    let mut req = HomeRetrieveRequest::new();
    if let Some(v) = locale {
        req = req.with_locale(v);
    }
    if let Some(v) = platform {
        req = req.with_platform(v);
    }
    req
}

pub fn map_categories_list(
    locale: Option<String>,
    cursor: Option<String>,
    limit: Option<i32>,
) -> CategoriesListRequest {
    let mut req = CategoriesListRequest::new();
    if let Some(v) = locale {
        req = req.with_locale(v);
    }
    if let Some(v) = cursor {
        req = req.with_cursor(v);
    }
    if let Some(v) = limit {
        req = req.with_limit(v);
    }
    req
}

pub fn map_category_retrieve(
    category_id: String,
    locale: Option<String>,
) -> CategoryRetrieveRequest {
    let mut req = CategoryRetrieveRequest::new(category_id);
    if let Some(v) = locale {
        req = req.with_locale(v);
    }
    req
}

pub fn map_collections_list(
    cursor: Option<String>,
    limit: Option<i32>,
    audience_scope: Option<String>,
) -> CollectionsListRequest {
    let mut req = CollectionsListRequest::new();
    if let Some(v) = cursor {
        req = req.with_cursor(v);
    }
    if let Some(v) = limit {
        req = req.with_limit(v);
    }
    if let Some(v) = audience_scope {
        req = req.with_audience_scope(v);
    }
    req
}

pub fn map_collection_retrieve(
    collection_id: String,
    locale: Option<String>,
) -> CollectionRetrieveRequest {
    let mut req = CollectionRetrieveRequest::new(collection_id);
    if let Some(v) = locale {
        req = req.with_locale(v);
    }
    req
}

pub fn map_featured_list(
    audience_scope: Option<String>,
    platform_scope: Option<String>,
) -> FeaturedListRequest {
    let mut req = FeaturedListRequest::new();
    if let Some(v) = audience_scope {
        req = req.with_audience_scope(v);
    }
    if let Some(v) = platform_scope {
        req = req.with_platform_scope(v);
    }
    req
}

pub fn map_charts_retrieve(
    chart_code: String,
    locale: Option<String>,
    platform_scope: Option<String>,
    snapshot_date: Option<String>,
) -> ChartsRetrieveRequest {
    let mut req = ChartsRetrieveRequest::new(chart_code);
    if let Some(v) = locale {
        req = req.with_locale(v);
    }
    if let Some(v) = platform_scope {
        req = req.with_platform_scope(v);
    }
    if let Some(v) = snapshot_date {
        req = req.with_snapshot_date(v);
    }
    req
}

pub fn map_listings_search(
    query: Option<String>,
    category_id: Option<String>,
    cursor: Option<String>,
    limit: Option<i32>,
) -> ListingsSearchRequest {
    let mut req = ListingsSearchRequest::new();
    if let Some(v) = query {
        req = req.with_query(v);
    }
    if let Some(v) = category_id {
        req = req.with_category_id(v);
    }
    if let Some(v) = cursor {
        req = req.with_cursor(v);
    }
    if let Some(v) = limit {
        req = req.with_limit(v);
    }
    req
}
