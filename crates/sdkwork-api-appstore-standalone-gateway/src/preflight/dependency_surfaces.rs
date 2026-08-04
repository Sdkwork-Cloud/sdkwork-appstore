//! Dependency surface preflight declarations.
//!
//! Declares the external dependency surfaces the appstore standalone gateway
//! consumes and the environment contract that activates each surface.

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DependencySurface {
    Drive,
    Platform,
    Search,
    MarketChannels,
}

impl DependencySurface {
    pub fn code(&self) -> &'static str {
        match self {
            Self::Drive => "drive",
            Self::Platform => "platform",
            Self::Search => "search",
            Self::MarketChannels => "market_channels",
        }
    }

    pub fn env_key(&self) -> &'static str {
        match self {
            Self::Drive => "APPSTORE_DRIVE_BASE_URL",
            Self::Platform => "APPSTORE_PLATFORM_BASE_URL",
            Self::Search => "APPSTORE_SEARCH_BASE_URL",
            Self::MarketChannels => "APPSTORE_MARKET_PROVIDER_ENABLED",
        }
    }
}

/// All dependency surfaces the gateway can activate in a deployment.
pub fn dependency_surfaces() -> Vec<DependencySurface> {
    vec![
        DependencySurface::Drive,
        DependencySurface::Platform,
        DependencySurface::Search,
        DependencySurface::MarketChannels,
    ]
}

/// Surfaces activated by the current process environment.
pub fn active_dependency_surfaces() -> Vec<DependencySurface> {
    dependency_surfaces()
        .into_iter()
        .filter(|surface| {
            std::env::var(surface.env_key())
                .ok()
                .map(|value| !value.trim().is_empty())
                .unwrap_or(false)
        })
        .collect()
}
