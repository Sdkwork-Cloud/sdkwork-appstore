-- Default storefront categories for tenant 100001 (zh-CN localizations).
INSERT INTO appstore_category
    (id, tenant_id, category_code, parent_category_id, category_level, category_status, sort_order, created_at, updated_at)
VALUES
    ('appstore-category-apps', '100001', 'apps', NULL, 1, 'active', 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('appstore-category-games', '100001', 'games', NULL, 1, 'active', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('appstore-category-tools', '100001', 'tools', NULL, 1, 'active', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('appstore-category-productivity', '100001', 'productivity', NULL, 1, 'active', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('appstore-category-education', '100001', 'education', NULL, 1, 'active', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('appstore-category-entertainment', '100001', 'entertainment', NULL, 1, 'active', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    category_status = EXCLUDED.category_status,
    sort_order = EXCLUDED.sort_order,
    updated_at = EXCLUDED.updated_at;

INSERT INTO appstore_category_localization
    (id, tenant_id, category_id, locale, display_name, description, created_at, updated_at)
VALUES
    ('appstore-category-apps-zh', '100001', 'appstore-category-apps', 'zh-CN', '应用', '通用应用与工具', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('appstore-category-games-zh', '100001', 'appstore-category-games', 'zh-CN', '游戏', '休闲与竞技游戏', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('appstore-category-tools-zh', '100001', 'appstore-category-tools', 'zh-CN', '工具', '效率与实用工具', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('appstore-category-productivity-zh', '100001', 'appstore-category-productivity', 'zh-CN', '效率', '办公与生产力', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('appstore-category-education-zh', '100001', 'appstore-category-education', 'zh-CN', '教育', '学习与教育类应用', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('appstore-category-entertainment-zh', '100001', 'appstore-category-entertainment', 'zh-CN', '娱乐', '影音与娱乐内容', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    updated_at = EXCLUDED.updated_at;
