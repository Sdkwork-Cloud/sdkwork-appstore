use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AdapterConfig {
    pub key: String,
    pub enabled: bool,
    pub base_url: Option<String>,
    pub api_key: Option<String>,
    pub timeout_seconds: u64,
}

impl AdapterConfig {
    pub fn disabled(key: &str) -> Self {
        Self {
            key: key.to_string(),
            enabled: false,
            base_url: None,
            api_key: None,
            timeout_seconds: 30,
        }
    }
}

#[derive(Debug, Clone)]
pub struct AppstoreAdapters {
    pub appbase: AdapterConfig,
    pub platform: AdapterConfig,
    pub drive: AdapterConfig,
    pub comments: AdapterConfig,
    pub commerce: AdapterConfig,
    pub notifications: AdapterConfig,
    pub search: AdapterConfig,
    pub market_channels: AdapterConfig,
}

impl AppstoreAdapters {
    pub fn from_env() -> Self {
        Self {
            appbase: AdapterConfig {
                key: "appbase".to_string(),
                enabled: true,
                base_url: Some(
                    std::env::var("APPSTORE_IAM_BASE_URL")
                        .unwrap_or_else(|_| "http://127.0.0.1:18080".to_string()),
                ),
                api_key: std::env::var("APPSTORE_IAM_API_KEY").ok(),
                timeout_seconds: 10,
            },
            platform: AdapterConfig {
                key: "platform".to_string(),
                enabled: true,
                base_url: Some(
                    std::env::var("APPSTORE_PLATFORM_BASE_URL")
                        .unwrap_or_else(|_| "http://127.0.0.1:18080".to_string()),
                ),
                api_key: std::env::var("APPSTORE_PLATFORM_API_KEY").ok(),
                timeout_seconds: 10,
            },
            drive: AdapterConfig {
                key: "drive".to_string(),
                enabled: true,
                base_url: Some(
                    std::env::var("APPSTORE_DRIVE_BASE_URL")
                        .unwrap_or_else(|_| "http://127.0.0.1:18081".to_string()),
                ),
                api_key: std::env::var("APPSTORE_DRIVE_API_KEY").ok(),
                timeout_seconds: 30,
            },
            comments: AdapterConfig {
                key: "comments".to_string(),
                enabled: true,
                base_url: Some(
                    std::env::var("APPSTORE_COMMENTS_BASE_URL")
                        .unwrap_or_else(|_| "http://127.0.0.1:18082".to_string()),
                ),
                api_key: std::env::var("APPSTORE_COMMENTS_API_KEY").ok(),
                timeout_seconds: 10,
            },
            commerce: AdapterConfig::disabled("commerce"),
            notifications: AdapterConfig::disabled("notifications"),
            search: AdapterConfig::disabled("search"),
            market_channels: AdapterConfig::disabled("market_channels"),
        }
    }

    pub fn required_adapters(&self) -> Vec<&AdapterConfig> {
        [&self.appbase, &self.platform, &self.drive, &self.comments]
            .into_iter()
            .filter(|a| a.enabled)
            .collect()
    }

    pub fn validate_required(&self) -> Result<(), Vec<String>> {
        let mut errors = Vec::new();
        for adapter in self.required_adapters() {
            if adapter.base_url.is_none() {
                errors.push(format!("Adapter '{}' requires base_url", adapter.key));
            }
        }
        if errors.is_empty() {
            Ok(())
        } else {
            Err(errors)
        }
    }
}
