//! Catalog service entrypoint.

use chrono::Utc;
use uuid::Uuid;

use crate::context::AppstoreRequestContext;
use crate::domain::commands::{
    CategoriesListRequest, CategoryCreateRequest, CategoryRetrieveRequest, CategoryUpdateRequest,
    ChartsRetrieveRequest, CollectionCreateRequest, CollectionItemsUpsertRequest,
    CollectionRetrieveRequest, CollectionUpdateRequest, CollectionsListRequest,
    FeaturedListRequest, FeaturedUpsertRequest, HomeRetrieveRequest, ListingsSearchRequest,
    MetricsRetrieveRequest, PublicFeaturedListRequest,
};
use crate::domain::models::{
    AudienceScope, CatalogCollection, CatalogCollectionItem, CatalogCollectionLocalization,
    CatalogFeaturedSlot, Category, CategoryId, CategoryLocalization, CategoryStatus,
    CategoryWithLocalizations, CollectionId, CollectionStatus, CollectionType, CollectionWithItems,
    FeaturedSlotId, FeaturedSlotStatus, ListingSummary, PlatformScope,
};
use crate::domain::results::{
    CategoriesListResult, CategoryCreateResult, CategoryRetrieveResult, CategoryUpdateResult,
    ChartsRetrieveResult, CollectionCreateResult, CollectionItemsUpsertResult,
    CollectionRetrieveResult, CollectionUpdateResult, CollectionsListResult, FeaturedListResult,
    FeaturedUpsertResult, HomeRetrieveResult, ListingsSearchResult, MetricsRetrieveResult,
    PublicFeaturedListResult,
};
use crate::error::{AppstoreServiceError, AppstoreServiceResult};
use crate::ports::repository::CatalogRepositoryPort;

#[async_trait::async_trait]
pub trait CatalogOperations {
    async fn home_retrieve(
        &self,
        context: &AppstoreRequestContext,
        request: HomeRetrieveRequest,
    ) -> AppstoreServiceResult<HomeRetrieveResult>;

    async fn categories_list(
        &self,
        context: &AppstoreRequestContext,
        request: CategoriesListRequest,
    ) -> AppstoreServiceResult<CategoriesListResult>;

    async fn category_retrieve(
        &self,
        context: &AppstoreRequestContext,
        request: CategoryRetrieveRequest,
    ) -> AppstoreServiceResult<CategoryRetrieveResult>;

    async fn category_create(
        &self,
        context: &AppstoreRequestContext,
        request: CategoryCreateRequest,
    ) -> AppstoreServiceResult<CategoryCreateResult>;

    async fn category_update(
        &self,
        context: &AppstoreRequestContext,
        request: CategoryUpdateRequest,
    ) -> AppstoreServiceResult<CategoryUpdateResult>;

    async fn collections_list(
        &self,
        context: &AppstoreRequestContext,
        request: CollectionsListRequest,
    ) -> AppstoreServiceResult<CollectionsListResult>;

    async fn collection_retrieve(
        &self,
        context: &AppstoreRequestContext,
        request: CollectionRetrieveRequest,
    ) -> AppstoreServiceResult<CollectionRetrieveResult>;

    async fn collection_create(
        &self,
        context: &AppstoreRequestContext,
        request: CollectionCreateRequest,
    ) -> AppstoreServiceResult<CollectionCreateResult>;

    async fn collection_update(
        &self,
        context: &AppstoreRequestContext,
        request: CollectionUpdateRequest,
    ) -> AppstoreServiceResult<CollectionUpdateResult>;

    async fn collection_items_upsert(
        &self,
        context: &AppstoreRequestContext,
        request: CollectionItemsUpsertRequest,
    ) -> AppstoreServiceResult<CollectionItemsUpsertResult>;

    async fn featured_list(
        &self,
        context: &AppstoreRequestContext,
        request: FeaturedListRequest,
    ) -> AppstoreServiceResult<FeaturedListResult>;

