# SDKWork App Store H5 产品需求文档

Status: active  
Owner: SDKWork maintainers  
Application: sdkwork-appstore-h5  
Surface: H5 移动 Web / Capacitor 壳（<768px 主目标）  
Updated: 2026-07-05  
Authority: [仓库 PRD](../../../../../docs/product/prd/PRD.md)、[UI 设计规范](../../../../../docs/product/design/UI_DESIGN_SPEC.md)

## 1. 定位

H5 端是 SDKWork 应用市场的移动优先入口：单栏 + 底部 Tab 导航，触控优化，对标 App Store iOS / Google Play App / 应用宝 App 的浏览与安装体验。同时作为 Capacitor 混合壳的 Web 层。

## 2. 目标用户

| 用户 | 场景 |
| --- | --- |
| 移动用户 | 碎片化浏览、搜索、一键安装 |
| 开发者 | 轻量 Publisher Console（查看状态、紧急发布） |
| 小程序用户 | 受限能力下的发现与跳转 |

## 3. 目标与非目标

### 3.1 目标

- 移动触控体验：底部 Tab、下拉刷新、横滑截图
- P0 消费者路径完整：发现 → 详情 → 安装 → 库
- Publisher Console 核心流程可用（创建、提交、查看审核）
- 安全区适配（刘海屏、底部 Home Indicator）

### 3.2 非目标（本阶段）

- 完整 Publisher 数据分析大屏 — 引导至 PC
- 原生 IAP — commerce 域
- 应用内安装 APK/IPA — 依赖宿主能力

## 4. 信息架构

### 4.1 底部 Tab 导航

| Tab | 路由 | 图标 |
| --- | --- | --- |
| 发现 | `/` | 星星/火花 |
| 应用 | `/apps` | 网格 |
| 游戏 | `/games` | 游戏手柄 |
| 搜索 | `/search` | 放大镜 |
| 库 | `/library` | 下载/盒子 |

子页面（详情、合集、设置）隐藏 Tab，顶部返回 + 标题。

### 4.2 二级入口

| 入口 | 路由 | 位置 |
| --- | --- | --- |
| 更新中心 | `/updates` | 库页顶部横幅 |
| 收藏夹 | `/wishlist` | 库页 Tab |
| 通知 | `/notifications` | 发现页顶栏 |
| 设置 | `/settings` | 库页头像菜单 |
| Publisher | `/publisher` | 设置内入口 |
| 登录 | `/login` | 鉴权拦截 |

## 5. 页面规格

### 5.1 首页

- 单栏流式：Hero 轮播（全宽）→ 故事卡横滚 → 合集横滚 → 推荐双列网格 → 榜单入口
- 下拉刷新整页推荐
- 首屏骨架：Banner + 4 卡 skeleton

### 5.2 应用详情

- 头部：图标 96px + 名称 + 获取按钮（全宽）
- 截图横滚 + 轻触 Lightbox（全屏滑动）
- 描述默认折叠 3 行 +「展开」
- 底部固定获取栏（滚动后 sticky）
- 评论：上拉加载更多

### 5.3 搜索

- 搜索页：大号输入框 + 历史 + 热词标签云
- 输入时全屏建议列表
- 结果：单列 AppCard + 筛选底部 Sheet

### 5.4 我的库

- 顶部：更新横幅（N 个可更新）
- Tab：已安装 / 收藏
- 长按：卸载 / 取消收藏（确认 Sheet）
- 空状态：引导去发现

### 5.5 Publisher Console（移动简化版）

- 应用列表卡片式
- 创建应用：分步向导（每步一屏）
- 媒体上传：调起相册 / 文件选择
- 复杂配置引导「在 PC 端完成」

## 6. 触控与手势

| 手势 | 行为 |
| --- | --- |
| 下拉 | 刷新列表 |
| 上拉 | 加载更多 |
| 左滑返回 | 系统 / 路由返回 |
| 横滑 | 截图 / Banner / 合集 |
| 长按 | 库项操作菜单 |

最小点击区域 44×44px。

## 7. Capacitor / 宿主适配

| 能力 | 策略 |
| --- | --- |
| 状态栏 | 沉浸式 + 主题色 |
| 安全区 | `env(safe-area-inset-*)` |
| 文件上传 | Drive 直传 |
| 打开应用 | 深链 / Universal Link |
| 推送 | notifications 域 + 原生通道 |

## 8. 组件包映射

| 包 | 职责 |
| --- | --- |
| `sdkwork-appstore-h5-shell` | Tab 壳、移动布局 |
| `sdkwork-appstore-h5-commons` | 移动 UI  primitive |
| `sdkwork-appstore-h5-catalog` | 首页、分类 |
| `sdkwork-appstore-h5-listing` | 详情 |
| `sdkwork-appstore-h5-library` | 库、更新 |
| `sdkwork-appstore-h5-search` | 搜索 |
| `sdkwork-appstore-h5-console-shell` | Publisher 移动壳 |
| `sdkwork-appstore-h5-core` | SDK、IAM |

## 9. 性能目标

| 指标 | 目标 |
| --- | --- |
| 首页 LCP（4G） | ≤ 3.0s |
| 详情 LCP | ≤ 2.5s |
| INP | ≤ 200ms |
| 包体（首屏 JS） | ≤ 200KB gzip |

## 10. 阶段

| 阶段 | 交付 |
| --- | --- |
| Phase 1 | Tab 壳 + 首页 + 详情 + 库 + 搜索 |
| Phase 2 | Publisher 移动版 + 评论 + 推送 |
| Phase 3 | Capacitor 壳 + 离线缓存 |

## 11. 关联文档

- [仓库 PRD](../../../../../docs/product/prd/PRD.md)
- [技术架构](../../../../../docs/architecture/tech/TECH_ARCHITECTURE.md)
- [UI 设计规范](../../../../../docs/product/design/UI_DESIGN_SPEC.md)
