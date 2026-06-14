//! Catalog domain models.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct CategoryId(pub String);

impl CategoryId {
    pub fn new(id: impl Into<String>) -> Self {
        Self(id.into())
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct CollectionId(pub String);

impl CollectionId {
    pub fn new(id: impl Into<String>) -> Self {
        Self(id.into())
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct FeaturedSlotId(pub String);

impl FeaturedSlotId {
    pub fn new(id: impl Into<String>) -> Self {
        Self(id.into())
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum CategoryStatus {
    Active,
    Inactive,
    Deleted,
}

impl CategoryStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Active => "active",
            Self::Inactive => "inactive",
            Self::Deleted => "deleted",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "active" => Some(Self::Active),
            "inactive" => Some(Self::Inactive),
            "deleted" => Some(Self::Deleted),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum CollectionType {
    Editorial,
    Algorithmic,
    Thematic,
}

impl CollectionType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Editorial => "editorial",
            Self::Algorithmic => "algorithmic",
            Self::Thematic => "thematic",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "editorial" => Some(Self::Editorial),
            "algorithmic" => Some(Self::Algorithmic),
            "thematic" => Some(Self::Thematic),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum CollectionStatus {
    Draft,
    Published,
    Archived,
}

impl CollectionStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Draft => "draft",
            Self::Published => "published",
            Self::Archived => "archived",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "draft" => Some(Self::Draft),
            "published" => Some(Self::Published),
            "archived" => Some(Self::Archived),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum FeaturedSlotStatus {
    Active,
    Paused,
    Expired,
}

impl FeaturedSlotStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Active => "active",
            Self::Paused => "paused",
            Self::Expired => "expired",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "active" => Some(Self::Active),
            "paused" => Some(Self::Paused),
            "expired" => Some(Self::Expired),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum AudienceScope {
    Public,
    Internal,
    Beta,
}

impl AudienceScope {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Public => "public",
            Self::Internal => "internal",
            Self::Beta => "beta",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "public" => Some(Self::Public),
            "internal" => Some(Self::Internal),
            "beta" => Some(Self::Beta),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum PlatformScope {
    All,
    Android,
    Ios,
    Web,
    Desktop,
}

impl PlatformScope {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::All => "ALL",
            Self::Android => "ANDROID",
            Self::Ios => "IOS",
            Self::Web => "WEB",
            Self::Desktop => "DESKTOP",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "ALL" => Some(Self::All),
            "ANDROID" => Some(Self::Android),
            "IOS" => Some(Self::Ios),
            "WEB" => Some(Self::Web),
            "DESKTOP" => Some(Self::Desktop),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Category {
    pub id: CategoryId,
    pub tenant_id: String,
    pub category_code: String,
    pub parent_category_id: Option<String>,
    pub category_level: i32,
    pub status: CategoryStatus,
    pub sort_order: i32,
    pub icon_media_resource_id: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CategoryLocalization {
    pub id: String,
    pub tenant_id: String,
    pub category_id: CategoryId,
    pub locale: String,
    pub display_name: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CategoryWithLocalizations {
    pub category: Category,
    pub localizations: Vec<CategoryLocalization>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CatalogCollection {
    pub id: CollectionId,
    pub tenant_id: String,
    pub collection_code: String,
    pub collection_type: CollectionType,
    pub status: CollectionStatus,
    pub audience_scope: AudienceScope,
    pub sort_order: i32,
    pub cover_media_resource_id: Option<String>,
    pub starts_at: Option<DateTime<Utc>>,
    pub ends_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CatalogCollectionLocalization {
    pub id: String,
    pub tenant_id: String,
    pub collection_id: CollectionId,
    pub locale: String,
    pub display_name: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CatalogCollectionItem {
    pub id: String,
    pub tenant_id: String,
    pub collection_id: CollectionId,
    pub listing_id: String,
    pub sort_order: i32,
    pub highlight: serde_json::Value,
    pub starts_at: Option<DateTime<Utc>>,
    pub ends_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CollectionWithLocalizations {
    pub collection: CatalogCollection,
    pub localizations: Vec<CatalogCollectionLocalization>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CollectionWithItems {
    pub collection: CatalogCollection,
    pub localizations: Vec<CatalogCollectionLocalization>,
    pub items: Vec<CatalogCollectionItem>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CatalogFeaturedSlot {
    pub id: FeaturedSlotId,
    pub tenant_id: String,
    pub slot_code: String,
    pub listing_id: String,
    pub status: FeaturedSlotStatus,
    pub audience_scope: AudienceScope,
    pub platform_scope: PlatformScope,
    pub region_scope: Vec<String>,
    pub starts_at: DateTime<Utc>,
    pub ends_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CatalogChartSnapshot {
    pub id: String,
    pub tenant_id: String,
    pub chart_code: String,
    pub snapshot_date: String,
    pub locale: String,
    pub platform_scope: PlatformScope,
    pub ranking: serde_json::Value,
    pub generated_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ListingMetricSnapshot {
    pub id: String,
    pub tenant_id: String,
    pub listing_id: String,
    pub snapshot_date: String,
    pub impression_count: i32,
    pub detail_view_count: i32,
    pub install_count: i32,
    pub uninstall_count: i32,
    pub update_count: i32,
    pub conversion_rate: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ListingSummary {
    pub id: String,
    pub plus_app_id: Option<String>,
    pub plus_app_key: String,
    pub display_name: String,
    pub subtitle: Option<String>,
    pub listing_slug: String,
    pub pricing_model: String,
    pub icon_media_resource_id: Option<String>,
    pub average_rating: Option<String>,
    pub rating_count: i32,
}
