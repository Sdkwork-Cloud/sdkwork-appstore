//! Unified SQLx pool handle for SQLite and PostgreSQL.

use sdkwork_database_sqlx::DatabasePool;
use sqlx::{Pool, Postgres, Sqlite};

use crate::db::dialect::{AppstoreSqlDialect, adapt_sql};

#[derive(Debug, Clone)]
pub enum AppstoreDbPool {
    Sqlite(Pool<Sqlite>),
    Postgres(Pool<Postgres>),
}

#[derive(Debug, Clone)]
pub struct AppstoreSqlxDb {
    pub pool: AppstoreDbPool,
    pub dialect: AppstoreSqlDialect,
}

impl AppstoreSqlxDb {
    pub fn sqlite(pool: Pool<Sqlite>) -> Self {
        Self {
            pool: AppstoreDbPool::Sqlite(pool),
            dialect: AppstoreSqlDialect::Sqlite,
        }
    }

    pub fn from_database_pool(database_pool: &DatabasePool) -> Result<Self, String> {
        if let Some(pool) = database_pool.as_sqlite() {
            return Ok(Self::sqlite(pool.clone()));
        }
        if let Some(pool) = database_pool.as_postgres() {
            return Ok(Self {
                pool: AppstoreDbPool::Postgres(pool.clone()),
                dialect: AppstoreSqlDialect::Postgres,
            });
        }
        Err("DatabasePool is not SQLite or PostgreSQL".to_string())
    }

    pub fn adapt_sql(&self, template: &str) -> String {
        adapt_sql(template, self.dialect)
    }
}
