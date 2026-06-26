use crate::mapper;
use sdkwork_appstore_release_service::context::AppstoreRequestContext;
use sdkwork_appstore_release_service::domain::results::{
    AttachArtifactResult, CreateReleaseResult, RetireReleaseResult, RetrieveReleaseResult,
    UpdateReleaseResult, UpdateRolloutResult, UpsertReleaseNotesResult,
};
use sdkwork_appstore_release_service::error::AppstoreServiceError;
use sdkwork_appstore_release_service::ReleaseOperations;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteHandlerPlan {
    pub operation_id: &'static str,
    pub handler_name: &'static str,
    pub service_method: &'static str,
}

pub const ROUTE_HANDLER_PLANS: &[RouteHandlerPlan] = &[
    RouteHandlerPlan {
        operation_id: "appstore.releases.create",
        handler_name: "releases_create",
        service_method: "create_release",
    },
    RouteHandlerPlan {
        operation_id: "appstore.releases.retrieve",
        handler_name: "releases_retrieve",
        service_method: "retrieve_release",
    },
    RouteHandlerPlan {
        operation_id: "appstore.releases.update",
        handler_name: "releases_update",
        service_method: "update_release",
    },
    RouteHandlerPlan {
        operation_id: "appstore.releases.notes.upsert",
        handler_name: "releases_notes_upsert",
        service_method: "upsert_release_notes",
    },
    RouteHandlerPlan {
        operation_id: "appstore.releases.artifacts.attach",
        handler_name: "releases_artifacts_attach",
        service_method: "attach_artifact",
    },
    RouteHandlerPlan {
        operation_id: "appstore.releases.rollout.update",
        handler_name: "releases_rollout_update",
        service_method: "update_rollout",
    },
    RouteHandlerPlan {
        operation_id: "appstore.releases.retire",
        handler_name: "releases_retire",
        service_method: "retire_release",
    },
];

pub fn route_handler_plans() -> &'static [RouteHandlerPlan] {
    ROUTE_HANDLER_PLANS
}

pub async fn releases_create<S: ReleaseOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    listing_id: String,
    channel_code: String,
    version_name: String,
    version_code: String,
    build_number: Option<String>,
    minimum_os_version: Option<String>,
) -> Result<CreateReleaseResult, AppstoreServiceError> {
    let cmd = mapper::request::map_create_release(
        listing_id,
        channel_code,
        version_name,
        version_code,
        build_number,
        minimum_os_version,
    );
    service.create_release(context, cmd).await
}

pub async fn releases_retrieve<S: ReleaseOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    release_id: String,
) -> Result<RetrieveReleaseResult, AppstoreServiceError> {
    let cmd = mapper::request::map_retrieve_release(release_id);
    service.retrieve_release(context, cmd).await
}

pub async fn releases_update<S: ReleaseOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    release_id: String,
    minimum_os_version: Option<String>,
    release_status: Option<String>,
) -> Result<UpdateReleaseResult, AppstoreServiceError> {
    let cmd = mapper::request::map_update_release(release_id, minimum_os_version, release_status);
    service.update_release(context, cmd).await
}

pub async fn releases_notes_upsert<S: ReleaseOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    release_id: String,
    locale: String,
    release_notes: String,
) -> Result<UpsertReleaseNotesResult, AppstoreServiceError> {
    let cmd = mapper::request::map_upsert_release_notes(release_id, locale, release_notes);
    service.upsert_release_notes(context, cmd).await
}

pub async fn releases_artifacts_attach<S: ReleaseOperations>(
    service: &S,
    context: &AppstoreRequestContext,
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
) -> Result<AttachArtifactResult, AppstoreServiceError> {
    let cmd = mapper::request::map_attach_artifact(
        release_id,
        platform,
        architecture,
        package_format,
        drive_node_id,
        checksum_sha256,
        file_size_bytes,
        content_type,
        media_resource_id,
        min_os_version,
    );
    service.attach_artifact(context, cmd).await
}

pub async fn releases_rollout_update<S: ReleaseOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    release_id: String,
    rollout_strategy: String,
    target_percentage: i32,
    region_filter: Option<Vec<String>>,
    device_filter: Option<serde_json::Value>,
) -> Result<UpdateRolloutResult, AppstoreServiceError> {
    let cmd = mapper::request::map_update_rollout(
        release_id,
        rollout_strategy,
        target_percentage,
        region_filter,
        device_filter,
    );
    service.update_rollout(context, cmd).await
}

pub async fn releases_retire<S: ReleaseOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    release_id: String,
) -> Result<RetireReleaseResult, AppstoreServiceError> {
    let cmd = mapper::request::map_retire_release(release_id);
    service.retire_release(context, cmd).await
}
