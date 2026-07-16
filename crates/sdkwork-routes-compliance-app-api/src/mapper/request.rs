use sdkwork_appstore_compliance_service::domain::commands::{
    ListIapItemsRequest, PermissionDisclosureItem, RetrieveComplianceProfileRequest,
    UpdateComplianceProfileRequest, UpsertPermissionDisclosuresRequest,
};

pub fn map_retrieve_compliance_profile(listing_id: String) -> RetrieveComplianceProfileRequest {
    RetrieveComplianceProfileRequest::new(listing_id)
}

pub fn map_update_compliance_profile(
    listing_id: String,
    privacy_nutrition: Option<serde_json::Value>,
    content_rating_questionnaire: Option<serde_json::Value>,
    data_safety: Option<serde_json::Value>,
    target_audience: Option<serde_json::Value>,
) -> UpdateComplianceProfileRequest {
    let mut req = UpdateComplianceProfileRequest::new(listing_id);
    if let Some(v) = privacy_nutrition {
        req = req.with_privacy_nutrition(v);
    }
    if let Some(v) = content_rating_questionnaire {
        req = req.with_content_rating_questionnaire(v);
    }
    if let Some(v) = data_safety {
        req = req.with_data_safety(v);
    }
    if let Some(v) = target_audience {
        req = req.with_target_audience(v);
    }
    req
}

pub fn map_upsert_permission_disclosures(
    listing_id: String,
    permissions: Vec<PermissionDisclosureItem>,
) -> UpsertPermissionDisclosuresRequest {
    UpsertPermissionDisclosuresRequest::new(listing_id, permissions)
}

pub fn map_list_iap_items(
    listing_id: String,
    cursor: Option<String>,
    page_size: Option<i32>,
) -> ListIapItemsRequest {
    let mut req = ListIapItemsRequest::new(listing_id);
    if let Some(v) = cursor {
        req = req.with_cursor(v);
    }
    if let Some(v) = page_size {
        req = req.with_page_size(v);
    }
    req
}
