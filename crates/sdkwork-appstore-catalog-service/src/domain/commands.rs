//! Catalog operation requests.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CatalogOperationRequest {
    pub operation_id: &'static str,
    pub idempotency_key: Option<String>,
}

impl CatalogOperationRequest {
    pub fn new(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            idempotency_key: None,
        }
    }

    pub fn with_idempotency_key(mut self, key: impl Into<String>) -> Self {
        self.idempotency_key = Some(key.into());
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct HomeRetrieveRequest {
    pub locale: Option<String>,
    pub platform: Option<String>,
}

impl HomeRetrieveRequest {
    pub fn new() -> Self {
        Self {
            locale: None,
            platform: None,
        }
    }

    pub fn with_locale(mut self, locale: impl Into<String>) -> Self {
        self.locale = Some(locale.into());
        self
    }

    pub fn with_platform(mut self, platform: impl Into<String>) -> Self {
        self.platform = Some(platform.into());
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CategoriesListRequest {
    pub locale: Option<String>,
    pub cursor: Option<String>,
    pub limit: Option<i32>,
}

impl CategoriesListRequest {
    pub fn new() -> Self {
        Self {
            locale: None,
            cursor: None,
            limit: None,
        }
    }

    pub fn with_locale(mut self, locale: impl Into<String>) -> Self {
        self.locale = Some(locale.into());
        self
    }

    pub fn with_cursor(mut self, cursor: impl Into<String>) -> Self {
        self.cursor = Some(cursor.into());
        self
    }

    pub fn with_limit(mut self, limit: i32) -> Self {
        self.limit = Some(limit);
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CategoryRetrieveRequest {
    pub category_id: String,
    pub locale: Option<String>,
}

impl CategoryRetrieveRequest {
    pub fn new(category_id: impl Into<String>) -> Self {
        Self {
            category_id: category_id.into(),
            locale: None,
        }
    }

    pub fn with_locale(mut self, locale: impl Into<String>) -> Self {
        self.locale = Some(locale.into());
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CategoryCreateRequest {
    pub category_code: String,
    pub parent_category_id: Option<String>,
    pub category_level: Option<i32>,
    pub sort_order: Option<i32>,
    pub icon_media_resource_id: Option<String>,
    pub localizations: Vec<CategoryLocalizationInput>,
}

impl CategoryCreateRequest {
    pub fn new(category_code: impl Into<String>) -> Self {
        Self {
            category_code: category_code.into(),
            parent_category_id: None,
            category_level: None,
            sort_order: None,
            icon_media_resource_id: None,
            localizations: Vec::new(),
        }
    }

    pub fn with_parent_category_id(mut self, id: impl Into<String>) -> Self {
        self.parent_category_id = Some(id.into());
        self
    }

    pub fn with_category_level(mut self, level: i32) -> Self {
        self.category_level = Some(level);
        self
    }

    pub fn with_sort_order(mut self, order: i32) -> Self {
        self.sort_order = Some(order);
        self
    }

    pub fn with_icon_media_resource_id(mut self, id: impl Into<String>) -> Self {
        self.icon_media_resource_id = Some(id.into());
        self
    }

    pub fn with_localizations(mut self, localizations: Vec<CategoryLocalizationInput>) -> Self {
        self.localizations = localizations;
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CategoryLocalizationInput {
    pub locale: String,
    pub display_name: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CategoryUpdateRequest {
    pub category_id: String,
    pub parent_category_id: Option<String>,
    pub category_level: Option<i32>,
    pub sort_order: Option<i32>,
    pub icon_media_resource_id: Option<String>,
    pub status: Option<String>,
    pub localizations: Option<Vec<CategoryLocalizationInput>>,
}

impl CategoryUpdateRequest {
    pub fn new(category_id: impl Into<String>) -> Self {
        Self {
            category_id: category_id.into(),
            parent_category_id: None,
            category_level: None,
            sort_order: None,
            icon_media_resource_id: None,
            status: None,
            localizations: None,
        }
    }

    pub fn with_parent_category_id(mut self, id: impl Into<String>) -> Self {
        self.parent_category_id = Some(id.into());
        self
    }

    pub fn with_category_level(mut self, level: i32) -> Self {
        self.category_level = Some(level);
        self
    }

    pub fn with_sort_order(mut self, order: i32) -> Self {
        self.sort_order = Some(order);
        self
    }

    pub fn with_icon_media_resource_id(mut self, id: impl Into<String>) -> Self {
        self.icon_media_resource_id = Some(id.into());
        self
    }

    pub fn with_status(mut self, status: impl Into<String>) -> Self {
        self.status = Some(status.into());
        self
    }

    pub fn with_localizations(mut self, localizations: Vec<CategoryLocalizationInput>) -> Self {
        self.localizations = Some(localizations);
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CollectionsListRequest {
    pub cursor: Option<String>,
    pub limit: Option<i32>,
    pub audience_scope: Option<String>,
}

impl CollectionsListRequest {
    pub fn new() -> Self {
        Self {
            cursor: None,
            limit: None,
            audience_scope: None,
        }
    }

    pub fn with_cursor(mut self, cursor: impl Into<String>) -> Self {
        self.cursor = Some(cursor.into());
        self
    }

    pub fn with_limit(mut self, limit: i32) -> Self {
        self.limit = Some(limit);
        self
    }

    pub fn with_audience_scope(mut self, scope: impl Into<String>) -> Self {
        self.audience_scope = Some(scope.into());
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CollectionRetrieveRequest {
    pub collection_id: String,
    pub locale: Option<String>,
}

impl CollectionRetrieveRequest {
    pub fn new(collection_id: impl Into<String>) -> Self {
        Self {
            collection_id: collection_id.into(),
            locale: None,
        }
    }

    pub fn with_locale(mut self, locale: impl Into<String>) -> Self {
        self.locale = Some(locale.into());
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CollectionCreateRequest {
    pub collection_code: String,
    pub collection_type: String,
    pub audience_scope: String,
    pub sort_order: Option<i32>,
    pub cover_media_resource_id: Option<String>,
    pub starts_at: Option<String>,
    pub ends_at: Option<String>,
    pub localizations: Vec<CollectionLocalizationInput>,
}

impl CollectionCreateRequest {
    pub fn new(
        collection_code: impl Into<String>,
        collection_type: impl Into<String>,
        audience_scope: impl Into<String>,
    ) -> Self {
        Self {
            collection_code: collection_code.into(),
            collection_type: collection_type.into(),
            audience_scope: audience_scope.into(),
            sort_order: None,
            cover_media_resource_id: None,
            starts_at: None,
            ends_at: None,
            localizations: Vec::new(),
        }
    }

    pub fn with_sort_order(mut self, order: i32) -> Self {
        self.sort_order = Some(order);
        self
    }

    pub fn with_cover_media_resource_id(mut self, id: impl Into<String>) -> Self {
        self.cover_media_resource_id = Some(id.into());
        self
    }

    pub fn with_starts_at(mut self, starts_at: impl Into<String>) -> Self {
        self.starts_at = Some(starts_at.into());
        self
    }

    pub fn with_ends_at(mut self, ends_at: impl Into<String>) -> Self {
        self.ends_at = Some(ends_at.into());
        self
    }

    pub fn with_localizations(mut self, localizations: Vec<CollectionLocalizationInput>) -> Self {
        self.localizations = localizations;
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CollectionLocalizationInput {
    pub locale: String,
    pub display_name: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CollectionUpdateRequest {
    pub collection_id: String,
    pub collection_type: Option<String>,
    pub audience_scope: Option<String>,
    pub sort_order: Option<i32>,
    pub cover_media_resource_id: Option<String>,
    pub starts_at: Option<String>,
    pub ends_at: Option<String>,
    pub status: Option<String>,
    pub localizations: Option<Vec<CollectionLocalizationInput>>,
}

impl CollectionUpdateRequest {
    pub fn new(collection_id: impl Into<String>) -> Self {
        Self {
            collection_id: collection_id.into(),
            collection_type: None,
            audience_scope: None,
            sort_order: None,
            cover_media_resource_id: None,
            starts_at: None,
            ends_at: None,
            status: None,
            localizations: None,
        }
    }

    pub fn with_collection_type(mut self, collection_type: impl Into<String>) -> Self {
        self.collection_type = Some(collection_type.into());
        self
    }

    pub fn with_audience_scope(mut self, scope: impl Into<String>) -> Self {
        self.audience_scope = Some(scope.into());
        self
    }

    pub fn with_sort_order(mut self, order: i32) -> Self {
        self.sort_order = Some(order);
        self
    }

    pub fn with_cover_media_resource_id(mut self, id: impl Into<String>) -> Self {
        self.cover_media_resource_id = Some(id.into());
        self
    }

    pub fn with_starts_at(mut self, starts_at: impl Into<String>) -> Self {
        self.starts_at = Some(starts_at.into());
        self
    }

    pub fn with_ends_at(mut self, ends_at: impl Into<String>) -> Self {
        self.ends_at = Some(ends_at.into());
        self
    }

    pub fn with_status(mut self, status: impl Into<String>) -> Self {
        self.status = Some(status.into());
        self
    }

    pub fn with_localizations(mut self, localizations: Vec<CollectionLocalizationInput>) -> Self {
        self.localizations = Some(localizations);
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CollectionItemInput {
    pub listing_id: String,
    pub sort_order: Option<i32>,
    pub highlight: Option<serde_json::Value>,
    pub starts_at: Option<String>,
    pub ends_at: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CollectionItemsUpsertRequest {
    pub collection_id: String,
    pub items: Vec<CollectionItemInput>,
}

impl CollectionItemsUpsertRequest {
    pub fn new(collection_id: impl Into<String>, items: Vec<CollectionItemInput>) -> Self {
        Self {
            collection_id: collection_id.into(),
            items,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct FeaturedListRequest {
    pub audience_scope: Option<String>,
    pub platform_scope: Option<String>,
}

impl FeaturedListRequest {
    pub fn new() -> Self {
        Self {
            audience_scope: None,
            platform_scope: None,
        }
    }

    pub fn with_audience_scope(mut self, scope: impl Into<String>) -> Self {
        self.audience_scope = Some(scope.into());
        self
    }

    pub fn with_platform_scope(mut self, scope: impl Into<String>) -> Self {
        self.platform_scope = Some(scope.into());
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct FeaturedUpsertRequest {
    pub slot_code: String,
    pub listing_id: String,
    pub audience_scope: String,
    pub platform_scope: Option<String>,
    pub region_scope: Option<Vec<String>>,
    pub starts_at: String,
    pub ends_at: String,
}

impl FeaturedUpsertRequest {
    pub fn new(
        slot_code: impl Into<String>,
        listing_id: impl Into<String>,
        audience_scope: impl Into<String>,
        starts_at: impl Into<String>,
        ends_at: impl Into<String>,
    ) -> Self {
        Self {
            slot_code: slot_code.into(),
            listing_id: listing_id.into(),
            audience_scope: audience_scope.into(),
            platform_scope: None,
            region_scope: None,
            starts_at: starts_at.into(),
            ends_at: ends_at.into(),
        }
    }

    pub fn with_platform_scope(mut self, scope: impl Into<String>) -> Self {
        self.platform_scope = Some(scope.into());
        self
    }

    pub fn with_region_scope(mut self, regions: Vec<String>) -> Self {
        self.region_scope = Some(regions);
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ChartsRetrieveRequest {
    pub chart_code: String,
    pub locale: Option<String>,
    pub platform_scope: Option<String>,
    pub snapshot_date: Option<String>,
}

impl ChartsRetrieveRequest {
    pub fn new(chart_code: impl Into<String>) -> Self {
        Self {
            chart_code: chart_code.into(),
            locale: None,
            platform_scope: None,
            snapshot_date: None,
        }
    }

    pub fn with_locale(mut self, locale: impl Into<String>) -> Self {
        self.locale = Some(locale.into());
        self
    }

    pub fn with_platform_scope(mut self, scope: impl Into<String>) -> Self {
        self.platform_scope = Some(scope.into());
        self
    }

    pub fn with_snapshot_date(mut self, date: impl Into<String>) -> Self {
        self.snapshot_date = Some(date.into());
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ListingsSearchRequest {
    pub query: Option<String>,
    pub category_id: Option<String>,
    pub cursor: Option<String>,
    pub limit: Option<i32>,
}

impl ListingsSearchRequest {
    pub fn new() -> Self {
        Self {
            query: None,
            category_id: None,
            cursor: None,
            limit: None,
        }
    }

    pub fn with_query(mut self, query: impl Into<String>) -> Self {
        self.query = Some(query.into());
        self
    }

    pub fn with_category_id(mut self, category_id: impl Into<String>) -> Self {
        self.category_id = Some(category_id.into());
        self
    }

    pub fn with_cursor(mut self, cursor: impl Into<String>) -> Self {
        self.cursor = Some(cursor.into());
        self
    }

    pub fn with_limit(mut self, limit: i32) -> Self {
        self.limit = Some(limit);
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct MetricsRetrieveRequest {
    pub listing_id: String,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
}

impl MetricsRetrieveRequest {
    pub fn new(listing_id: impl Into<String>) -> Self {
        Self {
            listing_id: listing_id.into(),
            start_date: None,
            end_date: None,
        }
    }

    pub fn with_start_date(mut self, date: impl Into<String>) -> Self {
        self.start_date = Some(date.into());
        self
    }

    pub fn with_end_date(mut self, date: impl Into<String>) -> Self {
        self.end_date = Some(date.into());
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct PublicFeaturedListRequest {
    pub locale: Option<String>,
    pub platform: Option<String>,
    pub limit: Option<i32>,
}

impl PublicFeaturedListRequest {
    pub fn new() -> Self {
        Self {
            locale: None,
            platform: None,
            limit: None,
        }
    }

    pub fn with_locale(mut self, locale: impl Into<String>) -> Self {
        self.locale = Some(locale.into());
        self
    }

    pub fn with_platform(mut self, platform: impl Into<String>) -> Self {
        self.platform = Some(platform.into());
        self
    }

    pub fn with_limit(mut self, limit: i32) -> Self {
        self.limit = Some(limit);
        self
    }
}
