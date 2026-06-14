//! Listing service entrypoint.

use chrono::Utc;
use uuid::Uuid;

use crate::context::AppstoreRequestContext;
use crate::domain::commands::{
    AdminListListingsRequest, AdminRetrieveListingRequest, AdminUpdateListingVisibilityRequest,
    AttachListingMediaRequest, BindListingCategoriesRequest, CreateListingRequest,
    CreateListingSubmissionRequest, ListListingMediaRequest, ListListingReleasesRequest,
    PublicRetrieveListingRequest, RemoveListingMediaRequest, RetrieveListingRequest,
    UpdateListingRequest, UpdateRegionalAvailabilityRequest, UpsertListingLocalizationRequest,
};
use crate::domain::models::{
    Listing, ListingCategoryBinding, ListingId, ListingLocalization, ListingMedia, ListingStatus,
    ListingSubmission, ListingType, MediaRole, PricingModel, RegionalAvailability, ReviewStatus,
    StorefrontVisibility, SubmissionStatus, SubmissionType,
};
use crate::domain::results::{
    AdminListListingsResult, AdminRetrieveListingResult, AdminUpdateListingVisibilityResult,
    AttachListingMediaResult, BindListingCategoriesResult, CreateListingResult,
    CreateListingSubmissionResult, ListListingMediaResult, ListListingReleasesResult,
    PublicRetrieveListingResult, RemoveListingMediaResult, RetrieveListingResult,
    UpdateListingResult, UpdateRegionalAvailabilityResult, UpsertListingLocalizationResult,
};
use crate::error::{AppstoreServiceError, AppstoreServiceResult};
use crate::ports::repository::ListingRepositoryPort;

#[async_trait::async_trait]
pub trait ListingOperations {
    async fn retrieve_listing(
        &self,
        context: &AppstoreRequestContext,
        request: RetrieveListingRequest,
    ) -> AppstoreServiceResult<RetrieveListingResult>;

    async fn create_listing(
        &self,
        context: &AppstoreRequestContext,
        request: CreateListingRequest,
    ) -> AppstoreServiceResult<CreateListingResult>;

    async fn update_listing(
        &self,
        context: &AppstoreRequestContext,
        request: UpdateListingRequest,
    ) -> AppstoreServiceResult<UpdateListingResult>;

    async fn upsert_localization(
        &self,
        context: &AppstoreRequestContext,
        request: UpsertListingLocalizationRequest,
    ) -> AppstoreServiceResult<UpsertListingLocalizationResult>;

    async fn list_media(
        &self,
        context: &AppstoreRequestContext,
        request: ListListingMediaRequest,
    ) -> AppstoreServiceResult<ListListingMediaResult>;

    async fn attach_media(
        &self,
        context: &AppstoreRequestContext,
        request: AttachListingMediaRequest,
    ) -> AppstoreServiceResult<AttachListingMediaResult>;

    async fn remove_media(
        &self,
        context: &AppstoreRequestContext,
        request: RemoveListingMediaRequest,
    ) -> AppstoreServiceResult<RemoveListingMediaResult>;

    async fn bind_categories(
        &self,
        context: &AppstoreRequestContext,
        request: BindListingCategoriesRequest,
    ) -> AppstoreServiceResult<BindListingCategoriesResult>;

    async fn update_regional_availability(
        &self,
        context: &AppstoreRequestContext,
        request: UpdateRegionalAvailabilityRequest,
    ) -> AppstoreServiceResult<UpdateRegionalAvailabilityResult>;

    async fn list_releases(
        &self,
        context: &AppstoreRequestContext,
        request: ListListingReleasesRequest,
    ) -> AppstoreServiceResult<ListListingReleasesResult>;

    async fn create_submission(
        &self,
        context: &AppstoreRequestContext,
        request: CreateListingSubmissionRequest,
    ) -> AppstoreServiceResult<CreateListingSubmissionResult>;

    async fn admin_list_listings(
        &self,
        context: &AppstoreRequestContext,
        request: AdminListListingsRequest,
    ) -> AppstoreServiceResult<AdminListListingsResult>;

    async fn admin_retrieve_listing(
        &self,
        context: &AppstoreRequestContext,
        request: AdminRetrieveListingRequest,
    ) -> AppstoreServiceResult<AdminRetrieveListingResult>;

