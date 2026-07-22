use sdkwork_appstore_catalog_service::domain::models::CatalogFeaturedSlot;

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct PublicFeaturedSlotResponse {
    id: String,
    slot_code: String,
    listing_id: String,
    status: String,
    platform_scope: String,
    region_scope: Vec<String>,
    starts_at: String,
    ends_at: String,
}

pub(crate) fn map_public_featured_slot(slot: CatalogFeaturedSlot) -> PublicFeaturedSlotResponse {
    PublicFeaturedSlotResponse {
        id: slot.id.0,
        slot_code: slot.slot_code,
        listing_id: slot.listing_id,
        status: slot.status.as_str().to_string(),
        platform_scope: slot.platform_scope.as_str().to_string(),
        region_scope: slot.region_scope,
        starts_at: slot.starts_at.to_rfc3339(),
        ends_at: slot.ends_at.to_rfc3339(),
    }
}
