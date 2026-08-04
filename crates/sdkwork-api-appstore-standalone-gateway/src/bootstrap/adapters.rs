//! Dependency adapter wiring for the appstore standalone gateway.
//!
//! Adapters connect appstore domain services to dependency-owned surfaces
//! (sdkwork-drive artifact/media validation, sdkwork-platform registered app
//! validation, optional sdkwork-search federation). Each adapter is enabled by
//! its documented environment contract and degrades to the built-in fallback
//! when the dependency endpoint is not configured.

#[derive(Debug, Clone, Default)]
pub struct DependencyAdapters {
    pub drive_base_url: Option<String>,
    pub platform_base_url: Option<String>,
    pub search_base_url: Option<String>,
}

impl DependencyAdapters {
    pub fn from_env() -> Self {
        Self {
            drive_base_url: read_env("APPSTORE_DRIVE_BASE_URL"),
            platform_base_url: read_env("APPSTORE_PLATFORM_BASE_URL"),
            search_base_url: read_env("APPSTORE_SEARCH_BASE_URL"),
        }
    }

    pub fn drive_enabled(&self) -> bool {
        self.drive_base_url.is_some()
    }

    pub fn platform_enabled(&self) -> bool {
        self.platform_base_url.is_some()
    }

    pub fn search_enabled(&self) -> bool {
        self.search_base_url.is_some()
    }
}

fn read_env(key: &str) -> Option<String> {
    std::env::var(key)
        .ok()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}
