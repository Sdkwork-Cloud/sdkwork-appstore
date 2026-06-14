use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkerConfig {
    pub database_url: String,
    pub tenant_id: String,
    pub metrics_interval_seconds: u64,
    pub chart_interval_seconds: u64,
}

impl WorkerConfig {
    pub fn from_env() -> Self {
        Self {
            database_url: std::env::var("APPSTORE_DATABASE_URL")
                .unwrap_or_else(|_| "sqlite:appstore.db".to_string()),
            tenant_id: std::env::var("APPSTORE_TENANT_ID")
                .unwrap_or_else(|_| "default".to_string()),
            metrics_interval_seconds: std::env::var("APPSTORE_METRICS_INTERVAL_SECONDS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(3600),
            chart_interval_seconds: std::env::var("APPSTORE_CHART_INTERVAL_SECONDS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(86400),
        }
    }
}
