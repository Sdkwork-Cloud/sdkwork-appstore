-- 006_storefront_releases.sql — storefront release channels, releases and zh-CN release notes.

INSERT INTO appstore_release_channel
    (id, tenant_id, channel_code, channel_type, channel_status, audience_scope, created_at, updated_at)
VALUES
    ('ch-prod', '100001', 'production', 'stable', 'active', 'public', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO appstore_release
    (id, tenant_id, organization_id, listing_id, release_no, channel_id, version_name, version_code, build_number, release_status, minimum_os_version, release_notes_default_locale, manifest_snapshot_json, submitted_at, approved_at, published_at, created_at, updated_at)
VALUES
    ('rel-app-qwen-320', '100001', '0', 'app-qwen', 'R-app-qwen-320', 'ch-prod', '3.2.0', '320', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-deepseek-150', '100001', '0', 'app-deepseek', 'R-app-deepseek-150', 'ch-prod', '1.5.0', '150', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-kimi-281', '100001', '0', 'app-kimi', 'R-app-kimi-281', 'ch-prod', '2.8.1', '281', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-cursor-0420', '100001', '0', 'app-cursor', 'R-app-cursor-0420', 'ch-prod', '0.42.0', '0420', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-tencent-ima-260', '100001', '0', 'app-tencent-ima', 'R-app-tencent-ima-260', 'ch-prod', '2.6.0', '260', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-midjourney-610', '100001', '0', 'app-midjourney', 'R-app-midjourney-610', 'ch-prod', '6.1.0', '610', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-doubao-230', '100001', '0', 'app-doubao', 'R-app-doubao-230', 'ch-prod', '2.3.0', '230', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-perplexity-461', '100001', '0', 'app-perplexity', 'R-app-perplexity-461', 'ch-prod', '4.6.1', '461', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-suno-400', '100001', '0', 'app-suno', 'R-app-suno-400', 'ch-prod', '4.0.0', '400', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-v0-240', '100001', '0', 'app-v0', 'R-app-v0-240', 'ch-prod', '2.4.0', '240', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-bolt-310', '100001', '0', 'app-bolt', 'R-app-bolt-310', 'ch-prod', '3.1.0', '310', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-manus-200', '100001', '0', 'app-manus', 'R-app-manus-200', 'ch-prod', '2.0.0', '200', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-coze-350', '100001', '0', 'app-coze', 'R-app-coze-350', 'ch-prod', '3.5.0', '350', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-code-playground-182', '100001', '0', 'app-code-playground', 'R-app-code-playground-182', 'ch-prod', '1.8.2', '182', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-runway-370', '100001', '0', 'app-runway', 'R-app-runway-370', 'ch-prod', '3.7.0', '370', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-elevenlabs-290', '100001', '0', 'app-elevenlabs', 'R-app-elevenlabs-290', 'ch-prod', '2.9.0', '290', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-comfyui-035', '100001', '0', 'app-comfyui', 'R-app-comfyui-035', 'ch-prod', '0.3.5', '035', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-flux-120', '100001', '0', 'app-flux', 'R-app-flux-120', 'ch-prod', '1.2.0', '120', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-notion-ai-390', '100001', '0', 'app-notion-ai', 'R-app-notion-ai-390', 'ch-prod', '3.9.0', '390', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-rag-knowledge-210', '100001', '0', 'app-rag-knowledge', 'R-app-rag-knowledge-210', 'ch-prod', '2.1.0', '210', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-saas-starter-140', '100001', '0', 'app-saas-starter', 'R-app-saas-starter-140', 'ch-prod', '1.4.0', '140', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-agent-workspace-220', '100001', '0', 'app-agent-workspace', 'R-app-agent-workspace-220', 'ch-prod', '2.2.0', '220', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-claude-190', '100001', '0', 'app-claude', 'R-app-claude-190', 'ch-prod', '1.9.0', '190', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-ai-arena-190', '100001', '0', 'game-ai-arena', 'R-game-ai-arena-190', 'ch-prod', '1.9.0', '190', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-ai-story-200', '100001', '0', 'game-ai-story', 'R-game-ai-story-200', 'ch-prod', '2.0.0', '200', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-ai-pet-330', '100001', '0', 'game-ai-pet', 'R-game-ai-pet-330', 'ch-prod', '3.3.0', '330', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-ai-chess-170', '100001', '0', 'game-ai-chess', 'R-game-ai-chess-170', 'ch-prod', '1.7.0', '170', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-ai-dungeon-250', '100001', '0', 'game-ai-dungeon', 'R-game-ai-dungeon-250', 'ch-prod', '2.5.0', '250', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-ai-rpg-160', '100001', '0', 'game-ai-rpg', 'R-game-ai-rpg-160', 'ch-prod', '1.6.0', '160', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-doudizhu-820', '100001', '0', 'game-doudizhu', 'R-game-doudizhu-820', 'ch-prod', '8.2.0', '820', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-xiangqi-510', '100001', '0', 'game-xiangqi', 'R-game-xiangqi-510', 'ch-prod', '5.1.0', '510', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-mahjong-740', '100001', '0', 'game-mahjong', 'R-game-mahjong-740', 'ch-prod', '7.4.0', '740', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-gomoku-300', '100001', '0', 'game-gomoku', 'R-game-gomoku-300', 'ch-prod', '3.0.0', '300', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-junqi-420', '100001', '0', 'game-junqi', 'R-game-junqi-420', 'ch-prod', '4.2.0', '420', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-guandan-600', '100001', '0', 'game-guandan', 'R-game-guandan-600', 'ch-prod', '6.0.0', '600', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-mini-jump-240', '100001', '0', 'game-mini-jump', 'R-game-mini-jump-240', 'ch-prod', '2.4.0', '240', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-mini-2048-190', '100001', '0', 'game-mini-2048', 'R-game-mini-2048-190', 'ch-prod', '1.9.0', '190', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-mini-fruit-210', '100001', '0', 'game-mini-fruit', 'R-game-mini-fruit-210', 'ch-prod', '2.1.0', '210', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-mini-bird-150', '100001', '0', 'game-mini-bird', 'R-game-mini-bird-150', 'ch-prod', '1.5.0', '150', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-mobile-mc-1205', '100001', '0', 'game-mobile-mc', 'R-game-mobile-mc-1205', 'ch-prod', '1.20.5', '1205', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-mobile-ys-470', '100001', '0', 'game-mobile-ys', 'R-game-mobile-ys-470', 'ch-prod', '4.7.0', '470', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-mobile-honor-860', '100001', '0', 'game-mobile-honor', 'R-game-mobile-honor-860', 'ch-prod', '8.6.0', '860', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-game-mobile-cf-790', '100001', '0', 'game-mobile-cf', 'R-game-mobile-cf-790', 'ch-prod', '7.9.0', '790', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-wps-1280', '100001', '0', 'app-wps', 'R-app-wps-1280', 'ch-prod', '12.8.0', '1280', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-baidunetdisk-1120', '100001', '0', 'app-baidunetdisk', 'R-app-baidunetdisk-1120', 'ch-prod', '11.2.0', '1120', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-wechat-8030', '100001', '0', 'app-wechat', 'R-app-wechat-8030', 'ch-prod', '8.0.30', '8030', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('rel-app-douyin-2760', '100001', '0', 'app-douyin', 'R-app-douyin-2760', 'ch-prod', '27.6.0', '2760', '1', 'published', '10.0', 'zh-CN', '{"targets": ["pc"]}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO appstore_release_note_localization
    (id, tenant_id, organization_id, release_id, locale, release_notes, created_at, updated_at)
VALUES
    ('note-app-qwen-320', '100001', '0', 'rel-app-qwen-320', 'zh-CN', '• 新增 AI 深度思考推理模式
• 支持拖拽解析 PDF/Word/Excel 大型文档与代码库
• 性能优化与侧边栏快捷唤醒', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-deepseek-150', '100001', '0', 'rel-app-deepseek-150', 'zh-CN', '• 开放 Reasoning 逻辑思维过程实时展开
• 强化数学与 Code 单元测试能力
• 优化多线程推理响应速度', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-kimi-281', '100001', '0', 'rel-app-kimi-281', 'zh-CN', '• 升级 Kimi 探索版多步深度搜索
• 支持超长 PDF 格式化对比与表格重构', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-cursor-0420', '100001', '0', 'rel-app-cursor-0420', 'zh-CN', '• 新增 Agent 模式并行任务
• 支持更多代码库索引类型', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-tencent-ima-260', '100001', '0', 'rel-app-tencent-ima-260', 'zh-CN', '• 新增个人知识库深度问答
• 支持多格式文档导入', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-midjourney-610', '100001', '0', 'rel-app-midjourney-610', 'zh-CN', '• 新增风格参考与角色一致性
• 提升 4K 出图分辨率', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-doubao-230', '100001', '0', 'rel-app-doubao-230', 'zh-CN', '• 新增图像理解与文档问答
• 优化多轮对话上下文管理', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-perplexity-461', '100001', '0', 'rel-app-perplexity-461', 'zh-CN', '• 支持聚焦搜索与专业模式
• 新增研究笔记工作区', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-suno-400', '100001', '0', 'rel-app-suno-400', 'zh-CN', '• 新增完整专辑生成模式
• 支持自定义歌词与翻唱', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-v0-240', '100001', '0', 'rel-app-v0-240', 'zh-CN', '• 支持多页面应用生成
• 新增设计系统模板', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-bolt-310', '100001', '0', 'rel-app-bolt-310', 'zh-CN', '• 支持数据库 schema 自动生成
• 新增部署一键集成', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-manus-200', '100001', '0', 'rel-app-manus-200', 'zh-CN', '• 新增任务沙箱与审批流
• 支持团队 Agent 共享', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-coze-350', '100001', '0', 'rel-app-coze-350', 'zh-CN', '• 新增插件市场
• 优化工作流调试体验', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-code-playground-182', '100001', '0', 'rel-app-code-playground-182', 'zh-CN', '• 新增 Python 3.12 环境
• 支持共享运行链接', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-runway-370', '100001', '0', 'rel-app-runway-370', 'zh-CN', '• 新增 Gen-3 视频模型
• 支持多镜头脚本生成', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-elevenlabs-290', '100001', '0', 'rel-app-elevenlabs-290', 'zh-CN', '• 新增 32 种语言支持
• 优化低延迟流式合成', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-comfyui-035', '100001', '0', 'rel-app-comfyui-035', 'zh-CN', '• 新增工作流模板库
• 支持多模型并行队列', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-flux-120', '100001', '0', 'rel-app-flux-120', 'zh-CN', '• 新增 FLUX.1 Pro 接入
• 支持批量生成与提示词优化', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-notion-ai-390', '100001', '0', 'rel-app-notion-ai-390', 'zh-CN', '• 新增 AI 会议纪要总结
• 支持数据库问答', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-rag-knowledge-210', '100001', '0', 'rel-app-rag-knowledge-210', 'zh-CN', '• 新增混合检索与重排
• 支持多租户知识隔离', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-saas-starter-140', '100001', '0', 'rel-app-saas-starter-140', 'zh-CN', '• 新增 Stripe 计费集成
• 支持一键部署模板', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-agent-workspace-220', '100001', '0', 'rel-app-agent-workspace-220', 'zh-CN', '• 新增 Agent 市场
• 支持工作流版本管理', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-claude-190', '100001', '0', 'rel-app-claude-190', 'zh-CN', '• 升级 Claude 3.7 混合推理
• 支持超长代码库理解与重构', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-ai-arena-190', '100001', '0', 'rel-game-ai-arena-190', 'zh-CN', '• 新增联赛模式
• 支持自定义 Agent 策略', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-ai-story-200', '100001', '0', 'rel-game-ai-story-200', 'zh-CN', '• 新增多结局成就系统
• 支持自定义世界观', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-ai-pet-330', '100001', '0', 'rel-game-ai-pet-330', 'zh-CN', '• 新增宠物情绪系统
• 支持跨设备陪伴同步', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-ai-chess-170', '100001', '0', 'rel-game-ai-chess-170', 'zh-CN', '• 新增棋谱数据库检索
• 优化 AI 难度自适应', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-ai-dungeon-250', '100001', '0', 'rel-game-ai-dungeon-250', 'zh-CN', '• 新增随机事件系统
• 支持多人协作探险', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-ai-rpg-160', '100001', '0', 'rel-game-ai-rpg-160', 'zh-CN', '• 新增 NPC 长期记忆
• 开放世界动态经济系统', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-doudizhu-820', '100001', '0', 'rel-game-doudizhu-820', 'zh-CN', '• 新增 AI 陪练模式
• 优化匹配与防作弊', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-xiangqi-510', '100001', '0', 'rel-game-xiangqi-510', 'zh-CN', '• 新增残局挑战关卡
• 支持棋谱导入导出', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-mahjong-740', '100001', '0', 'rel-game-mahjong-740', 'zh-CN', '• 新增血流成河模式
• 优化断线重连', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-gomoku-300', '100001', '0', 'rel-game-gomoku-300', 'zh-CN', '• 新增悔棋与复盘
• 优化 AI 棋力', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-junqi-420', '100001', '0', 'rel-game-junqi-420', 'zh-CN', '• 新增排位赛季
• 优化行棋规则', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-guandan-600', '100001', '0', 'rel-game-guandan-600', 'zh-CN', '• 新增 AI 陪练搭档
• 优化出牌提示', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-mini-jump-240', '100001', '0', 'rel-game-mini-jump-240', 'zh-CN', '• 新增每日挑战模式', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-mini-2048-190', '100001', '0', 'rel-game-mini-2048-190', 'zh-CN', '• 新增无尽模式', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-mini-fruit-210', '100001', '0', 'rel-game-mini-fruit-210', 'zh-CN', '• 新增水果皮肤系统', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-mini-bird-150', '100001', '0', 'rel-game-mini-bird-150', 'zh-CN', '• 新增夜间模式', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-mobile-mc-1205', '100001', '0', 'rel-game-mobile-mc-1205', 'zh-CN', '• 新增洞穴与悬崖生物群系', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-mobile-ys-470', '100001', '0', 'rel-game-mobile-ys-470', 'zh-CN', '• 新增区域与角色', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-mobile-honor-860', '100001', '0', 'rel-game-mobile-honor-860', 'zh-CN', '• 新增英雄与赛季皮肤', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-game-mobile-cf-790', '100001', '0', 'rel-game-mobile-cf-790', 'zh-CN', '• 新增生化追击模式', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-wps-1280', '100001', '0', 'rel-app-wps-1280', 'zh-CN', '• 新增 AI 文档助手
• 优化 PDF 编辑', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-baidunetdisk-1120', '100001', '0', 'rel-app-baidunetdisk-1120', 'zh-CN', '• 新增 AI 相册整理', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-wechat-8030', '100001', '0', 'rel-app-wechat-8030', 'zh-CN', '• 新增视频号直播功能', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('note-app-douyin-2760', '100001', '0', 'rel-app-douyin-2760', 'zh-CN', '• 新增 AI 视频剪辑工具', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Bind each listing to its latest published release for storefront version display.
UPDATE appstore_listing l
SET current_release_id = (
    SELECT r.id
    FROM appstore_release r
    WHERE r.listing_id = l.id AND r.release_status = 'published'
    ORDER BY r.published_at DESC
    LIMIT 1
)
WHERE l.tenant_id = '100001'
  AND EXISTS (
    SELECT 1 FROM appstore_release r
    WHERE r.listing_id = l.id AND r.release_status = 'published'
  );
