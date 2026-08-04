//! SQL placeholder adaptation for SQLite (`?`) and PostgreSQL (`$n`).
//!
//! The `?jsonb` marker binds a text value into a JSONB column: PostgreSQL
//! rewrites it to `$n::jsonb`, SQLite keeps the plain `?` placeholder.

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
        AppstoreSqlDialect::Sqlite => adapt_sql_sqlite(template),
        AppstoreSqlDialect::Postgres => adapt_sql_postgres(template),
    }
}

fn adapt_sql_sqlite(template: &str) -> String {
    let mut out = String::with_capacity(template.len());
    let mut rest = template;
    while let Some(offset) = rest.find('?') {
        out.push_str(&rest[..offset]);
        rest = &rest[offset..];
        if rest.starts_with("?jsonb") && is_identifier_boundary(rest.as_bytes().get(6)) {
            out.push('?');
            rest = &rest[6..];
        } else {
            out.push('?');
            rest = &rest[1..];
        }
    }
    out.push_str(rest);
    out
}

fn adapt_sql_postgres(template: &str) -> String {
    let mut out = String::with_capacity(template.len());
    let mut index = 1usize;
    let mut rest = template;
    while let Some(offset) = rest.find('?') {
        out.push_str(&rest[..offset]);
        rest = &rest[offset..];
        if rest.starts_with("?jsonb") && is_identifier_boundary(rest.as_bytes().get(6)) {
            out.push('$');
            out.push_str(&index.to_string());
            out.push_str("::jsonb");
            rest = &rest[6..];
        } else {
            out.push('$');
            out.push_str(&index.to_string());
            rest = &rest[1..];
        }
        index += 1;
    }
    out.push_str(rest);
    out
}

fn is_identifier_boundary(next: Option<&u8>) -> bool {
    match next {
        None => true,
        Some(byte) => !byte.is_ascii_alphanumeric() && *byte != b'_',
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn adapt_sql_sqlite_passthrough() {
        assert_eq!(
            adapt_sql(
                "SELECT * FROM appstore_listing WHERE id = ?",
                AppstoreSqlDialect::Sqlite
            ),
            "SELECT * FROM appstore_listing WHERE id = ?",
        );
    }

    #[test]
    fn adapt_sql_postgres_rewrites_placeholders() {
        assert_eq!(
            adapt_sql(
                "SELECT * FROM appstore_listing WHERE id = ? AND slug = ?",
                AppstoreSqlDialect::Postgres,
            ),
            "SELECT * FROM appstore_listing WHERE id = $1 AND slug = $2",
        );
    }

    #[test]
    fn adapt_sql_sqlite_keeps_jsonb_marker_plain() {
        assert_eq!(
            adapt_sql(
                "INSERT INTO t (metadata) VALUES (?jsonb)",
                AppstoreSqlDialect::Sqlite,
            ),
            "INSERT INTO t (metadata) VALUES (?)",
        );
    }

    #[test]
    fn adapt_sql_postgres_casts_jsonb_marker() {
        assert_eq!(
            adapt_sql(
                "INSERT INTO t (id, metadata) VALUES (?, ?jsonb)",
                AppstoreSqlDialect::Postgres,
            ),
            "INSERT INTO t (id, metadata) VALUES ($1, $2::jsonb)",
        );
    }

    #[test]
    fn dialect_from_url() {
        assert_eq!(
            AppstoreSqlDialect::from_database_url("postgresql://localhost/appstore"),
            AppstoreSqlDialect::Postgres,
        );
        assert_eq!(
            AppstoreSqlDialect::from_database_url("sqlite://./appstore.db"),
            AppstoreSqlDialect::Sqlite,
        );
    }
}
