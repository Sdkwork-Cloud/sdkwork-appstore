-- 007_storefront_catalog.sql — editorial collections, featured slots, chart snapshots and trending terms (zh-CN).

INSERT INTO appstore_catalog_collection
    (id, tenant_id, collection_code, collection_type, collection_status, audience_scope, sort_order, cover_media_resource_id, starts_at, ends_at, created_at, updated_at)
VALUES
    ('col-1', '100001', 'weekly-ai-picks', 'editorial', 'published', 'public', 1, '', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('col-2', '100001', 'agent-coding', 'editorial', 'published', 'public', 2, '', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('col-3', '100001', 'creative-ai', 'editorial', 'published', 'public', 3, '', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('col-4', '100001', 'board-game-hall', 'thematic', 'published', 'public', 4, '', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO appstore_catalog_collection_localization
    (id, tenant_id, collection_id, locale, display_name, description, created_at, updated_at)
VALUES
    ('loc-col-1', '100001', 'col-1', 'zh-CN', '本期精选 - AI 生产力革命', '编辑部精选的 AI 生产力应用', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('loc-col-2', '100001', 'col-2', 'zh-CN', 'AI 编程与 Agent 神器 - 从编辑器到智能体', '全面提升研发效率的 AI 工具', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('loc-col-3', '100001', 'col-3', 'zh-CN', 'AI 创意与多媒体重构 - 灵感无限', 'AI 图像、音乐与视频创作', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('loc-col-4', '100001', 'col-4', 'zh-CN', '棋牌游戏大厅 - 经典棋牌一网打尽', '斗地主、麻将、象棋等经典棋牌', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO appstore_catalog_collection_item
    (id, tenant_id, collection_id, listing_id, sort_order, highlight_json, starts_at, ends_at, created_at)
VALUES
    ('ci-col-1-app-tencent-ima', '100001', 'col-1', 'app-tencent-ima', 1, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-1-app-notion-ai', '100001', 'col-1', 'app-notion-ai', 2, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-1-app-rag-knowledge', '100001', 'col-1', 'app-rag-knowledge', 3, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-1-app-qwen', '100001', 'col-1', 'app-qwen', 4, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-1-app-deepseek', '100001', 'col-1', 'app-deepseek', 5, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-1-app-wps', '100001', 'col-1', 'app-wps', 6, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-2-app-cursor', '100001', 'col-2', 'app-cursor', 1, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-2-app-v0', '100001', 'col-2', 'app-v0', 2, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-2-app-bolt', '100001', 'col-2', 'app-bolt', 3, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-2-app-manus', '100001', 'col-2', 'app-manus', 4, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-2-app-coze', '100001', 'col-2', 'app-coze', 5, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-2-app-code-playground', '100001', 'col-2', 'app-code-playground', 6, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-3-app-midjourney', '100001', 'col-3', 'app-midjourney', 1, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-3-app-suno', '100001', 'col-3', 'app-suno', 2, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-3-app-runway', '100001', 'col-3', 'app-runway', 3, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-3-app-elevenlabs', '100001', 'col-3', 'app-elevenlabs', 4, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-3-app-comfyui', '100001', 'col-3', 'app-comfyui', 5, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-3-app-flux', '100001', 'col-3', 'app-flux', 6, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-4-game-doudizhu', '100001', 'col-4', 'game-doudizhu', 1, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-4-game-mahjong', '100001', 'col-4', 'game-mahjong', 2, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-4-game-xiangqi', '100001', 'col-4', 'game-xiangqi', 3, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-4-game-guandan', '100001', 'col-4', 'game-guandan', 4, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-4-game-gomoku', '100001', 'col-4', 'game-gomoku', 5, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP),
    ('ci-col-4-game-junqi', '100001', 'col-4', 'game-junqi', 6, '{}', CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO appstore_catalog_featured_slot
    (id, tenant_id, slot_code, listing_id, slot_status, audience_scope, platform_scope, region_scope_json, starts_at, ends_at, created_at, updated_at)
VALUES
    ('slot-home-hero', '100001', 'slot-home-hero', 'app-tencent-ima', 'active', 'public', 'ALL', '[]', CURRENT_TIMESTAMP, (CURRENT_TIMESTAMP + INTERVAL '90 days'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('slot-home-ai-coding', '100001', 'slot-home-ai-coding', 'app-cursor', 'active', 'public', 'ALL', '[]', CURRENT_TIMESTAMP, (CURRENT_TIMESTAMP + INTERVAL '90 days'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('slot-home-creative', '100001', 'slot-home-creative', 'app-midjourney', 'active', 'public', 'ALL', '[]', CURRENT_TIMESTAMP, (CURRENT_TIMESTAMP + INTERVAL '90 days'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO appstore_catalog_chart_snapshot
    (id, tenant_id, chart_code, snapshot_date, locale, platform_scope, ranking_json, generated_at, created_at)
VALUES
    ('chart-top-20260803', '100001', 'top', '2026-08-03', 'zh-CN', 'ALL', '[{"rank": 1, "listingId": "app-deepseek", "metricKind": "installs", "metricValue": 100000}, {"rank": 2, "listingId": "app-qwen", "metricKind": "installs", "metricValue": 97000}, {"rank": 3, "listingId": "app-wechat", "metricKind": "installs", "metricValue": 94000}, {"rank": 4, "listingId": "app-wps", "metricKind": "installs", "metricValue": 91000}, {"rank": 5, "listingId": "app-kimi", "metricKind": "installs", "metricValue": 88000}, {"rank": 6, "listingId": "app-cursor", "metricKind": "installs", "metricValue": 85000}, {"rank": 7, "listingId": "app-doubao", "metricKind": "installs", "metricValue": 82000}, {"rank": 8, "listingId": "app-tencent-ima", "metricKind": "installs", "metricValue": 79000}, {"rank": 9, "listingId": "app-claude", "metricKind": "installs", "metricValue": 76000}, {"rank": 10, "listingId": "app-midjourney", "metricKind": "installs", "metricValue": 73000}, {"rank": 11, "listingId": "app-perplexity", "metricKind": "installs", "metricValue": 70000}, {"rank": 12, "listingId": "app-notion-ai", "metricKind": "installs", "metricValue": 67000}, {"rank": 13, "listingId": "app-suno", "metricKind": "installs", "metricValue": 64000}, {"rank": 14, "listingId": "app-douyin", "metricKind": "installs", "metricValue": 61000}, {"rank": 15, "listingId": "app-baidunetdisk", "metricKind": "installs", "metricValue": 58000}, {"rank": 16, "listingId": "app-manus", "metricKind": "installs", "metricValue": 55000}, {"rank": 17, "listingId": "app-v0", "metricKind": "installs", "metricValue": 52000}, {"rank": 18, "listingId": "app-coze", "metricKind": "installs", "metricValue": 49000}, {"rank": 19, "listingId": "app-bolt", "metricKind": "installs", "metricValue": 46000}, {"rank": 20, "listingId": "app-agent-workspace", "metricKind": "installs", "metricValue": 43000}]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('chart-free-20260803', '100001', 'free', '2026-08-03', 'zh-CN', 'ALL', '[{"rank": 1, "listingId": "app-wechat", "metricKind": "installs", "metricValue": 100000}, {"rank": 2, "listingId": "app-wps", "metricKind": "installs", "metricValue": 97000}, {"rank": 3, "listingId": "app-douyin", "metricKind": "installs", "metricValue": 94000}, {"rank": 4, "listingId": "app-qwen", "metricKind": "installs", "metricValue": 91000}, {"rank": 5, "listingId": "app-deepseek", "metricKind": "installs", "metricValue": 88000}, {"rank": 6, "listingId": "app-kimi", "metricKind": "installs", "metricValue": 85000}, {"rank": 7, "listingId": "app-doubao", "metricKind": "installs", "metricValue": 82000}, {"rank": 8, "listingId": "app-tencent-ima", "metricKind": "installs", "metricValue": 79000}, {"rank": 9, "listingId": "app-baidunetdisk", "metricKind": "installs", "metricValue": 76000}, {"rank": 10, "listingId": "app-perplexity", "metricKind": "installs", "metricValue": 73000}, {"rank": 11, "listingId": "app-claude", "metricKind": "installs", "metricValue": 70000}, {"rank": 12, "listingId": "app-notion-ai", "metricKind": "installs", "metricValue": 67000}, {"rank": 13, "listingId": "app-code-playground", "metricKind": "installs", "metricValue": 64000}, {"rank": 14, "listingId": "app-comfyui", "metricKind": "installs", "metricValue": 61000}, {"rank": 15, "listingId": "app-saas-starter", "metricKind": "installs", "metricValue": 58000}, {"rank": 16, "listingId": "app-agent-workspace", "metricKind": "installs", "metricValue": 55000}, {"rank": 17, "listingId": "app-bolt", "metricKind": "installs", "metricValue": 52000}, {"rank": 18, "listingId": "app-v0", "metricKind": "installs", "metricValue": 49000}, {"rank": 19, "listingId": "app-coze", "metricKind": "installs", "metricValue": 46000}, {"rank": 20, "listingId": "app-manus", "metricKind": "installs", "metricValue": 43000}]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('chart-paid-20260803', '100001', 'paid', '2026-08-03', 'zh-CN', 'ALL', '[{"rank": 1, "listingId": "app-midjourney", "metricKind": "installs", "metricValue": 100000}, {"rank": 2, "listingId": "app-runway", "metricKind": "installs", "metricValue": 97000}, {"rank": 3, "listingId": "app-rag-knowledge", "metricKind": "installs", "metricValue": 94000}, {"rank": 4, "listingId": "game-mobile-mc", "metricKind": "installs", "metricValue": 91000}, {"rank": 5, "listingId": "app-suno", "metricKind": "installs", "metricValue": 88000}]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO appstore_catalog_chart_snapshot
    (id, tenant_id, chart_code, snapshot_date, locale, platform_scope, ranking_json, generated_at, created_at)
VALUES
    ('chart-top-20260803-en', '100001', 'top', '2026-08-03', 'en-US', 'ALL', '[{"rank": 1, "listingId": "app-deepseek", "metricKind": "installs", "metricValue": 100000}, {"rank": 2, "listingId": "app-qwen", "metricKind": "installs", "metricValue": 97000}, {"rank": 3, "listingId": "app-wechat", "metricKind": "installs", "metricValue": 94000}, {"rank": 4, "listingId": "app-wps", "metricKind": "installs", "metricValue": 91000}, {"rank": 5, "listingId": "app-kimi", "metricKind": "installs", "metricValue": 88000}, {"rank": 6, "listingId": "app-cursor", "metricKind": "installs", "metricValue": 85000}, {"rank": 7, "listingId": "app-doubao", "metricKind": "installs", "metricValue": 82000}, {"rank": 8, "listingId": "app-tencent-ima", "metricKind": "installs", "metricValue": 79000}, {"rank": 9, "listingId": "app-claude", "metricKind": "installs", "metricValue": 76000}, {"rank": 10, "listingId": "app-midjourney", "metricKind": "installs", "metricValue": 73000}, {"rank": 11, "listingId": "app-perplexity", "metricKind": "installs", "metricValue": 70000}, {"rank": 12, "listingId": "app-notion-ai", "metricKind": "installs", "metricValue": 67000}, {"rank": 13, "listingId": "app-suno", "metricKind": "installs", "metricValue": 64000}, {"rank": 14, "listingId": "app-douyin", "metricKind": "installs", "metricValue": 61000}, {"rank": 15, "listingId": "app-baidunetdisk", "metricKind": "installs", "metricValue": 58000}, {"rank": 16, "listingId": "app-manus", "metricKind": "installs", "metricValue": 55000}, {"rank": 17, "listingId": "app-v0", "metricKind": "installs", "metricValue": 52000}, {"rank": 18, "listingId": "app-coze", "metricKind": "installs", "metricValue": 49000}, {"rank": 19, "listingId": "app-bolt", "metricKind": "installs", "metricValue": 46000}, {"rank": 20, "listingId": "app-agent-workspace", "metricKind": "installs", "metricValue": 43000}]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('chart-free-20260803-en', '100001', 'free', '2026-08-03', 'en-US', 'ALL', '[{"rank": 1, "listingId": "app-wechat", "metricKind": "installs", "metricValue": 100000}, {"rank": 2, "listingId": "app-wps", "metricKind": "installs", "metricValue": 97000}, {"rank": 3, "listingId": "app-douyin", "metricKind": "installs", "metricValue": 94000}, {"rank": 4, "listingId": "app-qwen", "metricKind": "installs", "metricValue": 91000}, {"rank": 5, "listingId": "app-deepseek", "metricKind": "installs", "metricValue": 88000}, {"rank": 6, "listingId": "app-kimi", "metricKind": "installs", "metricValue": 85000}, {"rank": 7, "listingId": "app-doubao", "metricKind": "installs", "metricValue": 82000}, {"rank": 8, "listingId": "app-tencent-ima", "metricKind": "installs", "metricValue": 79000}, {"rank": 9, "listingId": "app-baidunetdisk", "metricKind": "installs", "metricValue": 76000}, {"rank": 10, "listingId": "app-perplexity", "metricKind": "installs", "metricValue": 73000}, {"rank": 11, "listingId": "app-claude", "metricKind": "installs", "metricValue": 70000}, {"rank": 12, "listingId": "app-notion-ai", "metricKind": "installs", "metricValue": 67000}, {"rank": 13, "listingId": "app-code-playground", "metricKind": "installs", "metricValue": 64000}, {"rank": 14, "listingId": "app-comfyui", "metricKind": "installs", "metricValue": 61000}, {"rank": 15, "listingId": "app-saas-starter", "metricKind": "installs", "metricValue": 58000}, {"rank": 16, "listingId": "app-agent-workspace", "metricKind": "installs", "metricValue": 55000}, {"rank": 17, "listingId": "app-bolt", "metricKind": "installs", "metricValue": 52000}, {"rank": 18, "listingId": "app-v0", "metricKind": "installs", "metricValue": 49000}, {"rank": 19, "listingId": "app-coze", "metricKind": "installs", "metricValue": 46000}, {"rank": 20, "listingId": "app-manus", "metricKind": "installs", "metricValue": 43000}]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('chart-paid-20260803-en', '100001', 'paid', '2026-08-03', 'en-US', 'ALL', '[{"rank": 1, "listingId": "app-midjourney", "metricKind": "installs", "metricValue": 100000}, {"rank": 2, "listingId": "app-runway", "metricKind": "installs", "metricValue": 97000}, {"rank": 3, "listingId": "app-rag-knowledge", "metricKind": "installs", "metricValue": 94000}, {"rank": 4, "listingId": "game-mobile-mc", "metricKind": "installs", "metricValue": 91000}, {"rank": 5, "listingId": "app-suno", "metricKind": "installs", "metricValue": 88000}]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO appstore_catalog_trending_term
    (id, tenant_id, term, locale, rank, score, snapshot_date, created_at, updated_at)
VALUES
    ('trend-1', '100001', 'DeepSeek R1', 'zh-CN', 1, 100.0, '2026-08-03', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('trend-2', '100001', '千问 AI', 'zh-CN', 2, 94.5, '2026-08-03', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('trend-3', '100001', 'Cursor AI', 'zh-CN', 3, 89.0, '2026-08-03', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('trend-4', '100001', 'Kimi 智能助手', 'zh-CN', 4, 83.5, '2026-08-03', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('trend-5', '100001', 'Midjourney', 'zh-CN', 5, 78.0, '2026-08-03', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('trend-6', '100001', 'Suno AI', 'zh-CN', 6, 72.5, '2026-08-03', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('trend-7', '100001', 'Manus Agent', 'zh-CN', 7, 67.0, '2026-08-03', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('trend-8', '100001', '腾讯 ima', 'zh-CN', 8, 61.5, '2026-08-03', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('trend-9', '100001', 'Notion AI', 'zh-CN', 9, 56.0, '2026-08-03', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('trend-10', '100001', 'ComfyUI', 'zh-CN', 10, 50.5, '2026-08-03', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
