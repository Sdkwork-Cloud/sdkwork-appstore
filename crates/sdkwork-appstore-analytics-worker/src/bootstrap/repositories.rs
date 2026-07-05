use sqlx::{Pool, Sqlite};

use crate::projection::AnalyticsProjectionRepository;

pub struct WorkerRepositories {
    pub projection: AnalyticsProjectionRepository,
}

impl WorkerRepositories {
    pub fn new(pool: Pool<Sqlite>) -> Self {
        Self {
            projection: AnalyticsProjectionRepository::new(pool),
        }
    }
}
