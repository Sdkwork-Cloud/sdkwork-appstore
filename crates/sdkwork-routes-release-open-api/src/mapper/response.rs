use sdkwork_appstore_release_service::domain::results::{
    CheckUpdateResult, ResolveDownloadResult, RetrievePublicReleaseResult,
};

pub fn map_check_update_response(result: CheckUpdateResult) -> CheckUpdateResult {
    result
}

pub fn map_resolve_download_response(result: ResolveDownloadResult) -> ResolveDownloadResult {
    result
}

pub fn map_retrieve_public_release_response(
    result: RetrievePublicReleaseResult,
) -> RetrievePublicReleaseResult {
    result
}
