use sdkwork_appstore_release_service::domain::models::Release;
use sdkwork_appstore_release_service::domain::results::{CheckUpdateResult, ResolveDownloadResult};

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct CheckUpdateResponse {
    update_available: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    release_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    version_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    version_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    artifact_id: Option<String>,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ResolveDownloadResponse {
    #[serde(skip_serializing_if = "Option::is_none")]
    download_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    expires_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    checksum_sha256: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    file_size_bytes: Option<String>,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct PublicReleaseResponse {
    id: String,
    listing_id: String,
    release_no: String,
    version_name: String,
    version_code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    build_number: Option<String>,
    release_status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    minimum_os_version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    published_at: Option<String>,
}

pub(crate) fn map_check_update(result: CheckUpdateResult) -> CheckUpdateResponse {
    CheckUpdateResponse {
        update_available: result.update_available,
        release_id: result.release_id,
        version_name: result.version_name,
        version_code: result.version_code,
        artifact_id: result.artifact_id,
    }
}

pub(crate) fn map_resolve_download(result: ResolveDownloadResult) -> ResolveDownloadResponse {
    ResolveDownloadResponse {
        download_url: result.download_url,
        expires_at: result.expires_at,
        checksum_sha256: result.checksum_sha256,
        file_size_bytes: result.file_size_bytes,
    }
}

pub(crate) fn map_public_release(release: Release) -> PublicReleaseResponse {
    PublicReleaseResponse {
        id: release.id.0,
        listing_id: release.listing_id,
        release_no: release.release_no,
        version_name: release.version_name,
        version_code: release.version_code,
        build_number: release.build_number,
        release_status: release.release_status.as_str().to_string(),
        minimum_os_version: release.minimum_os_version,
        published_at: release.published_at.map(|value| value.to_rfc3339()),
    }
}
