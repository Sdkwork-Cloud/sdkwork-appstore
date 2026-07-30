use sdkwork_appstore_repository_sqlx::AppstoreSqlxDb;

use crate::projection::AnalyticsProjectionRepository;

pub struct WorkerRepositories {
    pub projection: AnalyticsProjectionRepository,
}

impl WorkerRepositories {
    pub fn new(database: AppstoreSqlxDb) -> Self {
        Self {
            projection: AnalyticsProjectionRepository::new(database),
        }
    }
}
