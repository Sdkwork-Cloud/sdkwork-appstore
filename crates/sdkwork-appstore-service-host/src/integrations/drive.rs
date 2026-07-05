use super::registry::{IntegrationCapability, IntegrationOwner, IntegrationSurface};

pub const INTEGRATION_NAME: &str = "drive";

pub fn required_scopes() -> &'static [&'static str] {
    &["media_resource", "upload", "download_grant"]
}

pub const CAPABILITY: IntegrationCapability = IntegrationCapability {
    key: "drive",
    owner: IntegrationOwner::Dependency("sdkwork-drive"),
    purpose: "icons, screenshots, binaries, release artifacts",
    surfaces: &[IntegrationSurface::AppApi, IntegrationSurface::ServicePort],
    required: true,
    todo: "Service adapter uses sdkwork-drive uploader + assets app-api; set APPSTORE_DRIVE_BASE_URL and service tokens.",
};
