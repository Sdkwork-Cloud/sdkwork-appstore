-- 009_user_demo_data.sql — demo user library, wishlist and listing ratings.

INSERT INTO appstore_user_library_item
    (id, tenant_id, user_id, listing_id, app_key, library_status, installed_release_id, installed_version_code, install_source, platform, architecture, device_id, last_checked_at, installed_at, updated_at, removed_at, created_at)
VALUES
    ('lib-1', '100001', '1', 'app-wechat', 'app-wechat', 'installed', 'rel-app-wechat-8020', '8020', 'storefront', 'pc', 'x64', 'dev-pc-001', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, NULL, CURRENT_TIMESTAMP::text),
    ('lib-2', '100001', '1', 'app-wps', 'app-wps', 'installed', 'rel-app-wps-1270', '1270', 'storefront', 'pc', 'x64', 'dev-pc-001', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, NULL, CURRENT_TIMESTAMP::text),
    ('lib-3', '100001', '1', 'app-qwen', 'app-qwen', 'installed', 'rel-app-qwen-310', '310', 'storefront', 'pc', 'x64', 'dev-pc-001', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, NULL, CURRENT_TIMESTAMP::text),
    ('lib-4', '100001', '1', 'app-deepseek', 'app-deepseek', 'installed', 'rel-app-deepseek-140', '140', 'storefront', 'pc', 'x64', 'dev-pc-001', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, NULL, CURRENT_TIMESTAMP::text),
    ('lib-5', '100001', '1', 'app-cursor', 'app-cursor', 'installed', 'rel-app-cursor-0410', '0410', 'storefront', 'pc', 'x64', 'dev-pc-001', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, NULL, CURRENT_TIMESTAMP::text),
    ('lib-6', '100001', '1', 'app-doubao', 'app-doubao', 'installed', 'rel-app-doubao-220', '220', 'storefront', 'pc', 'x64', 'dev-pc-001', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, NULL, CURRENT_TIMESTAMP::text),
    ('lib-7', '100001', '1', 'app-tencent-ima', 'app-tencent-ima', 'installed', 'rel-app-tencent-ima-250', '250', 'storefront', 'pc', 'x64', 'dev-pc-001', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, NULL, CURRENT_TIMESTAMP::text),
    ('lib-8', '100001', '1', 'game-doudizhu', 'game-doudizhu', 'installed', 'rel-game-doudizhu-810', '810', 'storefront', 'pc', 'x64', 'dev-pc-001', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, NULL, CURRENT_TIMESTAMP::text),
    ('lib-9', '100001', '1', 'app-midjourney', 'app-midjourney', 'installed', 'rel-app-midjourney-600', '600', 'storefront', 'pc', 'x64', 'dev-pc-001', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, NULL, CURRENT_TIMESTAMP::text),
    ('lib-10', '100001', '1', 'app-kimi', 'app-kimi', 'installed', 'rel-app-kimi-280', '280', 'storefront', 'pc', 'x64', 'dev-pc-001', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text, NULL, CURRENT_TIMESTAMP::text)
ON CONFLICT (id) DO NOTHING;

INSERT INTO appstore_user_wishlist_item
    (id, tenant_id, user_id, listing_id, wishlist_status, created_at, updated_at)
VALUES
    ('wish-1', '100001', '1', 'app-runway', 'active', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text),
    ('wish-2', '100001', '1', 'app-suno', 'active', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text),
    ('wish-3', '100001', '1', 'game-mobile-ys', 'active', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text),
    ('wish-4', '100001', '1', 'app-rag-knowledge', 'active', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text),
    ('wish-5', '100001', '1', 'app-manus', 'active', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text)
ON CONFLICT (id) DO NOTHING;

INSERT INTO appstore_listing_rating
    (id, tenant_id, organization_id, listing_id, user_id, rating, title, created_at, updated_at)
VALUES
    ('rating-1', '100001', '0', 'app-qwen', '1', 5, '非常好用的 AI 助手', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text),
    ('rating-2', '100001', '0', 'app-qwen', '3', 4, '界面清爽，回复质量高', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text),
    ('rating-3', '100001', '0', 'app-deepseek', '1', 5, '推理能力惊人', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text),
    ('rating-4', '100001', '0', 'app-deepseek', '5', 5, '数学推导超强', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text),
    ('rating-5', '100001', '0', 'app-cursor', '1', 5, '编程效率神器', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text),
    ('rating-6', '100001', '0', 'app-cursor', '7', 4, '偶尔会建议重复代码', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text),
    ('rating-7', '100001', '0', 'app-kimi', '1', 4, '长文本解析无敌', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text),
    ('rating-8', '100001', '0', 'app-tencent-ima', '9', 5, '知识库问答很实用', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text),
    ('rating-9', '100001', '0', 'app-midjourney', '1', 5, '出图质量天花板', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text),
    ('rating-10', '100001', '0', 'game-doudizhu', '11', 4, 'AI 陪练不错', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text),
    ('rating-11', '100001', '0', 'app-wps', '1', 4, '办公必备', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text),
    ('rating-12', '100001', '0', 'app-wechat', '13', 5, '国民应用', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text)
ON CONFLICT (id) DO NOTHING;
