use sdkwork_appstore_catalog_service::domain::results::{
    CategoryCreateResult, CategoryUpdateResult, CollectionCreateResult,
    CollectionItemsUpsertResult, CollectionUpdateResult, FeaturedUpsertResult,
};

pub fn map_collection_create_response(result: CollectionCreateResult) -> CollectionCreateResult {
    result
}

pub fn map_collection_update_response(result: CollectionUpdateResult) -> CollectionUpdateResult {
    result
}

pub fn map_collection_items_upsert_response(
    result: CollectionItemsUpsertResult,
) -> CollectionItemsUpsertResult {
    result
}

pub fn map_featured_upsert_response(result: FeaturedUpsertResult) -> FeaturedUpsertResult {
    result
}

pub fn map_category_create_response(result: CategoryCreateResult) -> CategoryCreateResult {
    result
}

pub fn map_category_update_response(result: CategoryUpdateResult) -> CategoryUpdateResult {
    result
}
