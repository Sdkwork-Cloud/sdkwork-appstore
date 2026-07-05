//! Dialect-aware SQLx query wrappers (SQLite + PostgreSQL).

use sqlx::postgres::PgArguments;
use sqlx::query::{QueryAs, QueryScalar};
use sqlx::sqlite::SqliteArguments;
use sqlx::{Encode, FromRow, Postgres, Sqlite, Type};

use crate::pool::{AppstoreDbPool, AppstoreSqlxDb};

pub enum AppstoreQuery<'q> {
    Sqlite(sqlx::query::Query<'q, Sqlite, SqliteArguments<'q>>),
    Postgres(sqlx::query::Query<'q, Postgres, PgArguments>),
}

pub enum AppstoreQueryAs<'q, O> {
    Sqlite(QueryAs<'q, Sqlite, O, SqliteArguments<'q>>),
    Postgres(QueryAs<'q, Postgres, O, PgArguments>),
}

pub enum AppstoreQueryScalar<'q, O> {
    Sqlite(QueryScalar<'q, Sqlite, O, SqliteArguments<'q>>),
    Postgres(QueryScalar<'q, Postgres, O, PgArguments>),
}

pub enum AppstoreTransaction<'a> {
    Sqlite(sqlx::Transaction<'a, Sqlite>),
    Postgres(sqlx::Transaction<'a, Postgres>),
}

/// Unified execute result (rows affected).
pub struct AppstoreExecuteResult {
    pub rows_affected: u64,
}

impl AppstoreExecuteResult {
    pub fn rows_affected(&self) -> u64 {
        self.rows_affected
    }
}

impl AppstoreSqlxDb {
    pub fn query<'q>(&'q self, template: &'q str) -> AppstoreQuery<'q> {
        let sql = self.adapt_sql(template);
        match &self.pool {
            AppstoreDbPool::Sqlite(_) => AppstoreQuery::Sqlite(sqlx::query(&sql)),
            AppstoreDbPool::Postgres(_) => AppstoreQuery::Postgres(sqlx::query(&sql)),
        }
    }

    pub fn query_as<'q, O>(&'q self, template: &'q str) -> AppstoreQueryAs<'q, O>
    where
        O: for<'r> FromRow<'r, sqlx::sqlite::SqliteRow>
            + for<'r> FromRow<'r, sqlx::postgres::PgRow>
            + Send
            + Unpin,
    {
        let sql = self.adapt_sql(template);
        match &self.pool {
            AppstoreDbPool::Sqlite(_) => AppstoreQueryAs::Sqlite(sqlx::query_as(&sql)),
            AppstoreDbPool::Postgres(_) => AppstoreQueryAs::Postgres(sqlx::query_as(&sql)),
        }
    }

    pub fn query_scalar<'q, O>(&'q self, template: &'q str) -> AppstoreQueryScalar<'q, O>
    where
        O: Send + Unpin,
        for<'q2> O: sqlx::Decode<'q2, Sqlite> + sqlx::Type<Sqlite>,
        for<'q2> O: sqlx::Decode<'q2, Postgres> + sqlx::Type<Postgres>,
    {
        let sql = self.adapt_sql(template);
        match &self.pool {
            AppstoreDbPool::Sqlite(_) => AppstoreQueryScalar::Sqlite(sqlx::query_scalar(&sql)),
            AppstoreDbPool::Postgres(_) => AppstoreQueryScalar::Postgres(sqlx::query_scalar(&sql)),
        }
    }

    pub async fn begin(&self) -> sqlx::Result<AppstoreTransaction<'_>> {
        match &self.pool {
            AppstoreDbPool::Sqlite(pool) => {
                Ok(AppstoreTransaction::Sqlite(pool.begin().await?))
            }
            AppstoreDbPool::Postgres(pool) => {
                Ok(AppstoreTransaction::Postgres(pool.begin().await?))
            }
        }
    }
}

impl AppstoreTransaction<'_> {
    pub async fn commit(self) -> sqlx::Result<()> {
        match self {
            AppstoreTransaction::Sqlite(tx) => tx.commit().await,
            AppstoreTransaction::Postgres(tx) => tx.commit().await,
        }
    }
}

impl AppstoreQuery<'_> {
    pub fn bind<'v, T>(self, value: T) -> Self
    where
        T: 'v + Send + Encode<'v, Sqlite> + Encode<'v, Postgres> + Type<Sqlite> + Type<Postgres>,
    {
        match self {
            AppstoreQuery::Sqlite(query) => AppstoreQuery::Sqlite(query.bind(value)),
            AppstoreQuery::Postgres(query) => AppstoreQuery::Postgres(query.bind(value)),
        }
    }

    pub async fn execute_unified(self, db: &AppstoreSqlxDb) -> sqlx::Result<AppstoreExecuteResult> {
        match (self, &db.pool) {
            (AppstoreQuery::Sqlite(query), AppstoreDbPool::Sqlite(pool)) => {
                let result = query.execute(pool).await?;
                Ok(AppstoreExecuteResult {
                    rows_affected: result.rows_affected(),
                })
            }
            (AppstoreQuery::Postgres(query), AppstoreDbPool::Postgres(pool)) => {
                let result = query.execute(pool).await?;
                Ok(AppstoreExecuteResult {
                    rows_affected: result.rows_affected(),
                })
            }
            _ => Err(sqlx::Error::Configuration(
                "AppstoreQuery engine mismatch".into(),
            )),
        }
    }

    pub async fn execute_tx(self, tx: &mut AppstoreTransaction<'_>) -> sqlx::Result<AppstoreExecuteResult> {
        match (self, tx) {
            (AppstoreQuery::Sqlite(query), AppstoreTransaction::Sqlite(tx)) => {
                let result = query.execute(&mut **tx).await?;
                Ok(AppstoreExecuteResult {
                    rows_affected: result.rows_affected(),
                })
            }
            (AppstoreQuery::Postgres(query), AppstoreTransaction::Postgres(tx)) => {
                let result = query.execute(&mut **tx).await?;
                Ok(AppstoreExecuteResult {
                    rows_affected: result.rows_affected(),
                })
            }
            _ => Err(sqlx::Error::Configuration(
                "AppstoreQuery transaction engine mismatch".into(),
            )),
        }
    }
}

