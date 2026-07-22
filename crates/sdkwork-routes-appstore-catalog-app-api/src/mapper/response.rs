use sdkwork_appstore_catalog_service::domain::results::{
    CategoriesListResult, CategoryRetrieveResult, ChartsRetrieveResult, CollectionRetrieveResult,
    CollectionsListResult, FeaturedListResult, HomeRetrieveResult, ListingsSearchResult,
};

pub fn map_home_retrieve_response(result: HomeRetrieveResult) -> HomeRetrieveResult {
    result
}

pub fn map_categories_list_response(result: CategoriesListResult) -> CategoriesListResult {
    result
}

pub fn map_category_retrieve_response(result: CategoryRetrieveResult) -> CategoryRetrieveResult {
    result
}

pub fn map_collections_list_response(result: CollectionsListResult) -> CollectionsListResult {
    result
}

pub fn map_collection_retrieve_response(
    result: CollectionRetrieveResult,
) -> CollectionRetrieveResult {
    result
}

pub fn map_featured_list_response(result: FeaturedListResult) -> FeaturedListResult {
    result
}

pub fn map_charts_retrieve_response(result: ChartsRetrieveResult) -> ChartsRetrieveResult {
    result
}

pub fn map_listings_search_response(result: ListingsSearchResult) -> ListingsSearchResult {
    result
}
