use sdkwork_appstore_release_service::domain::models::{
    Release, ReleaseArtifact, ReleaseNoteLocalization, ReleaseRollout,
};

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ReleaseResponse {
    id: String,
    release_no: String,
    listing_id: String,
    channel_id: String,
    version_name: String,
    version_code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    build_number: Option<String>,
    release_status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    minimum_os_version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    submitted_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    approved_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    published_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    retired_at: Option<String>,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ReleaseNoteResponse {
    id: String,
    locale: String,
    release_notes: String,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ReleaseArtifactResponse {
    id: String,
    artifact_no: String,
    platform: String,
    architecture: String,
    package_format: String,
    artifact_status: String,
    drive_node_id: String,
    file_size_bytes: String,
    content_type: String,
    checksum_sha256: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    min_os_version: Option<String>,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ReleaseRolloutResponse {
    id: String,
    rollout_strategy: String,
    rollout_status: String,
    target_percentage: i32,
    current_percentage: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    started_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    completed_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    paused_at: Option<String>,
}

pub(crate) fn map_release(release: Release) -> ReleaseResponse {
    ReleaseResponse {
        id: release.id.0,
        release_no: release.release_no,
        listing_id: release.listing_id,
        channel_id: release.channel_id.0,
        version_name: release.version_name,
        version_code: release.version_code,
        build_number: release.build_number,
        release_status: release.release_status.as_str().to_string(),
        minimum_os_version: release.minimum_os_version,
        submitted_at: release.submitted_at.map(|value| value.to_rfc3339()),
        approved_at: release.approved_at.map(|value| value.to_rfc3339()),
        published_at: release.published_at.map(|value| value.to_rfc3339()),
        retired_at: release.retired_at.map(|value| value.to_rfc3339()),
    }
}

pub(crate) fn map_release_note(localization: ReleaseNoteLocalization) -> ReleaseNoteResponse {
    ReleaseNoteResponse {
        id: localization.id,
        locale: localization.locale,
        release_notes: localization.release_notes,
    }
}

pub(crate) fn map_release_artifact(artifact: ReleaseArtifact) -> ReleaseArtifactResponse {
    ReleaseArtifactResponse {
        id: artifact.id.0,
        artifact_no: artifact.artifact_no,
        platform: artifact.platform,
        architecture: artifact.architecture,
        package_format: artifact.package_format,
        artifact_status: artifact.artifact_status.as_str().to_string(),
        drive_node_id: artifact.drive_node_id,
        file_size_bytes: artifact.file_size_bytes,
        content_type: artifact.content_type,
        checksum_sha256: artifact.checksum_sha256,
        min_os_version: artifact.min_os_version,
    }
}

pub(crate) fn map_release_rollout(rollout: ReleaseRollout) -> ReleaseRolloutResponse {
    ReleaseRolloutResponse {
        id: rollout.id,
        rollout_strategy: rollout.rollout_strategy.as_str().to_string(),
        rollout_status: rollout.rollout_status.as_str().to_string(),
        target_percentage: rollout.target_percentage,
        current_percentage: rollout.current_percentage,
        started_at: rollout.started_at.map(|value| value.to_rfc3339()),
        completed_at: rollout.completed_at.map(|value| value.to_rfc3339()),
        paused_at: rollout.paused_at.map(|value| value.to_rfc3339()),
    }
}
