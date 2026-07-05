use chrono::{Duration, Utc};

use crate::projection::AnalyticsProjectionRepository;

pub struct ListingMetricsJob {
    repository: AnalyticsProjectionRepository,
}

impl ListingMetricsJob {
    pub fn new(repository: AnalyticsProjectionRepository) -> Self {
        Self { repository }
    }

    pub async fn execute(&self, tenant_id: &str) -> Result<u64, String> {
        let snapshot_date = Utc::now().date_naive() - Duration::days(1);
        self.repository
            .project_listing_metrics(tenant_id, snapshot_date)
            .await
    }
}

pub struct ChartProjectionJob {
    repository: AnalyticsProjectionRepository,
}

impl ChartProjectionJob {
    pub fn new(repository: AnalyticsProjectionRepository) -> Self {
        Self { repository }
    }

    pub async fn execute(&self, tenant_id: &str) -> Result<(), String> {
        let snapshot_date = Utc::now().date_naive() - Duration::days(1);
        for chart_code in ["top_free", "top_paid", "top_new"] {
            self.repository
                .project_chart_snapshot(tenant_id, chart_code, snapshot_date, "en-US", "ALL", 50)
                .await?;
        }
        Ok(())
    }
}

pub struct TrendingTermsJob {
    repository: AnalyticsProjectionRepository,
}

impl TrendingTermsJob {
    pub fn new(repository: AnalyticsProjectionRepository) -> Self {
        Self { repository }
    }

    pub async fn execute(&self, tenant_id: &str) -> Result<u64, String> {
        let snapshot_date = Utc::now().date_naive();
        self.repository
            .project_trending_terms(tenant_id, snapshot_date, "zh-CN", 7, 20)
            .await
    }
}
