use std::future::Future;
use std::pin::Pin;

use sdkwork_database_sqlx::DatabasePool;
use sdkwork_web_bootstrap::ReadinessCheck;

pub struct AppstoreDatabaseReadinessCheck {
    pool: DatabasePool,
}

impl AppstoreDatabaseReadinessCheck {
    pub fn new(pool: DatabasePool) -> Self {
        Self { pool }
    }
}

impl ReadinessCheck for AppstoreDatabaseReadinessCheck {
    fn check(&self) -> Pin<Box<dyn Future<Output = Result<(), String>> + Send + '_>> {
        let pool = self.pool.clone();
        Box::pin(async move {
            pool.execute_raw("SELECT 1")
                .await
                .map(|_| ())
                .map_err(|error| error.to_string())
        })
    }
}
