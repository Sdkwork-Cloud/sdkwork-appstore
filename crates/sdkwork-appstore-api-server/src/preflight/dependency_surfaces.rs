use crate::bootstrap::adapters::AppstoreAdapters;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PreflightStatus {
    Ready,
    Degraded { warnings: Vec<String> },
    Failed { errors: Vec<String> },
}

pub fn validate_dependency_surfaces(adapters: &AppstoreAdapters) -> PreflightStatus {
    let mut errors = Vec::new();
    let mut warnings = Vec::new();

    if adapters.appbase.base_url.is_none() {
        errors.push("appbase context/auth dependency is unavailable".to_string());
    }
    if adapters.platform.base_url.is_none() {
        errors.push("platform adapter is unavailable for publish/release workflows".to_string());
    }
    if adapters.drive.base_url.is_none() {
        errors.push("Drive media/artifact dependency is unavailable".to_string());
    }
    if adapters.comments.base_url.is_none() {
        errors.push("comments review/rating dependency is unavailable".to_string());
    }
    if !adapters.commerce.enabled {
        warnings.push("commerce adapter disabled: paid app/IAP features unavailable".to_string());
    }
    if !adapters.notifications.enabled {
        warnings
            .push("notifications adapter disabled: outbound notifications unavailable".to_string());
    }
    if !adapters.search.enabled {
        warnings.push("search adapter disabled: catalog search uses DB fallback".to_string());
    }
    if !adapters.market_channels.enabled {
        warnings.push(
            "market_channels adapter disabled: external marketplace sync unavailable".to_string(),
        );
    }

    if !errors.is_empty() {
        PreflightStatus::Failed { errors }
    } else if !warnings.is_empty() {
        PreflightStatus::Degraded { warnings }
    } else {
        PreflightStatus::Ready
    }
}
