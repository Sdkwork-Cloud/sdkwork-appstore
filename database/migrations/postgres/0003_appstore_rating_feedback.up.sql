-- 0003_appstore_rating_feedback.up.sql
-- Listing ratings (storefront star ratings + review title) and user feedback.

CREATE TABLE IF NOT EXISTS appstore_listing_rating (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT '0',
  listing_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL,
  title TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, listing_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_appstore_listing_rating_listing
  ON appstore_listing_rating (tenant_id, listing_id, created_at DESC);

CREATE TABLE IF NOT EXISTS appstore_feedback (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL DEFAULT '0',
  user_id TEXT,
  feedback_type TEXT NOT NULL,
  content TEXT NOT NULL,
  contact TEXT,
  listing_id TEXT,
  app_key TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_appstore_feedback_tenant
  ON appstore_feedback (tenant_id, status, created_at DESC);
