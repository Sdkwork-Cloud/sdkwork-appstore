use super::registry::{IntegrationCapability, IntegrationOwner, IntegrationSurface};

pub const INTEGRATION_NAME: &str = "platform";

pub fn required_scopes() -> &'static [&'static str] {
    &["plus_app_id", "plus_app_key", "manifest_snapshot_json"]
}

pub const CAPABILITY: IntegrationCapability = IntegrationCapability {
    key: "platform",
    owner: IntegrationOwner::Dependency("sdkwork-appbase"),
    purpose: "PlusApp registration and manifest projection",
    surfaces: &[IntegrationSurface::AppApi, IntegrationSurface::RustRuntime],
    required: true,
    todo: "",
};
