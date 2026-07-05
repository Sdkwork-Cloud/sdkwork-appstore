//! SQL placeholder adaptation for SQLite (`?`) and PostgreSQL (`$n`).

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AppstoreSqlDialect {
    Sqlite,
    Postgres,
}

impl AppstoreSqlDialect {
    pub fn from_database_url(url: &str) -> Self {
        if url.starts_with("postgres://") || url.starts_with("postgresql://") {
            Self::Postgres
        } else {
            Self::Sqlite
        }
    }
}

/// Rewrites `?` placeholders to `$1`, `$2`, … for PostgreSQL; leaves SQLite SQL unchanged.
pub fn adapt_sql(template: &str, dialect: AppstoreSqlDialect) -> String {
    match dialect {
        AppstoreSqlDialect::Sqlite => template.to_string(),
        AppstoreSqlDialect::Postgres => {
            let mut out = String::with_capacity(template.len());
            let mut index = 1usize;
            for ch in template.chars() {
                if ch == '?' {
                    out.push('$');
                    out.push_str(&index.to_string());
                    index += 1;
                } else {
                    out.push(ch);
                }
            }
            out
        }
    }
}
