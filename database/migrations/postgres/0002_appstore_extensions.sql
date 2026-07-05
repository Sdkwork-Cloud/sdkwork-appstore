-- SDKWork App Store extension schema
-- Domain: appstore | Prefix: appstore_ | Compliance: L2 (selected L3 tables noted)
-- Extends 0001_appstore_foundation.sql with search, appeals, IAP, beta, and template tables

CREATE TABLE IF NOT EXISTS appstore_listing_iap_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  listing_id TEXT NOT NULL,
  iap_no TEXT NOT NULL,
  iap_type TEXT NOT NULL,
  sku TEXT NOT NULL,
  display_name TEXT NOT NULL,
  price_cents INTEGER NOT NULL DEFAULT 0,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  subscription_period TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, listing_id, iap_no),
  UNIQUE (tenant_id, listing_id, sku)
);

CREATE INDEX IF NOT EXISTS idx_appstore_listing_iap_item_listing
  ON appstore_listing_iap_item (tenant_id, listing_id, status);

CREATE TABLE IF NOT EXISTS appstore_catalog_search_history (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  query_text TEXT NOT NULL,
  filters_json TEXT NOT NULL DEFAULT '{}',
  result_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_appstore_catalog_search_history_user
  ON appstore_catalog_search_history (tenant_id, user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS appstore_catalog_trending_term (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  term TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  rank INTEGER NOT NULL,
  score REAL NOT NULL DEFAULT 0,
  snapshot_date TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, term, locale, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_appstore_catalog_trending_term_snapshot
  ON appstore_catalog_trending_term (tenant_id, snapshot_date, rank);

CREATE TABLE IF NOT EXISTS appstore_moderation_appeal (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  decision_id TEXT NOT NULL,
  review_id TEXT NOT NULL,
  appeal_no TEXT NOT NULL,
  appellant_user_id TEXT NOT NULL,
  appeal_reason TEXT NOT NULL,
  appeal_status TEXT NOT NULL DEFAULT 'pending',
  decided_by TEXT,
  decision_note TEXT,
  submitted_at TEXT NOT NULL,
  decided_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, appeal_no)
);

CREATE INDEX IF NOT EXISTS idx_appstore_moderation_appeal_status
  ON appstore_moderation_appeal (tenant_id, appeal_status, submitted_at);

CREATE INDEX IF NOT EXISTS idx_appstore_moderation_appeal_decision
  ON appstore_moderation_appeal (tenant_id, decision_id);

CREATE TABLE IF NOT EXISTS appstore_release_beta_invite (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  release_id TEXT NOT NULL,
  invitee_user_id TEXT,
  invitee_email TEXT,
  invite_status TEXT NOT NULL DEFAULT 'pending',
  invited_by TEXT NOT NULL,
  invited_at TEXT NOT NULL,
  accepted_at TEXT,
  revoked_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, release_id, invitee_email)
);

CREATE INDEX IF NOT EXISTS idx_appstore_release_beta_invite_release
  ON appstore_release_beta_invite (tenant_id, release_id, invite_status);

CREATE TABLE IF NOT EXISTS appstore_app_template (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  template_code TEXT NOT NULL,
  template_name TEXT NOT NULL,
  template_kind TEXT NOT NULL,
  description TEXT,
  publisher_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, template_code)
);

CREATE INDEX IF NOT EXISTS idx_appstore_app_template_status
  ON appstore_app_template (tenant_id, status, updated_at DESC);

CREATE TABLE IF NOT EXISTS appstore_app_template_usage (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  app_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  usage_context_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, app_id, template_id)
);

CREATE INDEX IF NOT EXISTS idx_appstore_app_template_usage_template
  ON appstore_app_template_usage (tenant_id, template_id);

CREATE TABLE IF NOT EXISTS appstore_app_template_version (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  version_label TEXT NOT NULL,
  manifest_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, template_id, version_label)
);

CREATE INDEX IF NOT EXISTS idx_appstore_app_template_version_template
  ON appstore_app_template_version (tenant_id, template_id, status);
