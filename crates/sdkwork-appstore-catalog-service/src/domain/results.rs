//! Catalog operation results.

use serde::{Deserialize, Serialize};

use super::models::{
    CatalogChartSnapshot, CatalogCollection, CatalogCollectionItem, CatalogCollectionLocalization,
    CatalogFeaturedSlot, Category, CategoryLocalization, CategoryWithLocalizations,
    CollectionWithItems, ListingMetricSnapshot, ListingSummary,
};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CatalogOperationResult {
    pub operation_id: &'static str,
    pub accepted: bool,
}

impl CatalogOperationResult {
    pub fn accepted(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            accepted: true,
        }
    }

    pub fn rejected(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            accepted: false,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct HomeRetrieveResult {
    pub operation_id: &'static str,
    pub featured_slots: Vec<CatalogFeaturedSlot>,
    pub collections: Vec<CatalogCollection>,
    pub charts: Vec<CatalogChartSnapshot>,
}

impl HomeRetrieveResult {
    pub fn new(
        operation_id: &'static str,
        featured_slots: Vec<CatalogFeaturedSlot>,
        collections: Vec<CatalogCollection>,
        charts: Vec<CatalogChartSnapshot>,
    ) -> Self {
        Self {
            operation_id,
            featured_slots,
            collections,
            charts,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CategoriesListResult {
    pub operation_id: &'static str,
    pub categories: Vec<CategoryWithLocalizations>,
    pub next_cursor: Option<String>,
    pub has_more: bool,
}

impl CategoriesListResult {
    pub fn new(
        operation_id: &'static str,
        categories: Vec<CategoryWithLocalizations>,
        next_cursor: Option<String>,
        has_more: bool,
    ) -> Self {
        Self {
            operation_id,
            categories,
            next_cursor,
            has_more,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CategoryRetrieveResult {
    pub operation_id: &'static str,
    pub category: Option<CategoryWithLocalizations>,
}

impl CategoryRetrieveResult {
    pub fn found(operation_id: &'static str, category: CategoryWithLocalizations) -> Self {
        Self {
            operation_id,
            category: Some(category),
        }
    }

    pub fn not_found(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            category: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CategoryCreateResult {
    pub operation_id: &'static str,
    pub category: Category,
    pub localizations: Vec<CategoryLocalization>,
}

impl CategoryCreateResult {
    pub fn created(
        operation_id: &'static str,
        category: Category,
        localizations: Vec<CategoryLocalization>,
    ) -> Self {
        Self {
            operation_id,
            category,
            localizations,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CategoryUpdateResult {
    pub operation_id: &'static str,
    pub category: Category,
    pub localizations: Vec<CategoryLocalization>,
}

impl CategoryUpdateResult {
    pub fn updated(
        operation_id: &'static str,
        category: Category,
        localizations: Vec<CategoryLocalization>,
    ) -> Self {
        Self {
            operation_id,
            category,
            localizations,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CollectionsListResult {
    pub operation_id: &'static str,
    pub collections: Vec<CollectionWithItems>,
    pub next_cursor: Option<String>,
    pub has_more: bool,
}

impl CollectionsListResult {
    pub fn new(
        operation_id: &'static str,
        collections: Vec<CollectionWithItems>,
        next_cursor: Option<String>,
        has_more: bool,
    ) -> Self {
        Self {
            operation_id,
            collections,
            next_cursor,
            has_more,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CollectionRetrieveResult {
    pub operation_id: &'static str,
    pub collection: Option<CollectionWithItems>,
}

impl CollectionRetrieveResult {
    pub fn found(operation_id: &'static str, collection: CollectionWithItems) -> Self {
        Self {
            operation_id,
            collection: Some(collection),
        }
    }

    pub fn not_found(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            collection: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CollectionCreateResult {
    pub operation_id: &'static str,
    pub collection: CatalogCollection,
    pub localizations: Vec<CatalogCollectionLocalization>,
}

impl CollectionCreateResult {
    pub fn created(
        operation_id: &'static str,
        collection: CatalogCollection,
        localizations: Vec<CatalogCollectionLocalization>,
    ) -> Self {
        Self {
            operation_id,
            collection,
            localizations,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CollectionUpdateResult {
    pub operation_id: &'static str,
    pub collection: CatalogCollection,
    pub localizations: Vec<CatalogCollectionLocalization>,
}

impl CollectionUpdateResult {
    pub fn updated(
        operation_id: &'static str,
        collection: CatalogCollection,
        localizations: Vec<CatalogCollectionLocalization>,
    ) -> Self {
        Self {
            operation_id,
            collection,
            localizations,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CollectionItemsUpsertResult {
    pub operation_id: &'static str,
    pub items: Vec<CatalogCollectionItem>,
}

impl CollectionItemsUpsertResult {
    pub fn upserted(operation_id: &'static str, items: Vec<CatalogCollectionItem>) -> Self {
        Self {
            operation_id,
            items,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct FeaturedListResult {
    pub operation_id: &'static str,
    pub slots: Vec<CatalogFeaturedSlot>,
}

impl FeaturedListResult {
    pub fn new(operation_id: &'static str, slots: Vec<CatalogFeaturedSlot>) -> Self {
        Self {
            operation_id,
            slots,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct FeaturedUpsertResult {
    pub operation_id: &'static str,
    pub slot: CatalogFeaturedSlot,
}

impl FeaturedUpsertResult {
    pub fn upserted(operation_id: &'static str, slot: CatalogFeaturedSlot) -> Self {
        Self { operation_id, slot }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ChartsRetrieveResult {
    pub operation_id: &'static str,
    pub chart: Option<CatalogChartSnapshot>,
}

impl ChartsRetrieveResult {
    pub fn found(operation_id: &'static str, chart: CatalogChartSnapshot) -> Self {
        Self {
            operation_id,
            chart: Some(chart),
        }
    }

    pub fn not_found(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            chart: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ListingsSearchResult {
    pub operation_id: &'static str,
    pub listings: Vec<ListingSummary>,
    pub next_cursor: Option<String>,
    pub has_more: bool,
}

impl ListingsSearchResult {
    pub fn new(
        operation_id: &'static str,
        listings: Vec<ListingSummary>,
        next_cursor: Option<String>,
        has_more: bool,
    ) -> Self {
        Self {
            operation_id,
            listings,
            next_cursor,
            has_more,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct MetricsRetrieveResult {
    pub operation_id: &'static str,
    pub metrics: Vec<ListingMetricSnapshot>,
}

impl MetricsRetrieveResult {
    pub fn new(operation_id: &'static str, metrics: Vec<ListingMetricSnapshot>) -> Self {
        Self {
            operation_id,
            metrics,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct PublicFeaturedListResult {
    pub operation_id: &'static str,
    pub slots: Vec<CatalogFeaturedSlot>,
}

impl PublicFeaturedListResult {
    pub fn new(operation_id: &'static str, slots: Vec<CatalogFeaturedSlot>) -> Self {
        Self {
            operation_id,
            slots,
        }
    }
}
