# SDKWork App Store PC 产品需求文档

Status: active  
Owner: SDKWork maintainers  
Application: sdkwork-appstore-pc  
Surface: PC Web（≥1280px 主目标，768–1279 平板适配）  
Updated: 2026-07-05  
Authority: [仓库 PRD](../../../../../docs/product/prd/PRD.md)、[UI 设计规范](../../../../../docs/product/design/UI_DESIGN_SPEC.md)

## 1. 定位

PC 端是 SDKWork 应用市场的主消费与开发者工作台：大屏多栏布局承载完整发现、详情、库管理与 Publisher Console，对标 App Store macOS / Google Play Web / 应用宝 PC 助手的信息密度与操作效率。

## 2. 目标用户

| 用户 | 场景 |
| --- | --- |
| 终端用户 | 大屏浏览、键盘搜索、批量更新、库管理 |
| 开发者 | Publisher Console 全功能：发布、版本、合规、分析 |
| 企业用户 | 组织内应用分发与安装管理 |

## 3. 目标与非目标

### 3.1 目标

- P0 功能与仓库 PRD 功能矩阵对齐
- 侧边导航 + 顶栏搜索的 PC 壳体验
- Publisher Console 完整可用
- 键盘可达 + 深色模式

### 3.2 非目标（本阶段）

- 桌面原生壳（Tauri）— Phase 3
- Backend Admin 运营后台 UI — 独立 admin 应用
- 支付结算 UI — commerce 域

## 4. 信息架构

### 4.1 消费者导航

| 导航项 | 路由 | 说明 |
| --- | --- | --- |
| 发现 | `/` | 首页编辑流 |
| 应用 | `/apps` | 应用分类聚合入口 |
| 游戏 | `/games` | 游戏分类聚合入口 |
| 榜单 | `/charts` | 榜单索引 |
| 搜索 | `/search` | 全局搜索 |
| 我的库 | `/library` | 已安装应用 |
| 更新 | `/updates` | 更新中心 |
| 收藏 | `/wishlist` | 收藏夹 |
| 设置 | `/settings` | 账户与偏好 |

### 4.2 开发者导航（Publisher Console）

| 导航项 | 路由 |
| --- | --- |
| 概览 | `/publisher` |
| 我的应用 | `/publisher/apps` |
| 创建应用 | `/publisher/apps/new` |
| 应用详情管理 | `/publisher/apps/:listingId` |
| 版本管理 | `/publisher/apps/:listingId/releases` |
| 合规 | `/publisher/apps/:listingId/compliance` |
| 数据分析 | `/publisher/apps/:listingId/analytics` |

## 5. 页面规格

### 5.1 首页

- 布局：全宽 Hero + 多栏内容区（max-width 1200px）
- 区块：Banner、Today 故事卡、编辑合集、推荐网格（6 列）、榜单双栏、分类圆标
- 性能：分区流式加载 + 骨架屏
- API：`appstore.catalog.home.retrieve`

### 5.2 应用详情

- 13 区块完整落地（见仓库 PRD §4.3.1）
- 右侧 sticky 获取按钮区（滚动后固定）
- 截图 Lightbox；评论分页加载
- API：`appstore.listings.retrieve` + media + compliance + similar

### 5.3 搜索

- 顶栏搜索 + 独立搜索结果页
- 筛选侧栏：分类、价格、评分、年龄
- 排序：相关度 / 热度 / 评分 / 最新
- API：`appstore.catalog.listings.search`、suggestions、trending

### 5.4 我的库 / 更新中心

- 库：网格/列表切换；排序；搜索
- 更新：可更新列表 + 一键全部更新
- API：`appstore.library.*`

### 5.5 Publisher Console

- 应用列表：表格 + 状态筛选
- 创建向导：5 步（绑定 app → 元信息 → 媒体 → 合规 → 提交）
- 版本管理：渠道 Tab + 制品上传（Drive）+ 灰度配置
- API：`appstore.publishers.*`、`appstore.listings.*`、`appstore.releases.*`

## 6. 布局与响应式

| 断点 | 布局 |
| --- | --- |
| ≥1280 | 侧边栏 240px + 主内容 |
| 768–1279 | 折叠侧边栏为图标栏 + 双栏网格 |
| <768 | 降级提示「建议使用移动版」（可选） |

## 7. 组件包映射

| 包 | 职责 |
| --- | --- |
| `sdkwork-appstore-pc-shell` | 布局、导航、路由壳 |
| `sdkwork-appstore-pc-commons` | AppCard、Button、LoadingSpinner |
| `sdkwork-appstore-pc-catalog` | 首页、分类、榜单 |
| `sdkwork-appstore-pc-listing` | 详情页区块 |
| `sdkwork-appstore-pc-library` | 库、更新、收藏 |
| `sdkwork-appstore-pc-search` | 搜索 |
| `sdkwork-appstore-pc-console-publisher` | Publisher Console |
| `sdkwork-appstore-pc-core` | SDK 客户端、IAM、环境 |

## 8. 成功指标

| 指标 | 目标 |
| --- | --- |
| 首页 LCP | ≤ 2.5s |
| 详情 LCP | ≤ 2.0s |
| 详情 → 安装转化 | ≥ 15% |
| 键盘导航覆盖 | P0 页面 100% |
| 深色模式覆盖 | 100% |

## 9. 阶段

| 阶段 | 交付 |
| --- | --- |
| Phase 1（P0） | 首页、详情、搜索、库、Publisher 基础 |
| Phase 2（P1） | 个性化推荐、分析、内测、评论集成 |
| Phase 3（P2） | 桌面壳、离线库、编辑点评 |

## 10. 关联文档

- [仓库 PRD](../../../../../docs/product/prd/PRD.md)
- [技术架构](../../../../../docs/architecture/tech/TECH_ARCHITECTURE.md)
- [UI 设计规范](../../../../../docs/product/design/UI_DESIGN_SPEC.md)
