use chrono::{DateTime, Utc};
use serde_json::Value;

#[derive(Debug, Clone)]
pub struct ChartSnapshot {
    pub tenant_id: String,
    pub chart_code: String,
    pub snapshot_date: String,
    pub locale: String,
    pub platform_scope: String,
    pub ranking_json: Value,
    pub generated_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}

pub struct ChartProjectionJob;

impl ChartProjectionJob {
    pub fn new() -> Self {
        Self
    }

    pub async fn execute(&self, _tenant_id: &str) -> Result<(), String> {
        Ok(())
    }
}
