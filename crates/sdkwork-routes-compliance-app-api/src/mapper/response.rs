use sdkwork_appstore_compliance_service::domain::models::{
    CompliancePermissionDisclosure, ComplianceProfile,
};

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ComplianceProfileResponse {
    id: String,
    listing_id: String,
    compliance_version: i32,
    privacy_nutrition: serde_json::Value,
    content_rating_questionnaire: serde_json::Value,
    data_safety: serde_json::Value,
    target_audience: serde_json::Value,
    compliance_status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    reviewed_by: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    reviewed_at: Option<String>,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct CompliancePermissionResponse {
    id: String,
    listing_id: String,
    permission_code: String,
    usage_purpose: String,
    is_required: bool,
    disclosure_status: String,
}

pub(crate) fn map_compliance_profile(profile: ComplianceProfile) -> ComplianceProfileResponse {
    ComplianceProfileResponse {
        id: profile.id.0,
        listing_id: profile.listing_id,
        compliance_version: profile.compliance_version,
        privacy_nutrition: profile.privacy_nutrition_json,
        content_rating_questionnaire: profile.content_rating_questionnaire_json,
        data_safety: profile.data_safety_json,
        target_audience: profile.target_audience_json,
        compliance_status: profile.compliance_status.as_str().to_string(),
        reviewed_by: profile.reviewed_by,
        reviewed_at: profile.reviewed_at.map(|value| value.to_rfc3339()),
    }
}

pub(crate) fn map_compliance_permission(
    disclosure: CompliancePermissionDisclosure,
) -> CompliancePermissionResponse {
    CompliancePermissionResponse {
        id: disclosure.id,
        listing_id: disclosure.listing_id,
        permission_code: disclosure.permission_code,
        usage_purpose: disclosure.usage_purpose,
        is_required: disclosure.is_required,
        disclosure_status: disclosure.disclosure_status.as_str().to_string(),
    }
}
