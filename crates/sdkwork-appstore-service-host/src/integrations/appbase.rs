use super::registry::{IntegrationCapability, IntegrationOwner, IntegrationSurface};

pub const INTEGRATION_NAME: &str = "appbase";

pub fn required_scopes() -> &'static [&'static str] {
    &["tenant", "organization", "user", "auth"]
}

pub const CAPABILITY: IntegrationCapability = IntegrationCapability {
    key: "appbase",
    owner: IntegrationOwner::Dependency("sdkwork-appbase"),
    purpose: "login, session, organization context",
    surfaces: &[IntegrationSurface::AppApi, IntegrationSurface::RustRuntime],
    required: true,
    todo: "",
};
