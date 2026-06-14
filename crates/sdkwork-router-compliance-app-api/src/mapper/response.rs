use sdkwork_appstore_compliance_service::domain::results::{
    RetrieveComplianceProfileResult, UpdateComplianceProfileResult,
    UpsertPermissionDisclosuresResult,
};

pub fn map_retrieve_compliance_profile_response(
    result: RetrieveComplianceProfileResult,
) -> RetrieveComplianceProfileResult {
    result
}

pub fn map_update_compliance_profile_response(
    result: UpdateComplianceProfileResult,
) -> UpdateComplianceProfileResult {
    result
}

pub fn map_upsert_permission_disclosures_response(
    result: UpsertPermissionDisclosuresResult,
) -> UpsertPermissionDisclosuresResult {
    result
}
