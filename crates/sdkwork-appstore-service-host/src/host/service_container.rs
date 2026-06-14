use crate::integrations::registry::{IntegrationCapability, integration_capabilities};

pub struct ServiceContainer {
    capabilities: &'static [IntegrationCapability],
}

impl ServiceContainer {
    pub fn build() -> Self {
        Self {
            capabilities: integration_capabilities(),
        }
    }

    pub fn capabilities(&self) -> &'static [IntegrationCapability] {
        self.capabilities
    }
}
