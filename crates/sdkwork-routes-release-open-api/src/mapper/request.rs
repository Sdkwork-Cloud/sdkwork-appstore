use sdkwork_appstore_release_service::domain::commands::{
    CheckUpdateRequest, ResolveDownloadRequest, RetrievePublicReleaseRequest,
};

pub fn map_check_update(
    app_key: String,
    platform: String,
    installed_version_code: String,
    channel_code: String,
    architecture: Option<String>,
    device_id: Option<String>,
    region_code: Option<String>,
) -> CheckUpdateRequest {
    let mut req = CheckUpdateRequest::new(app_key, platform, installed_version_code, channel_code);
    if let Some(v) = architecture {
        req = req.with_architecture(v);
    }
    if let Some(v) = device_id {
        req = req.with_device_id(v);
    }
    if let Some(v) = region_code {
        req = req.with_region_code(v);
    }
    req
}

pub fn map_resolve_download(
    artifact_id: String,
    grant_id: Option<String>,
    app_key: Option<String>,
) -> ResolveDownloadRequest {
    let mut req = ResolveDownloadRequest::new(artifact_id);
    if let Some(v) = grant_id {
        req = req.with_grant_id(v);
    }
    if let Some(v) = app_key {
        req = req.with_app_key(v);
    }
    req
}

pub fn map_retrieve_public_release(release_id: String) -> RetrievePublicReleaseRequest {
    RetrievePublicReleaseRequest::new(release_id)
}
