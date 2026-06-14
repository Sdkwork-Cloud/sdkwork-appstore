use sdkwork_appstore_release_service::domain::commands::{
    AttachArtifactRequest, CreateReleaseRequest, RetireReleaseRequest, RetrieveReleaseRequest,
    UpdateReleaseRequest, UpdateRolloutRequest, UpsertReleaseNotesRequest,
};

pub fn map_create_release(
    listing_id: String,
    channel_code: String,
    version_name: String,
    version_code: String,
    build_number: Option<String>,
    minimum_os_version: Option<String>,
) -> CreateReleaseRequest {
    let mut req = CreateReleaseRequest::new(listing_id, channel_code, version_name, version_code);
    if let Some(v) = build_number {
        req = req.with_build_number(v);
    }
    if let Some(v) = minimum_os_version {
        req = req.with_minimum_os_version(v);
    }
    req
}

pub fn map_retrieve_release(release_id: String) -> RetrieveReleaseRequest {
    RetrieveReleaseRequest::new(release_id)
}

pub fn map_update_release(
    release_id: String,
    minimum_os_version: Option<String>,
    release_status: Option<String>,
) -> UpdateReleaseRequest {
    let mut req = UpdateReleaseRequest::new(release_id);
    if let Some(v) = minimum_os_version {
        req = req.with_minimum_os_version(v);
    }
    if let Some(v) = release_status {
        req = req.with_release_status(v);
    }
    req
}

pub fn map_upsert_release_notes(
    release_id: String,
    locale: String,
    release_notes: String,
) -> UpsertReleaseNotesRequest {
    UpsertReleaseNotesRequest::new(release_id, locale, release_notes)
}

pub fn map_attach_artifact(
    release_id: String,
    platform: String,
    architecture: String,
    package_format: String,
    drive_node_id: String,
    checksum_sha256: String,
    file_size_bytes: String,
    content_type: Option<String>,
    media_resource_id: Option<String>,
    min_os_version: Option<String>,
) -> AttachArtifactRequest {
    let mut req = AttachArtifactRequest::new(
        release_id,
        platform,
        architecture,
        package_format,
        drive_node_id,
        checksum_sha256,
        file_size_bytes,
    );
    if let Some(v) = content_type {
        req = req.with_content_type(v);
    }
    if let Some(v) = media_resource_id {
        req = req.with_media_resource_id(v);
    }
    if let Some(v) = min_os_version {
        req = req.with_min_os_version(v);
    }
    req
}

pub fn map_update_rollout(
    release_id: String,
    rollout_strategy: String,
    target_percentage: i32,
    region_filter: Option<Vec<String>>,
    device_filter: Option<serde_json::Value>,
) -> UpdateRolloutRequest {
    let mut req = UpdateRolloutRequest::new(release_id, rollout_strategy, target_percentage);
    if let Some(v) = region_filter {
        req = req.with_region_filter(v);
    }
    if let Some(v) = device_filter {
        req = req.with_device_filter(v);
    }
    req
}

pub fn map_retire_release(release_id: String) -> RetireReleaseRequest {
    RetireReleaseRequest::new(release_id)
}
