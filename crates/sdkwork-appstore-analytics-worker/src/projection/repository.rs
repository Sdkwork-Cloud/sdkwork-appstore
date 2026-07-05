use chrono::{DateTime, NaiveDate, Utc};
use serde_json::json;
use sqlx::{Pool, Sqlite};
use uuid::Uuid;

#[derive(Debug, Clone)]
pub struct AnalyticsProjectionRepository {
    pool: Pool<Sqlite>,
}

impl AnalyticsProjectionRepository {
    pub fn new(pool: Pool<Sqlite>) -> Self {
        Self { pool }
    }

    /// Aggregates install events into daily listing metric snapshots.
    pub async fn project_listing_metrics(
        &self,
        tenant_id: &str,
        snapshot_date: NaiveDate,
    ) -> Result<u64, String> {
        let date_str = snapshot_date.format("%Y-%m-%d").to_string();
        let now = Utc::now().to_rfc3339();

        let rows = sqlx::query_as::<_, (String, i64, i64, i64)>(
            r#"
            SELECT
              listing_id,
              SUM(CASE WHEN event_type = 'install' THEN 1 ELSE 0 END) AS install_count,
              SUM(CASE WHEN event_type = 'uninstall' THEN 1 ELSE 0 END) AS uninstall_count,
              SUM(CASE WHEN event_type = 'update' THEN 1 ELSE 0 END) AS update_count
            FROM appstore_install_event
            WHERE tenant_id = ?
              AND date(occurred_at) = ?
            GROUP BY listing_id
            "#,
        )
        .bind(tenant_id)
        .bind(&date_str)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| format!("aggregate install events failed: {e}"))?;

        let mut written = 0u64;
        for (listing_id, install_count, uninstall_count, update_count) in rows {
            let id = Uuid::new_v4().to_string();
            sqlx::query(
                r#"
                INSERT INTO appstore_listing_metric_snapshot (
                  id, tenant_id, listing_id, snapshot_date,
                  impression_count, detail_view_count, install_count,
                  uninstall_count, update_count, conversion_rate, created_at
                ) VALUES (?, ?, ?, ?, 0, 0, ?, ?, ?, NULL, ?)
                ON CONFLICT(tenant_id, listing_id, snapshot_date) DO UPDATE SET
                  install_count = excluded.install_count,
                  uninstall_count = excluded.uninstall_count,
                  update_count = excluded.update_count,
                  created_at = excluded.created_at
                "#,
            )
            .bind(&id)
            .bind(tenant_id)
            .bind(&listing_id)
            .bind(&date_str)
            .bind(install_count)
            .bind(uninstall_count)
            .bind(update_count)
            .bind(&now)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("upsert listing metric snapshot failed: {e}"))?;
            written += 1;
        }
        Ok(written)
    }

    /// Builds chart ranking JSON from metric snapshots for the given date.
    pub async fn project_chart_snapshot(
        &self,
        tenant_id: &str,
        chart_code: &str,
        snapshot_date: NaiveDate,
        locale: &str,
        platform_scope: &str,
        limit: i32,
    ) -> Result<(), String> {
        let date_str = snapshot_date.format("%Y-%m-%d").to_string();
        let now = Utc::now();
        let now_str = now.to_rfc3339();

        let rows = sqlx::query_as::<_, (String, i64)>(
            r#"
            SELECT listing_id, install_count
            FROM appstore_listing_metric_snapshot
            WHERE tenant_id = ? AND snapshot_date = ?
            ORDER BY install_count DESC, listing_id ASC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(&date_str)
        .bind(limit)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| format!("load metric snapshots for chart failed: {e}"))?;

        let ranking: Vec<serde_json::Value> = rows
            .into_iter()
            .enumerate()
            .map(|(index, (listing_id, metric_value))| {
                json!({
                    "rank": index + 1,
                    "listingId": listing_id,
                    "metricKind": "installs",
                    "metricValue": metric_value,
                })
            })
            .collect();

        let id = Uuid::new_v4().to_string();
        let ranking_json = serde_json::to_string(&ranking)
            .map_err(|e| format!("serialize ranking_json failed: {e}"))?;

        sqlx::query(
            r#"
            INSERT INTO appstore_catalog_chart_snapshot (
              id, tenant_id, chart_code, snapshot_date, locale, platform_scope,
              ranking_json, generated_at, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(tenant_id, chart_code, snapshot_date, locale, platform_scope) DO UPDATE SET
              ranking_json = excluded.ranking_json,
              generated_at = excluded.generated_at
            "#,
        )
        .bind(&id)
        .bind(tenant_id)
        .bind(chart_code)
        .bind(&date_str)
        .bind(locale)
        .bind(platform_scope)
        .bind(&ranking_json)
        .bind(now_str.clone())
        .bind(&now_str)
        .execute(&self.pool)
        .await
        .map_err(|e| format!("upsert chart snapshot failed: {e}"))?;

        Ok(())
    }

    /// Aggregates search history into trending term snapshots.
    pub async fn project_trending_terms(
        &self,
        tenant_id: &str,
        snapshot_date: NaiveDate,
        locale: &str,
        lookback_days: i64,
        limit: i32,
    ) -> Result<u64, String> {
        let date_str = snapshot_date.format("%Y-%m-%d").to_string();
        let since: DateTime<Utc> = snapshot_date
            .and_hms_opt(0, 0, 0)
            .map(|dt| DateTime::<Utc>::from_naive_utc_and_offset(dt, Utc))
            .unwrap_or_else(Utc::now)
            - chrono::Duration::days(lookback_days);
        let since_str = since.to_rfc3339();
        let now = Utc::now().to_rfc3339();

        let rows = sqlx::query_as::<_, (String, i64)>(
            r#"
            SELECT query_text, COUNT(*) AS search_count
            FROM appstore_catalog_search_history
            WHERE tenant_id = ? AND created_at >= ?
            GROUP BY query_text
            ORDER BY search_count DESC, query_text ASC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(&since_str)
        .bind(limit)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| format!("aggregate search history failed: {e}"))?;

        sqlx::query(
            r#"
            DELETE FROM appstore_catalog_trending_term
            WHERE tenant_id = ? AND snapshot_date = ? AND locale = ?
            "#,
        )
        .bind(tenant_id)
        .bind(&date_str)
        .bind(locale)
        .execute(&self.pool)
        .await
        .map_err(|e| format!("clear prior trending snapshot failed: {e}"))?;

        let mut written = 0u64;
        for (rank, (term, search_count)) in rows.into_iter().enumerate() {
            let id = Uuid::new_v4().to_string();
            let rank_i32 = (rank + 1) as i32;
            let score = search_count as f64;
            sqlx::query(
                r#"
                INSERT INTO appstore_catalog_trending_term (
                  id, tenant_id, term, locale, rank, score, snapshot_date, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                "#,
            )
            .bind(&id)
            .bind(tenant_id)
            .bind(&term)
            .bind(locale)
            .bind(rank_i32)
            .bind(score)
            .bind(&date_str)
            .bind(&now)
            .bind(&now)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("insert trending term failed: {e}"))?;
            written += 1;
        }
        Ok(written)
    }
}
