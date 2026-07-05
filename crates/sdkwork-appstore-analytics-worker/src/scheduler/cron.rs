use std::time::Duration;

use tokio::time::interval;

#[derive(Clone)]
pub struct Scheduler {
    metrics_interval: Duration,
    chart_interval: Duration,
    trending_interval: Duration,
}

impl Scheduler {
    pub fn new(
        metrics_interval: Duration,
        chart_interval: Duration,
        trending_interval: Duration,
    ) -> Self {
        Self {
            metrics_interval,
            chart_interval,
            trending_interval,
        }
    }

    pub async fn run_periodic<F, Fut>(&self, every: Duration, mut task: F)
    where
        F: FnMut() -> Fut,
        Fut: std::future::Future<Output = ()>,
    {
        let mut ticker = interval(every);
        loop {
            ticker.tick().await;
            task().await;
        }
    }

    pub fn metrics_interval(&self) -> Duration {
        self.metrics_interval
    }

    pub fn chart_interval(&self) -> Duration {
        self.chart_interval
    }

    pub fn trending_interval(&self) -> Duration {
        self.trending_interval
    }
}