impl<'q, O> AppstoreQueryAs<'q, O>
where
    O: Send + Unpin + for<'r> FromRow<'r, sqlx::sqlite::SqliteRow> + for<'r> FromRow<'r, sqlx::postgres::PgRow>,
{
    pub fn bind<'v, T>(self, value: T) -> Self
    where
        T: 'v + Send + Encode<'v, Sqlite> + Encode<'v, Postgres> + Type<Sqlite> + Type<Postgres>,
    {
        match self {
            AppstoreQueryAs::Sqlite(query) => AppstoreQueryAs::Sqlite(query.bind(value)),
            AppstoreQueryAs::Postgres(query) => AppstoreQueryAs::Postgres(query.bind(value)),
        }
    }

    pub async fn fetch_optional(self, db: &AppstoreSqlxDb) -> sqlx::Result<Option<O>> {
        match (self, &db.pool) {
            (AppstoreQueryAs::Sqlite(query), AppstoreDbPool::Sqlite(pool)) => {
                query.fetch_optional(pool).await
            }
            (AppstoreQueryAs::Postgres(query), AppstoreDbPool::Postgres(pool)) => {
                query.fetch_optional(pool).await
            }
            _ => Err(sqlx::Error::Configuration(
                "AppstoreQueryAs engine mismatch".into(),
            )),
        }
    }

    pub async fn fetch_all(self, db: &AppstoreSqlxDb) -> sqlx::Result<Vec<O>> {
        match (self, &db.pool) {
            (AppstoreQueryAs::Sqlite(query), AppstoreDbPool::Sqlite(pool)) => {
                query.fetch_all(pool).await
            }
            (AppstoreQueryAs::Postgres(query), AppstoreDbPool::Postgres(pool)) => {
                query.fetch_all(pool).await
            }
            _ => Err(sqlx::Error::Configuration(
                "AppstoreQueryAs engine mismatch".into(),
            )),
        }
    }

    pub async fn fetch_one(self, db: &AppstoreSqlxDb) -> sqlx::Result<O> {
        match (self, &db.pool) {
            (AppstoreQueryAs::Sqlite(query), AppstoreDbPool::Sqlite(pool)) => {
                query.fetch_one(pool).await
            }
            (AppstoreQueryAs::Postgres(query), AppstoreDbPool::Postgres(pool)) => {
                query.fetch_one(pool).await
            }
            _ => Err(sqlx::Error::Configuration(
                "AppstoreQueryAs engine mismatch".into(),
            )),
        }
    }
}

impl<O> AppstoreQueryScalar<'_, O> {
    pub fn bind<T>(self, value: T) -> Self
    where
        T: 'static + Send + for<'q> Encode<'q, Sqlite> + for<'q> Encode<'q, Postgres> + Type<Sqlite> + Type<Postgres>,
    {
        match self {
            AppstoreQueryScalar::Sqlite(query) => AppstoreQueryScalar::Sqlite(query.bind(value)),
            AppstoreQueryScalar::Postgres(query) => AppstoreQueryScalar::Postgres(query.bind(value)),
        }
    }

    pub async fn fetch_one(self, db: &AppstoreSqlxDb) -> sqlx::Result<O> {
        match (self, &db.pool) {
            (AppstoreQueryScalar::Sqlite(query), AppstoreDbPool::Sqlite(pool)) => {
                query.fetch_one(pool).await
            }
            (AppstoreQueryScalar::Postgres(query), AppstoreDbPool::Postgres(pool)) => {
                query.fetch_one(pool).await
            }
            _ => Err(sqlx::Error::Configuration(
                "AppstoreQueryScalar engine mismatch".into(),
            )),
        }
    }
}

#[macro_export]
macro_rules! db_fetch_optional {
    ($db:expr, $ty:ty, $sql:expr $(, $bind:expr)* $(,)?) => {{
        $db.query_as::<$ty>($sql)
            $(.bind($bind))*
            .fetch_optional($db)
            .await
    }};
}

#[macro_export]
macro_rules! db_fetch_all {
    ($db:expr, $ty:ty, $sql:expr $(, $bind:expr)* $(,)?) => {{
        $db.query_as::<$ty>($sql)
            $(.bind($bind))*
            .fetch_all($db)
            .await
    }};
}

#[macro_export]
macro_rules! db_fetch_one {
    ($db:expr, $ty:ty, $sql:expr $(, $bind:expr)* $(,)?) => {{
        $db.query_as::<$ty>($sql)
            $(.bind($bind))*
            .fetch_one($db)
            .await
    }};
}

#[macro_export]
macro_rules! db_execute {
    ($db:expr, $sql:expr $(, $bind:expr)* $(,)?) => {{
        $db.query($sql)
            $(.bind($bind))*
            .execute_unified($db)
            .await
    }};
}

#[macro_export]
macro_rules! db_query_scalar {
    ($db:expr, $ty:ty, $sql:expr $(, $bind:expr)* $(,)?) => {{
        $db.query_scalar::<$ty>($sql)
            $(.bind($bind))*
            .fetch_one($db)
            .await
    }};
}
