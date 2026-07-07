use crate::mapper;
use sdkwork_appstore_compliance_service::context::AppstoreRequestContext;
use sdkwork_appstore_compliance_service::domain::commands::PermissionDisclosureItem;
use sdkwork_appstore_compliance_service::domain::results::{
    ListIapItemsResult, RetrieveComplianceProfileResult, UpdateComplianceProfileResult,
    UpsertPermissionDisclosuresResult,
};
use sdkwork_appstore_compliance_service::error::AppstoreServiceError;
use sdkwork_appstore_compliance_service::ComplianceOperations;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteHandlerPlan {
    pub operation_id: &'static str,
    pub handler_name: &'static str,
    pub service_method: &'static str,
}

pub const ROUTE_HANDLER_PLANS: &[RouteHandlerPlan] = &[
    RouteHandlerPlan {
        operation_id: "appstore.compliance.profile.retrieve",
        handler_name: "compliance_profile_retrieve",
        service_method: "retrieve_compliance_profile",
    },
    RouteHandlerPlan {
        operation_id: "appstore.compliance.profile.update",
        handler_name: "compliance_profile_update",
        service_method: "update_compliance_profile",
    },
    RouteHandlerPlan {
        operation_id: "appstore.compliance.permissions.update",
        handler_name: "compliance_permissions_update",
        service_method: "upsert_permission_disclosures",
    },
    RouteHandlerPlan {
        operation_id: "appstore.compliance.iapItems.list",
        handler_name: "compliance_iap_items_list",
        service_method: "list_iap_items",
    },
];

pub fn route_handler_plans() -> &'static [RouteHandlerPlan] {
    ROUTE_HANDLER_PLANS
}

pub async fn compliance_profile_retrieve<S: ComplianceOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    listing_id: String,
) -> Result<RetrieveComplianceProfileResult, AppstoreServiceError> {
    let cmd = mapper::request::map_retrieve_compliance_profile(listing_id);
    service.retrieve_compliance_profile(context, cmd).await
}

pub async fn compliance_profile_update<S: ComplianceOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    listing_id: String,
    privacy_nutrition: Option<serde_json::Value>,
    content_rating_questionnaire: Option<serde_json::Value>,
    data_safety: Option<serde_json::Value>,
    target_audience: Option<serde_json::Value>,
) -> Result<UpdateComplianceProfileResult, AppstoreServiceError> {
    let cmd = mapper::request::map_update_compliance_profile(
        listing_id,
        privacy_nutrition,
        content_rating_questionnaire,
        data_safety,
        target_audience,
    );
    service.update_compliance_profile(context, cmd).await
}

pub async fn compliance_permissions_update<S: ComplianceOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    listing_id: String,
    permissions: Vec<PermissionDisclosureItem>,
) -> Result<UpsertPermissionDisclosuresResult, AppstoreServiceError> {
    let cmd = mapper::request::map_upsert_permission_disclosures(listing_id, permissions);
    service.upsert_permission_disclosures(context, cmd).await
}

pub async fn compliance_iap_items_list<S: ComplianceOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    listing_id: String,
    cursor: Option<String>,
    page_size: Option<i32>,
) -> Result<ListIapItemsResult, AppstoreServiceError> {
    let cmd = mapper::request::map_list_iap_items(listing_id, cursor, page_size);
    service.list_iap_items(context, cmd).await
}
