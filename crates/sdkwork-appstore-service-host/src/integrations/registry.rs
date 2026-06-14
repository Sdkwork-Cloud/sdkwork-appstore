//! Integration capability registry.

use crate::integrations::{
    appbase, comments, commerce, drive, market_channels, notifications, platform, search,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum IntegrationOwner {
    Dependency(&'static str),
    AppStore,
    PlatformProvider(&'static str),
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum IntegrationSurface {
    AppApi,
    BackendApi,
    OpenApi,
    RustRuntime,
    ServicePort,
    Event,
    WorkerProjection,
    ExternalConnector,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct IntegrationCapability {
    pub key: &'static str,
    pub owner: IntegrationOwner,
    pub purpose: &'static str,
    pub surfaces: &'static [IntegrationSurface],
    pub required: bool,
    pub todo: &'static str,
}

const INTEGRATION_CAPABILITIES: &[IntegrationCapability] = &[
    appbase::CAPABILITY,
    platform::CAPABILITY,
    drive::CAPABILITY,
    comments::CAPABILITY,
    commerce::CAPABILITY,
    notifications::CAPABILITY,
    search::CAPABILITY,
    market_channels::CAPABILITY,
];

pub fn integration_capabilities() -> &'static [IntegrationCapability] {
    INTEGRATION_CAPABILITIES
}

pub fn required_integration_keys() -> Vec<&'static str> {
    INTEGRATION_CAPABILITIES
        .iter()
        .filter(|capability| capability.required)
        .map(|capability| capability.key)
        .collect()
}