    async fn admin_update_visibility(
        &self,
        context: &AppstoreRequestContext,
        request: AdminUpdateListingVisibilityRequest,
    ) -> AppstoreServiceResult<AdminUpdateListingVisibilityResult>;

    async fn public_retrieve_listing(
        &self,
        context: &AppstoreRequestContext,
        request: PublicRetrieveListingRequest,
    ) -> AppstoreServiceResult<PublicRetrieveListingResult>;
}

#[derive(Debug, Clone)]
pub struct ListingService<R> {
    repository: R,
}

impl<R> ListingService<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }
}

#[async_trait::async_trait]
impl<R> ListingOperations for ListingService<R>
where
    R: ListingRepositoryPort,
{
    async fn retrieve_listing(
        &self,
        context: &AppstoreRequestContext,
        request: RetrieveListingRequest,
    ) -> AppstoreServiceResult<RetrieveListingResult> {
        let listing_id = ListingId::new(&request.listing_id);

        let listing = self
            .repository
            .find_listing_by_id(context, &listing_id)
            .await?;

        match listing {
            Some(listing) => Ok(RetrieveListingResult::found(
                "appstore.listings.retrieve",
                listing,
            )),
            None => Ok(RetrieveListingResult::not_found(
                "appstore.listings.retrieve",
            )),
        }
    }

    async fn create_listing(
        &self,
        context: &AppstoreRequestContext,
        request: CreateListingRequest,
    ) -> AppstoreServiceResult<CreateListingResult> {
        if request.plus_app_id.trim().is_empty() {
            return Err(AppstoreServiceError::ValidationFailed(
                "plus_app_id is required".to_string(),
            ));
        }
        if request.plus_app_key.trim().is_empty() {
            return Err(AppstoreServiceError::ValidationFailed(
                "plus_app_key is required".to_string(),
            ));
        }
        if request.default_locale.trim().is_empty() {
            return Err(AppstoreServiceError::ValidationFailed(
                "default_locale is required".to_string(),
            ));
        }

        let existing = self
            .repository
            .find_listing_by_plus_app_id(context, &request.plus_app_id)
            .await?;
        if existing.is_some() {
            return Err(AppstoreServiceError::AlreadyExists(
                "Listing already exists for this plus_app_id".to_string(),
            ));
        }

        let now = Utc::now();
        let listing_id = ListingId::new(Uuid::new_v4().to_string());
        let listing_no = format!(
            "LST-{}",
            Uuid::new_v4()
                .to_string()
                .split('-')
                .next()
                .unwrap_or_default()
        );

        let listing_slug = request
            .listing_slug
            .unwrap_or_else(|| format!("listing-{}", &listing_id.as_str()[..8]));

        let pricing_model = request
            .pricing_model
            .and_then(|p| PricingModel::from_str(&p))
            .unwrap_or(PricingModel::Free);

        let listing = Listing {
            id: listing_id,
            tenant_id: context.tenant_id.clone(),
            organization_id: context.organization_id.clone(),
            app_id: None,
            publisher_id: request.publisher_id,
            listing_no,
            plus_app_id: request.plus_app_id,
            plus_app_key: request.plus_app_key,
            listing_slug,
            listing_type: ListingType::App,
            pricing_model,
            listing_status: ListingStatus::Draft,
            storefront_visibility: StorefrontVisibility::Hidden,
            review_status: ReviewStatus::NotSubmitted,
            primary_category_id: None,
            default_locale: request.default_locale,
            age_rating_code: None,
            content_rating_json: serde_json::Value::Object(serde_json::Map::new()),
            official_website_url: None,
            support_url: None,
            privacy_policy_url: None,
            comments_thread_id: None,
            commerce_product_id: None,
            current_release_id: None,
            featured_score: 0,
            download_count: 0,
            average_rating: None,
            rating_count: 0,
            version: 1,
            submitted_at: None,
            published_at: None,
            delisted_at: None,
            deleted_at: None,
            created_at: now,
            updated_at: now,
        };

        self.repository.insert_listing(context, &listing).await?;

        Ok(CreateListingResult::created(
            "appstore.listings.create",
            listing,
        ))
    }

    async fn update_listing(
        &self,
        context: &AppstoreRequestContext,
        request: UpdateListingRequest,
    ) -> AppstoreServiceResult<UpdateListingResult> {
        let listing_id = ListingId::new(&request.listing_id);

        let mut listing = self
            .repository
            .find_listing_by_id(context, &listing_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!("Listing not found: {}", request.listing_id))
            })?;

        if !listing.can_update() {
            return Err(AppstoreServiceError::InvalidState(
                "Listing cannot be updated in current state".to_string(),
            ));
        }

        let mut updated_fields = Vec::new();

        if let Some(pricing_model) = request.pricing_model {
            let model = PricingModel::from_str(&pricing_model).ok_or_else(|| {
                AppstoreServiceError::ValidationFailed(format!(
                    "Invalid pricing model: {}",
                    pricing_model
                ))
            })?;
            listing.pricing_model = model;
            updated_fields.push("pricing_model".to_string());
        }

        if let Some(url) = request.official_website_url {
            listing.official_website_url = Some(url);
            updated_fields.push("official_website_url".to_string());
        }

        if let Some(url) = request.support_url {
            listing.support_url = Some(url);
            updated_fields.push("support_url".to_string());
        }

        if let Some(url) = request.privacy_policy_url {
            listing.privacy_policy_url = Some(url);
            updated_fields.push("privacy_policy_url".to_string());
        }

        if updated_fields.is_empty() {
            return Ok(UpdateListingResult::updated(
                "appstore.listings.update",
                listing,
            ));
        }

        listing.version += 1;
        listing.updated_at = Utc::now();

        self.repository.update_listing(context, &listing).await?;

        Ok(UpdateListingResult::updated(
            "appstore.listings.update",
            listing,
        ))
    }

    async fn upsert_localization(
        &self,
        context: &AppstoreRequestContext,
        request: UpsertListingLocalizationRequest,
    ) -> AppstoreServiceResult<UpsertListingLocalizationResult> {
        let listing_id = ListingId::new(&request.listing_id);

        let listing = self
            .repository
            .find_listing_by_id(context, &listing_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!("Listing not found: {}", request.listing_id))
            })?;

        if !listing.can_update() {
            return Err(AppstoreServiceError::InvalidState(
                "Listing cannot be updated in current state".to_string(),
            ));
        }

        if request.display_name.trim().is_empty() {
            return Err(AppstoreServiceError::ValidationFailed(
                "display_name is required".to_string(),
            ));
        }
        if request.short_description.trim().is_empty() {
            return Err(AppstoreServiceError::ValidationFailed(
                "short_description is required".to_string(),
            ));
        }
        if request.full_description.trim().is_empty() {
            return Err(AppstoreServiceError::ValidationFailed(
                "full_description is required".to_string(),
            ));
        }

        let now = Utc::now();
        let existing = self
            .repository
            .find_localization(context, &listing_id, &request.locale)
            .await?;

        let keywords_json = match request.keywords {
            Some(keywords) => serde_json::to_value(keywords).unwrap_or_default(),
            None => serde_json::Value::Array(vec![]),
        };

        let localization = ListingLocalization {
            id: existing
                .as_ref()
                .map(|l| l.id.clone())
                .unwrap_or_else(|| Uuid::new_v4().to_string()),
            tenant_id: context.tenant_id.clone(),
            organization_id: context.organization_id.clone(),
            listing_id: listing_id.clone(),
            locale: request.locale,
            display_name: request.display_name,
            subtitle: request.subtitle,
            short_description: request.short_description,
            full_description: request.full_description,
            whats_new_summary: request.whats_new_summary,
            keywords_json,
            created_at: existing.as_ref().map(|l| l.created_at).unwrap_or(now),
            updated_at: now,
        };

        self.repository
            .upsert_localization(context, &localization)
            .await?;

        Ok(UpsertListingLocalizationResult::upserted(
            "appstore.listings.localization.upsert",
            localization,
        ))
    }

    async fn list_media(
        &self,
        context: &AppstoreRequestContext,
        request: ListListingMediaRequest,
    ) -> AppstoreServiceResult<ListListingMediaResult> {
        let listing_id = ListingId::new(&request.listing_id);

        let _listing = self
            .repository
            .find_listing_by_id(context, &listing_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!("Listing not found: {}", request.listing_id))
            })?;

        let media = self
            .repository
            .find_media_by_listing(context, &listing_id)
            .await?;

        Ok(ListListingMediaResult::new(
            "appstore.listings.media.list",
            media,
        ))
    }

    async fn attach_media(
        &self,
        context: &AppstoreRequestContext,
        request: AttachListingMediaRequest,
    ) -> AppstoreServiceResult<AttachListingMediaResult> {
        let listing_id = ListingId::new(&request.listing_id);

        let listing = self
            .repository
            .find_listing_by_id(context, &listing_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!("Listing not found: {}", request.listing_id))
            })?;

        if !listing.can_update() {
            return Err(AppstoreServiceError::InvalidState(
                "Listing cannot be updated in current state".to_string(),
            ));
        }

        let media_role = MediaRole::from_str(&request.media_role).ok_or_else(|| {
            AppstoreServiceError::ValidationFailed(format!(
                "Invalid media role: {}",
                request.media_role
            ))
        })?;

        if request.media_resource_id.trim().is_empty() {
            return Err(AppstoreServiceError::ValidationFailed(
                "media_resource_id is required".to_string(),
            ));
        }

        let now = Utc::now();
        let media = ListingMedia {
            id: Uuid::new_v4().to_string(),
            tenant_id: context.tenant_id.clone(),
            organization_id: context.organization_id.clone(),
            listing_id,
            media_role,
            media_resource_id: request.media_resource_id,
            drive_node_id: None,
            platform_scope: request.platform_scope.unwrap_or_else(|| "ALL".to_string()),
            sort_order: 0,
            locale: request.locale,
            created_at: now,
            updated_at: now,
        };

        self.repository.insert_media(context, &media).await?;

        Ok(AttachListingMediaResult::attached(
            "appstore.listings.media.attach",
            media,
        ))
    }

    async fn remove_media(
        &self,
        context: &AppstoreRequestContext,
        request: RemoveListingMediaRequest,
    ) -> AppstoreServiceResult<RemoveListingMediaResult> {
        let listing_id = ListingId::new(&request.listing_id);

        let listing = self
            .repository
            .find_listing_by_id(context, &listing_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!("Listing not found: {}", request.listing_id))
            })?;

        if !listing.can_update() {
            return Err(AppstoreServiceError::InvalidState(
                "Listing cannot be updated in current state".to_string(),
            ));
        }

        let media = self
            .repository
            .find_media_by_id(context, &request.media_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!("Media not found: {}", request.media_id))
            })?;

        if media.listing_id != listing_id {
            return Err(AppstoreServiceError::PermissionDenied(
                "Media does not belong to this listing".to_string(),
            ));
        }

        self.repository
            .delete_media(context, &request.media_id)
            .await?;

        Ok(RemoveListingMediaResult::removed(
            "appstore.listings.media.remove",
        ))
    }

    async fn bind_categories(
        &self,
        context: &AppstoreRequestContext,
        request: BindListingCategoriesRequest,
    ) -> AppstoreServiceResult<BindListingCategoriesResult> {
        let listing_id = ListingId::new(&request.listing_id);

        let mut listing = self
            .repository
            .find_listing_by_id(context, &listing_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!("Listing not found: {}", request.listing_id))
            })?;

        if !listing.can_update() {
            return Err(AppstoreServiceError::InvalidState(
                "Listing cannot be updated in current state".to_string(),
            ));
        }

        if request.category_ids.is_empty() {
            return Err(AppstoreServiceError::ValidationFailed(
                "At least one category is required".to_string(),
            ));
        }

        let primary_id = request
            .primary_category_id
            .or_else(|| request.category_ids.first().cloned());

        let bindings: Vec<ListingCategoryBinding> = request
            .category_ids
            .iter()
            .map(|cat_id| ListingCategoryBinding {
                id: Uuid::new_v4().to_string(),
                tenant_id: context.tenant_id.clone(),
                listing_id: listing_id.clone(),
                category_id: cat_id.clone(),
                is_primary: Some(cat_id.as_str()) == primary_id.as_deref(),
                created_at: Utc::now(),
            })
            .collect();

        self.repository
            .replace_category_bindings(context, &listing_id, &bindings)
            .await?;

        listing.primary_category_id = primary_id;
        listing.version += 1;
        listing.updated_at = Utc::now();
        self.repository.update_listing(context, &listing).await?;

        Ok(BindListingCategoriesResult::bound(
            "appstore.listings.categories.bind",
            listing,
            bindings,
        ))
    }

    async fn update_regional_availability(
        &self,
        context: &AppstoreRequestContext,
        request: UpdateRegionalAvailabilityRequest,
    ) -> AppstoreServiceResult<UpdateRegionalAvailabilityResult> {
        let listing_id = ListingId::new(&request.listing_id);

        let _listing = self
            .repository
            .find_listing_by_id(context, &listing_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!("Listing not found: {}", request.listing_id))
            })?;

        if request.regions.is_empty() {
            return Err(AppstoreServiceError::ValidationFailed(
                "At least one region is required".to_string(),
            ));
        }

        let now = Utc::now();
        let availabilities: Vec<RegionalAvailability> = request
            .regions
            .iter()
            .map(|region| RegionalAvailability {
                id: Uuid::new_v4().to_string(),
                tenant_id: context.tenant_id.clone(),
                organization_id: context.organization_id.clone(),
                listing_id: listing_id.clone(),
                region_code: region.region_code.clone(),
                availability_status: region.availability_status.clone(),
                effective_at: now,
                expires_at: None,
                created_at: now,
                updated_at: now,
            })
            .collect();

        self.repository
            .replace_regional_availability(context, &listing_id, &availabilities)
            .await?;

        Ok(UpdateRegionalAvailabilityResult::updated(
            "appstore.listings.regions.update",
            availabilities,
        ))
    }

    async fn list_releases(
        &self,
        context: &AppstoreRequestContext,
        request: ListListingReleasesRequest,
    ) -> AppstoreServiceResult<ListListingReleasesResult> {
        let listing_id = ListingId::new(&request.listing_id);

        let _listing = self
            .repository
            .find_listing_by_id(context, &listing_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!("Listing not found: {}", request.listing_id))
            })?;

        let limit = request.limit.unwrap_or(20).min(100);
        let releases = self
            .repository
            .find_releases_by_listing(context, &listing_id, request.cursor.as_deref(), limit + 1)
            .await?;

        let has_more = releases.len() > limit as usize;
        let releases: Vec<serde_json::Value> = releases.into_iter().take(limit as usize).collect();
        let next_cursor = if has_more {
            releases
                .last()
                .and_then(|r| r.get("id").and_then(|v| v.as_str()).map(|s| s.to_string()))
        } else {
            None
        };

        Ok(ListListingReleasesResult::new(
            "appstore.listings.releases.list",
            releases,
            next_cursor,
            has_more,
        ))
    }

    async fn create_submission(
        &self,
        context: &AppstoreRequestContext,
        request: CreateListingSubmissionRequest,
    ) -> AppstoreServiceResult<CreateListingSubmissionResult> {
        let listing_id = ListingId::new(&request.listing_id);

        let listing = self
            .repository
            .find_listing_by_id(context, &listing_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!("Listing not found: {}", request.listing_id))
            })?;

        if !listing.can_submit() {
            return Err(AppstoreServiceError::InvalidState(
                "Listing cannot be submitted in current state".to_string(),
            ));
        }

        let submission_type =
            SubmissionType::from_str(&request.submission_type).ok_or_else(|| {
                AppstoreServiceError::ValidationFailed(format!(
                    "Invalid submission type: {}",
                    request.submission_type
                ))
            })?;

        let existing_submissions = self
            .repository
            .find_submissions_by_listing(context, &listing_id)
            .await?;

        let has_pending = existing_submissions.iter().any(|s| {
            matches!(
                s.submission_status,
                SubmissionStatus::Submitted | SubmissionStatus::UnderReview
            )
        });
        if has_pending {
            return Err(AppstoreServiceError::Conflict(
                "A submission is already pending for this listing".to_string(),
            ));
        }

        let now = Utc::now();
        let submission_id = Uuid::new_v4().to_string();
        let submission_no = format!(
            "SUB-{}",
            Uuid::new_v4()
                .to_string()
                .split('-')
                .next()
                .unwrap_or_default()
        );

        let idempotency_key = request
            .idempotency_key
            .unwrap_or_else(|| Uuid::new_v4().to_string());

        let submission = ListingSubmission {
            id: submission_id,
            tenant_id: context.tenant_id.clone(),
            organization_id: context.organization_id.clone(),
            listing_id: listing_id.clone(),
            release_id: request.release_id,
            submission_no,
            submission_type,
            submission_status: SubmissionStatus::Submitted,
            submitted_by: context.user_id.clone(),
            submitted_at: now,
            payload_snapshot_json: serde_json::Value::Object(serde_json::Map::new()),
            idempotency_key,
            created_at: now,
            updated_at: now,
        };

        self.repository
            .insert_submission(context, &submission)
            .await?;

        Ok(CreateListingSubmissionResult::created(
            "appstore.listings.submissions.create",
            submission,
        ))
    }

    async fn admin_list_listings(
        &self,
        context: &AppstoreRequestContext,
        request: AdminListListingsRequest,
    ) -> AppstoreServiceResult<AdminListListingsResult> {
        let limit = request.limit.unwrap_or(20).min(100);
        let listings = self
            .repository
            .admin_list_listings(
                context,
                request.status_filter.as_deref(),
                request.review_status_filter.as_deref(),
                request.publisher_id.as_deref(),
                request.cursor.as_deref(),
                limit + 1,
            )
            .await?;

        let has_more = listings.len() > limit as usize;
        let listings: Vec<Listing> = listings.into_iter().take(limit as usize).collect();
        let next_cursor = if has_more {
            listings.last().map(|l| l.id.0.clone())
        } else {
            None
        };

        Ok(AdminListListingsResult::new(
            "appstore.listings.admin.list",
            listings,
            next_cursor,
            has_more,
        ))
    }

    async fn admin_retrieve_listing(
        &self,
        context: &AppstoreRequestContext,
        request: AdminRetrieveListingRequest,
    ) -> AppstoreServiceResult<AdminRetrieveListingResult> {
        let listing_id = ListingId::new(&request.listing_id);

        let listing = self
            .repository
            .find_listing_by_id(context, &listing_id)
            .await?;

        match listing {
            Some(listing) => Ok(AdminRetrieveListingResult::found(
                "appstore.listings.admin.retrieve",
                listing,
            )),
            None => Ok(AdminRetrieveListingResult::not_found(
                "appstore.listings.admin.retrieve",
            )),
        }
    }

    async fn admin_update_visibility(
        &self,
        context: &AppstoreRequestContext,
        request: AdminUpdateListingVisibilityRequest,
    ) -> AppstoreServiceResult<AdminUpdateListingVisibilityResult> {
        let listing_id = ListingId::new(&request.listing_id);

        let mut listing = self
            .repository
            .find_listing_by_id(context, &listing_id)
            .await?
            .ok_or_else(|| {
                AppstoreServiceError::NotFound(format!("Listing not found: {}", request.listing_id))
            })?;

        if listing.deleted_at.is_some() {
            return Err(AppstoreServiceError::InvalidState(
                "Cannot update visibility of a deleted listing".to_string(),
            ));
        }

        let new_visibility = StorefrontVisibility::from_str(&request.storefront_visibility)
            .ok_or_else(|| {
                AppstoreServiceError::ValidationFailed(format!(
                    "Invalid storefront visibility: {}",
                    request.storefront_visibility
                ))
            })?;

        listing.storefront_visibility = new_visibility;
        listing.version += 1;
        listing.updated_at = Utc::now();

        self.repository.update_listing(context, &listing).await?;

        Ok(AdminUpdateListingVisibilityResult::updated(
            "appstore.listings.admin.visibility.update",
            listing,
        ))
    }

    async fn public_retrieve_listing(
        &self,
        context: &AppstoreRequestContext,
        request: PublicRetrieveListingRequest,
    ) -> AppstoreServiceResult<PublicRetrieveListingResult> {
        let listing = self
            .repository
            .find_listing_by_slug(context, &context.tenant_id, &request.listing_slug)
            .await?;

        match listing {
            Some(listing) if listing.is_visible() => Ok(PublicRetrieveListingResult::found(
                "appstore.listings.public.retrieve",
                listing,
            )),
            _ => Ok(PublicRetrieveListingResult::not_found(
                "appstore.listings.public.retrieve",
            )),
        }
    }
}
