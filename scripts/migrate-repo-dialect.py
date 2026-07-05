#!/usr/bin/env python3
"""Migrate repository-sqlx files from Pool<Sqlite> to AppstoreSqlxDb."""

import re
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parents[1] / "crates/sdkwork-appstore-repository-sqlx/src/repository"


def migrate_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    orig = text

    text = re.sub(
        r"use sqlx::\{Pool, Sqlite\};",
        "use crate::pool::AppstoreSqlxDb;",
        text,
    )

    text = text.replace("    pool: Pool<Sqlite>,", "    db: AppstoreSqlxDb,")

    text = re.sub(
        r"pub fn new\(pool: Pool<Sqlite>\) -> Self \{\s*Self \{ pool \}\s*\}",
        "pub fn new(db: AppstoreSqlxDb) -> Self {\n        Self { db }\n    }",
        text,
    )

    text = text.replace("sqlx::query_as::<_,", "self.db.query_as::<")
    text = text.replace("sqlx::query(", "self.db.query(")
    text = text.replace(".fetch_optional(&self.pool)", ".fetch_optional(&self.db)")
    text = text.replace(".fetch_all(&self.pool)", ".fetch_all(&self.db)")
    text = text.replace(".fetch_one(&self.pool)", ".fetch_one(&self.db)")
    text = text.replace(".execute(&self.pool)", ".execute_unified(&self.db)")

    text = text.replace("sqlx::query_as(&format!(", "PLACEHOLDER_FORMAT_QUERY_AS(")
    text = re.sub(
        r"sqlx::query_as\(",
        "self.db.query_as::<PLACEHOLDER_TUPLE>(",
        text,
    )
    text = text.replace("PLACEHOLDER_FORMAT_QUERY_AS(", "self.db.query_as::<ReleaseRow>(&self.db.adapt_sql(&format!(")
    # fix library - used ReleaseRow for format - need smarter fix

    # Add closing paren for adapt_sql wrapper before .bind on format queries
    lines = text.splitlines()
    out_lines = []
    for line in lines:
        if "adapt_sql(&format!(" in line and ")).bind" in line:
            line = line.replace(")).bind", "))).bind", 1)
        out_lines.append(line)
    text = "\n".join(out_lines)
    if orig.endswith("\n") and not text.endswith("\n"):
        text += "\n"

    if text != orig:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    for path in sorted(REPO_DIR.glob("*_repository.rs")):
        changed = migrate_file(path)
        print(f"{'updated' if changed else 'unchanged'}: {path.name}")


if __name__ == "__main__":
    main()
