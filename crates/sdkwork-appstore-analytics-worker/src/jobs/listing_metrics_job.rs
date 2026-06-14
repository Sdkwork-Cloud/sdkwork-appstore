use chrono::{DateTime, Utc};

#[derive(Debug, Clone)]
pub struct ListingMetricsSnapshot {
    pub tenant_id: String,
    pub listing_id: String,
    pub snapshot_date: String,
    pub impression_count: i32,
    pub detail_view_count: i32,
    pub install_count: i32,
    pub uninstall_count: i32,
    pub update_count: i32,
    pub conversion_rate: Option<String>,
    pub created_at: DateTime<Utc>,
}

pub struct ListingMetricsJob;

impl ListingMetricsJob {
    pub fn new() -> Self {
        Self
    }

    pub async fn execute(&self, _tenant_id: &str) -> Result<(), String> {
        Ok(())
    }
}