    async fn featured_upsert(
        &self,
        context: &AppstoreRequestContext,
        request: FeaturedUpsertRequest,
    ) -> AppstoreServiceResult<FeaturedUpsertResult>;

    async fn charts_retrieve(
        &self,
        context: &AppstoreRequestContext,
        request: ChartsRetrieveRequest,
    ) -> AppstoreServiceResult<ChartsRetrieveResult>;

    async fn listings_search(
        &self,
        context: &AppstoreRequestContext,
        request: ListingsSearchRequest,
    ) -> AppstoreServiceResult<ListingsSearchResult>;

    async fn metrics_retrieve(
        &self,
        context: &AppstoreRequestContext,
        request: MetricsRetrieveRequest,
    ) -> AppstoreServiceResult<MetricsRetrieveResult>;

    async fn public_featured_list(
        &self,
        context: &AppstoreRequestContext,
        request: PublicFeaturedListRequest,
    ) -> AppstoreServiceResult<PublicFeaturedListResult>;
}

#[derive(Debug, Clone)]
pub struct CatalogService<R> {
    repository: R,
}

impl<R> CatalogService<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }
}

#[async_trait::async_trait]
impl<R> CatalogOperations for CatalogService<R>
where
    R: CatalogRepositoryPort,
{
    async fn home_retrieve(
        &self,
        context: &AppstoreRequestContext,
        _request: HomeRetrieveRequest,
    ) -> AppstoreServiceResult<HomeRetrieveResult> {
        let featured_slots = self.repository.find_featured_slots(context).await?;
        let collections = self.repository.find_collections(context, None, 20).await?;
        let latest_chart = self
            .repository
            .find_latest_chart_snapshot(context, "top", "en-US", "ALL")
            .await?;
        let charts = latest_chart.into_iter().collect();

        Ok(HomeRetrieveResult::new(
            "appstore.catalog.home.retrieve",
            featured_slots,
            collections,
            charts,
        ))
    }

    async fn categories_list(
        &self,
        context: &AppstoreRequestContext,
        request: CategoriesListRequest,
    ) -> AppstoreServiceResult<CategoriesListResult> {
        let limit = request.limit.unwrap_or(20).min(100);
        let categories = self
            .repository
            .find_categories(context, request.cursor.as_deref(), limit + 1)
            .await?;

        let has_more = categories.len() > limit as usize;
        let categories: Vec<Category> = categories.into_iter().take(limit as usize).collect();
        let next_cursor = if has_more {
            categories.last().map(|c| c.id.as_str().to_string())
        } else {
            None
        };

        let mut result_categories = Vec::new();
        for category in categories {
            let localizations = self
                .repository
                .find_category_localizations(context, &category.id)
                .await?;
            result_categories.push(CategoryWithLocalizations {
                category,
                localizations,
            });
        }

        Ok(CategoriesListResult::new(
            "appstore.catalog.categories.list",
            result_categories,
            next_cursor,
            has_more,
        ))
    }

    async fn category_retrieve(
        &self,
        context: &AppstoreRequestContext,
        request: CategoryRetrieveRequest,
    ) -> AppstoreServiceResult<CategoryRetrieveResult> {
        let category_id = CategoryId::new(&request.category_id);
        let category = self
            .repository
            .find_category_by_id(context, &category_id)
            .await?;

        match category {
            Some(category) => {
                let localizations = self
                    .repository
                    .find_category_localizations(context, &category_id)
                    .await?;
                Ok(CategoryRetrieveResult::found(
                    "appstore.catalog.categories.retrieve",
                    CategoryWithLocalizations {
                        category,
                        localizations,
                    },
                ))
            }
            None => Ok(CategoryRetrieveResult::not_found(
                "appstore.catalog.categories.retrieve",
            )),
        }
    }

    async fn category_create(
        &self,
        context: &AppstoreRequestContext,
        request: CategoryCreateRequest,
    ) -> AppstoreServiceResult<CategoryCreateResult> {
        if request.category_code.trim().is_empty() {
            return Err(AppstoreServiceError::ValidationFailed(
                "Category code is required".to_string(),
            ));
        }

        let existing = self
            .repository
            .find_category_by_code(context, &request.category_code)
            .await?;
        if existing.is_some() {
            return Err(AppstoreServiceError::AlreadyExists(format!(
                "Category code already exists: {}",
                request.category_code
            )));
        }

        let now = Utc::now();
        let category_id = CategoryId::new(Uuid::new_v4().to_string());

        let category = Category {
            id: category_id.clone(),
            tenant_id: context.tenant_id.clone(),
            category_code: request.category_code,
            parent_category_id: request.parent_category_id,
            category_level: request.category_level.unwrap_or(1),
            status: CategoryStatus::Active,
            sort_order: request.sort_order.unwrap_or(0),
            icon_media_resource_id: request.icon_media_resource_id,
            created_at: now,
            updated_at: now,
        };

        self.repository.insert_category(context, &category).await?;

        let mut localizations = Vec::new();
        for loc_input in request.localizations {
            let loc = CategoryLocalization {
                id: Uuid::new_v4().to_string(),
                tenant_id: context.tenant_id.clone(),
                category_id: category_id.clone(),
                locale: loc_input.locale,
                display_name: loc_input.display_name,
                description: loc_input.description,
                created_at: now,
                updated_at: now,
            };
            self.repository
                .upsert_category_localization(context, &loc)
                .await?;
            localizations.push(loc);
        }

        Ok(CategoryCreateResult::created(
            "appstore.catalog.categories.create",
            category,
            localizations,
        ))
    }

    async fn category_update(
        &self,
        context: &AppstoreRequestContext,
        request: CategoryUpdateRequest,
    ) -> AppstoreServiceResult<CategoryUpdateResult> {
        let category_id = CategoryId::new(&request.category_id);

        let mut category = self
            .repository
            .find_category_by_id(context, &category_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!(
                    "Category not found: {}",
                    request.category_id
                ))
            })?;

        let mut updated_fields = Vec::new();

        if let Some(parent_category_id) = request.parent_category_id {
            category.parent_category_id = Some(parent_category_id);
            updated_fields.push("parent_category_id".to_string());
        }

        if let Some(level) = request.category_level {
            category.category_level = level;
            updated_fields.push("category_level".to_string());
        }

        if let Some(order) = request.sort_order {
            category.sort_order = order;
            updated_fields.push("sort_order".to_string());
        }

        if let Some(icon) = request.icon_media_resource_id {
            category.icon_media_resource_id = Some(icon);
            updated_fields.push("icon_media_resource_id".to_string());
        }

        if let Some(status_str) = request.status {
            let status = CategoryStatus::from_str(&status_str).ok_or_else(|| {
                AppstoreServiceError::ValidationFailed(format!(
                    "Invalid category status: {}",
                    status_str
                ))
            })?;
            category.status = status;
            updated_fields.push("status".to_string());
        }

        if !updated_fields.is_empty() {
            category.updated_at = Utc::now();
            self.repository.update_category(context, &category).await?;
        }

        let mut localizations = Vec::new();
        if let Some(loc_inputs) = request.localizations {
            for loc_input in loc_inputs {
                let loc = CategoryLocalization {
                    id: Uuid::new_v4().to_string(),
                    tenant_id: context.tenant_id.clone(),
                    category_id: category_id.clone(),
                    locale: loc_input.locale,
                    display_name: loc_input.display_name,
                    description: loc_input.description,
                    created_at: Utc::now(),
                    updated_at: Utc::now(),
                };
                self.repository
                    .upsert_category_localization(context, &loc)
                    .await?;
                localizations.push(loc);
            }
        } else {
            localizations = self
                .repository
                .find_category_localizations(context, &category_id)
                .await?;
        }

        Ok(CategoryUpdateResult::updated(
            "appstore.catalog.categories.update",
            category,
            localizations,
        ))
    }

    async fn collections_list(
        &self,
        context: &AppstoreRequestContext,
        request: CollectionsListRequest,
    ) -> AppstoreServiceResult<CollectionsListResult> {
        let limit = request.limit.unwrap_or(20).min(100);
        let collections = self
            .repository
            .find_collections(context, request.cursor.as_deref(), limit + 1)
            .await?;

        let has_more = collections.len() > limit as usize;
        let collections: Vec<CatalogCollection> =
            collections.into_iter().take(limit as usize).collect();
        let next_cursor = if has_more {
            collections.last().map(|c| c.id.as_str().to_string())
        } else {
            None
        };

        let mut result_collections = Vec::new();
        for collection in collections {
            let localizations = self
                .repository
                .find_collection_localizations(context, &collection.id)
                .await?;
            let items = self
                .repository
                .find_collection_items(context, &collection.id)
                .await?;
            result_collections.push(CollectionWithItems {
                collection,
                localizations,
                items,
            });
        }

        Ok(CollectionsListResult::new(
            "appstore.catalog.collections.list",
            result_collections,
            next_cursor,
            has_more,
        ))
    }

    async fn collection_retrieve(
        &self,
        context: &AppstoreRequestContext,
        request: CollectionRetrieveRequest,
    ) -> AppstoreServiceResult<CollectionRetrieveResult> {
        let collection_id = CollectionId::new(&request.collection_id);
        let collection = self
            .repository
            .find_collection_by_id(context, &collection_id)
            .await?;

        match collection {
            Some(collection) => {
                let localizations = self
                    .repository
                    .find_collection_localizations(context, &collection_id)
                    .await?;
                let items = self
                    .repository
                    .find_collection_items(context, &collection_id)
                    .await?;
                Ok(CollectionRetrieveResult::found(
                    "appstore.catalog.collections.retrieve",
                    CollectionWithItems {
                        collection,
                        localizations,
                        items,
                    },
                ))
            }
            None => Ok(CollectionRetrieveResult::not_found(
                "appstore.catalog.collections.retrieve",
            )),
        }
    }

    async fn collection_create(
        &self,
        context: &AppstoreRequestContext,
        request: CollectionCreateRequest,
    ) -> AppstoreServiceResult<CollectionCreateResult> {
        if request.collection_code.trim().is_empty() {
            return Err(AppstoreServiceError::ValidationFailed(
                "Collection code is required".to_string(),
            ));
        }

        let existing = self
            .repository
            .find_collection_by_code(context, &request.collection_code)
            .await?;
        if existing.is_some() {
            return Err(AppstoreServiceError::AlreadyExists(format!(
                "Collection code already exists: {}",
                request.collection_code
            )));
        }

        let collection_type =
            CollectionType::from_str(&request.collection_type).ok_or_else(|| {
                AppstoreServiceError::ValidationFailed(format!(
                    "Invalid collection type: {}",
                    request.collection_type
                ))
            })?;

        let audience_scope = AudienceScope::from_str(&request.audience_scope).ok_or_else(|| {
            AppstoreServiceError::ValidationFailed(format!(
                "Invalid audience scope: {}",
                request.audience_scope
            ))
        })?;

        let now = Utc::now();
        let collection_id = CollectionId::new(Uuid::new_v4().to_string());

        let starts_at = request.starts_at.as_deref().and_then(|s| s.parse().ok());
        let ends_at = request.ends_at.as_deref().and_then(|s| s.parse().ok());

        let collection = CatalogCollection {
            id: collection_id.clone(),
            tenant_id: context.tenant_id.clone(),
            collection_code: request.collection_code,
            collection_type,
            status: CollectionStatus::Draft,
            audience_scope,
            sort_order: request.sort_order.unwrap_or(0),
            cover_media_resource_id: request.cover_media_resource_id,
            starts_at,
            ends_at,
            created_at: now,
            updated_at: now,
        };

        self.repository
            .insert_collection(context, &collection)
            .await?;

        let mut localizations = Vec::new();
        for loc_input in request.localizations {
            let loc = CatalogCollectionLocalization {
                id: Uuid::new_v4().to_string(),
                tenant_id: context.tenant_id.clone(),
                collection_id: collection_id.clone(),
                locale: loc_input.locale,
                display_name: loc_input.display_name,
                description: loc_input.description,
                created_at: now,
                updated_at: now,
            };
            self.repository
                .upsert_collection_localization(context, &loc)
                .await?;
            localizations.push(loc);
        }

        Ok(CollectionCreateResult::created(
            "appstore.catalog.collections.create",
            collection,
            localizations,
        ))
    }

    async fn collection_update(
        &self,
        context: &AppstoreRequestContext,
        request: CollectionUpdateRequest,
    ) -> AppstoreServiceResult<CollectionUpdateResult> {
        let collection_id = CollectionId::new(&request.collection_id);

        let mut collection = self
            .repository
            .find_collection_by_id(context, &collection_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!(
                    "Collection not found: {}",
                    request.collection_id
                ))
            })?;

        let mut updated_fields = Vec::new();

        if let Some(type_str) = request.collection_type {
            let collection_type = CollectionType::from_str(&type_str).ok_or_else(|| {
                AppstoreServiceError::ValidationFailed(format!(
                    "Invalid collection type: {}",
                    type_str
                ))
            })?;
            collection.collection_type = collection_type;
            updated_fields.push("collection_type".to_string());
        }

        if let Some(scope_str) = request.audience_scope {
            let audience_scope = AudienceScope::from_str(&scope_str).ok_or_else(|| {
                AppstoreServiceError::ValidationFailed(format!(
                    "Invalid audience scope: {}",
                    scope_str
                ))
            })?;
            collection.audience_scope = audience_scope;
            updated_fields.push("audience_scope".to_string());
        }

        if let Some(order) = request.sort_order {
            collection.sort_order = order;
            updated_fields.push("sort_order".to_string());
        }

        if let Some(cover) = request.cover_media_resource_id {
            collection.cover_media_resource_id = Some(cover);
            updated_fields.push("cover_media_resource_id".to_string());
        }

        if let Some(starts) = request.starts_at {
            collection.starts_at = starts.parse().ok();
            updated_fields.push("starts_at".to_string());
        }

        if let Some(ends) = request.ends_at {
            collection.ends_at = ends.parse().ok();
            updated_fields.push("ends_at".to_string());
        }

        if let Some(status_str) = request.status {
            let status = CollectionStatus::from_str(&status_str).ok_or_else(|| {
                AppstoreServiceError::ValidationFailed(format!(
                    "Invalid collection status: {}",
                    status_str
                ))
            })?;
            collection.status = status;
            updated_fields.push("status".to_string());
        }

        if !updated_fields.is_empty() {
            collection.updated_at = Utc::now();
            self.repository
                .update_collection(context, &collection)
                .await?;
        }

        let mut localizations = Vec::new();
        if let Some(loc_inputs) = request.localizations {
            for loc_input in loc_inputs {
                let loc = CatalogCollectionLocalization {
                    id: Uuid::new_v4().to_string(),
                    tenant_id: context.tenant_id.clone(),
                    collection_id: collection_id.clone(),
                    locale: loc_input.locale,
                    display_name: loc_input.display_name,
                    description: loc_input.description,
                    created_at: Utc::now(),
                    updated_at: Utc::now(),
                };
                self.repository
                    .upsert_collection_localization(context, &loc)
                    .await?;
                localizations.push(loc);
            }
        } else {
            localizations = self
                .repository
                .find_collection_localizations(context, &collection_id)
                .await?;
        }

        Ok(CollectionUpdateResult::updated(
            "appstore.catalog.collections.update",
            collection,
            localizations,
        ))
    }

    async fn collection_items_upsert(
        &self,
        context: &AppstoreRequestContext,
        request: CollectionItemsUpsertRequest,
    ) -> AppstoreServiceResult<CollectionItemsUpsertResult> {
        let collection_id = CollectionId::new(&request.collection_id);

        let _collection = self
            .repository
            .find_collection_by_id(context, &collection_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!(
                    "Collection not found: {}",
                    request.collection_id
                ))
            })?;

        self.repository
            .delete_collection_items(context, &collection_id)
            .await?;

        let now = Utc::now();
        let mut items = Vec::new();

        for (index, item_input) in request.items.into_iter().enumerate() {
            let starts_at = item_input.starts_at.as_deref().and_then(|s| s.parse().ok());
            let ends_at = item_input.ends_at.as_deref().and_then(|s| s.parse().ok());

            let item = CatalogCollectionItem {
                id: Uuid::new_v4().to_string(),
                tenant_id: context.tenant_id.clone(),
                collection_id: collection_id.clone(),
                listing_id: item_input.listing_id,
                sort_order: item_input.sort_order.unwrap_or(index as i32),
                highlight: item_input
                    .highlight
                    .unwrap_or(serde_json::Value::Object(serde_json::Map::new())),
                starts_at,
                ends_at,
                created_at: now,
            };

            self.repository
                .insert_collection_item(context, &item)
                .await?;
            items.push(item);
        }

        Ok(CollectionItemsUpsertResult::upserted(
            "appstore.catalog.collections.items.upsert",
            items,
        ))
    }

    async fn featured_list(
        &self,
        context: &AppstoreRequestContext,
        _request: FeaturedListRequest,
    ) -> AppstoreServiceResult<FeaturedListResult> {
        let slots = self.repository.find_featured_slots(context).await?;

        Ok(FeaturedListResult::new(
            "appstore.catalog.featured.list",
            slots,
        ))
    }

    async fn featured_upsert(
        &self,
        context: &AppstoreRequestContext,
        request: FeaturedUpsertRequest,
    ) -> AppstoreServiceResult<FeaturedUpsertResult> {
        if request.slot_code.trim().is_empty() {
            return Err(AppstoreServiceError::ValidationFailed(
                "Slot code is required".to_string(),
            ));
        }

        if request.listing_id.trim().is_empty() {
            return Err(AppstoreServiceError::ValidationFailed(
                "Listing ID is required".to_string(),
            ));
        }

        let audience_scope = AudienceScope::from_str(&request.audience_scope).ok_or_else(|| {
            AppstoreServiceError::ValidationFailed(format!(
                "Invalid audience scope: {}",
                request.audience_scope
            ))
        })?;

        let platform_scope = request
            .platform_scope
            .as_deref()
            .and_then(PlatformScope::from_str)
            .unwrap_or(PlatformScope::All);

        let starts_at = request.starts_at.parse().map_err(|_| {
            AppstoreServiceError::ValidationFailed("Invalid starts_at format".to_string())
        })?;
        let ends_at = request.ends_at.parse().map_err(|_| {
            AppstoreServiceError::ValidationFailed("Invalid ends_at format".to_string())
        })?;

        let now = Utc::now();
        let existing = self
            .repository
            .find_featured_slot_by_code(context, &request.slot_code)
            .await?;

        let slot_id = existing
            .as_ref()
            .map(|s| s.id.clone())
            .unwrap_or_else(|| FeaturedSlotId::new(Uuid::new_v4().to_string()));
        let existing_created_at = existing.as_ref().map(|s| s.created_at);

        let slot = CatalogFeaturedSlot {
            id: slot_id,
            tenant_id: context.tenant_id.clone(),
            slot_code: request.slot_code,
            listing_id: request.listing_id,
            status: FeaturedSlotStatus::Active,
            audience_scope,
            platform_scope,
            region_scope: request.region_scope.unwrap_or_default(),
            starts_at,
            ends_at,
            created_at: existing_created_at.unwrap_or(now),
            updated_at: now,
        };

        self.repository.upsert_featured_slot(context, &slot).await?;

        Ok(FeaturedUpsertResult::upserted(
            "appstore.catalog.featured.upsert",
            slot,
        ))
    }

    async fn charts_retrieve(
        &self,
        context: &AppstoreRequestContext,
        request: ChartsRetrieveRequest,
    ) -> AppstoreServiceResult<ChartsRetrieveResult> {
        let locale = request.locale.as_deref().unwrap_or("en-US");
        let platform_scope = request.platform_scope.as_deref().unwrap_or("ALL");

        let chart = if let Some(date) = request.snapshot_date.as_deref() {
            self.repository
                .find_chart_snapshot(context, &request.chart_code, date, locale, platform_scope)
                .await?
        } else {
            self.repository
                .find_latest_chart_snapshot(context, &request.chart_code, locale, platform_scope)
                .await?
        };

        match chart {
            Some(chart) => Ok(ChartsRetrieveResult::found(
                "appstore.catalog.charts.retrieve",
                chart,
            )),
            None => Ok(ChartsRetrieveResult::not_found(
                "appstore.catalog.charts.retrieve",
            )),
        }
    }

    async fn listings_search(
        &self,
        context: &AppstoreRequestContext,
        request: ListingsSearchRequest,
    ) -> AppstoreServiceResult<ListingsSearchResult> {
        let limit = request.limit.unwrap_or(20).min(100);
        let listings = self
            .repository
            .search_listings(
                context,
                request.query.as_deref(),
                request.category_id.as_deref(),
                request.cursor.as_deref(),
                limit + 1,
            )
            .await?;

        let has_more = listings.len() > limit as usize;
        let listings: Vec<ListingSummary> = listings.into_iter().take(limit as usize).collect();
        let next_cursor = if has_more {
            listings.last().map(|l| l.id.clone())
        } else {
            None
        };

        Ok(ListingsSearchResult::new(
            "appstore.catalog.listings.search",
            listings,
            next_cursor,
            has_more,
        ))
    }

    async fn metrics_retrieve(
        &self,
        context: &AppstoreRequestContext,
        request: MetricsRetrieveRequest,
    ) -> AppstoreServiceResult<MetricsRetrieveResult> {
        if request.listing_id.trim().is_empty() {
            return Err(AppstoreServiceError::ValidationFailed(
                "Listing ID is required".to_string(),
            ));
        }

        let metrics = self
            .repository
            .find_metric_snapshots(
                context,
                &request.listing_id,
                request.start_date.as_deref(),
                request.end_date.as_deref(),
            )
            .await?;

        Ok(MetricsRetrieveResult::new(
            "appstore.metrics.listings.retrieve",
            metrics,
        ))
    }

    async fn public_featured_list(
        &self,
        context: &AppstoreRequestContext,
        request: PublicFeaturedListRequest,
    ) -> AppstoreServiceResult<PublicFeaturedListResult> {
        let all_slots = self.repository.find_featured_slots(context).await?;

        let now = Utc::now();
        let filtered: Vec<CatalogFeaturedSlot> = all_slots
            .into_iter()
            .filter(|slot| {
                slot.status == FeaturedSlotStatus::Active
                    && slot.audience_scope == AudienceScope::Public
                    && slot.starts_at <= now
                    && slot.ends_at >= now
            })
            .collect();

        let limit = request.limit.unwrap_or(20).min(100) as usize;
        let slots: Vec<CatalogFeaturedSlot> = filtered.into_iter().take(limit).collect();

        Ok(PublicFeaturedListResult::new(
            "appstore.catalog.public.featured.list",
            slots,
        ))
    }
}
