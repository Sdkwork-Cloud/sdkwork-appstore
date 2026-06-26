use crate::mapper;
use sdkwork_appstore_release_service::context::AppstoreRequestContext;
use sdkwork_appstore_release_service::domain::results::{
    CheckUpdateResult, ResolveDownloadResult, RetrievePublicReleaseResult,
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
        operation_id: "appstore.releases.checkUpdate",
        handler_name: "releases_check_update",
        service_method: "check_update",
    },
    RouteHandlerPlan {
        operation_id: "appstore.artifacts.resolveDownload",
        handler_name: "artifacts_resolve_download",
        service_method: "resolve_download",
    },
    RouteHandlerPlan {
        operation_id: "appstore.releases.public.retrieve",
        handler_name: "releases_public_retrieve",
        service_method: "public_retrieve_release",
    },
];

pub fn route_handler_plans() -> &'static [RouteHandlerPlan] {
    ROUTE_HANDLER_PLANS
}

pub async fn releases_check_update<S: ReleaseOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    plus_app_key: String,
    platform: String,
    installed_version_code: String,
    channel_code: String,
    architecture: Option<String>,
    device_id: Option<String>,
    region_code: Option<String>,
) -> Result<CheckUpdateResult, AppstoreServiceError> {
    let cmd = mapper::request::map_check_update(
        plus_app_key,
        platform,
        installed_version_code,
        channel_code,
        architecture,
        device_id,
        region_code,
    );
    service.check_update(context, cmd).await
}

pub async fn artifacts_resolve_download<S: ReleaseOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    artifact_id: String,
    grant_id: Option<String>,
    plus_app_key: Option<String>,
) -> Result<ResolveDownloadResult, AppstoreServiceError> {
    let cmd = mapper::request::map_resolve_download(artifact_id, grant_id, plus_app_key);
    service.resolve_download(context, cmd).await
}

pub async fn releases_public_retrieve<S: ReleaseOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    release_id: String,
) -> Result<RetrievePublicReleaseResult, AppstoreServiceError> {
    let cmd = mapper::request::map_retrieve_public_release(release_id);
    service.retrieve_public_release(context, cmd).await
}
