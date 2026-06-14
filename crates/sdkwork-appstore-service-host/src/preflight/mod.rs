//! Service host preflight placeholder.

use crate::host::service_container::ServiceContainer;

pub struct PreflightReport {
    pub required_capabilities: Vec<&'static str>,
}

pub fn build_preflight_report() -> PreflightReport {
    let container = ServiceContainer::build();
    let required_capabilities = container
        .capabilities()
        .iter()
        .filter(|capability| capability.required)
        .map(|capability| capability.key)
        .collect();

    PreflightReport { required_capabilities }
}
