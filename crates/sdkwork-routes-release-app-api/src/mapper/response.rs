use sdkwork_appstore_release_service::domain::results::{
    AttachArtifactResult, CreateReleaseResult, RetireReleaseResult, RetrieveReleaseResult,
    UpdateReleaseResult, UpdateRolloutResult, UpsertReleaseNotesResult,
};

pub fn map_create_release_response(result: CreateReleaseResult) -> CreateReleaseResult {
    result
}

pub fn map_retrieve_release_response(result: RetrieveReleaseResult) -> RetrieveReleaseResult {
    result
}

pub fn map_update_release_response(result: UpdateReleaseResult) -> UpdateReleaseResult {
    result
}

pub fn map_upsert_release_notes_response(
    result: UpsertReleaseNotesResult,
) -> UpsertReleaseNotesResult {
    result
}

pub fn map_attach_artifact_response(result: AttachArtifactResult) -> AttachArtifactResult {
    result
}

pub fn map_update_rollout_response(result: UpdateRolloutResult) -> UpdateRolloutResult {
    result
}

pub fn map_retire_release_response(result: RetireReleaseResult) -> RetireReleaseResult {
    result
}
