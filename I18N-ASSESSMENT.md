# Pixkit 英文版评估（i18n Assessment）

> 日期：2026-11-20 · 结论：**先轻量双语（方案 B），流量数据支持后再全量化（方案 A）**
> 状态：评估完成，未启动实施

## 1. 现状

- 全站仅中文：首页 workbench、5 个工具页、N 个任务落地页、6 个支撑页（about/privacy/changelog/terms/disclaimer/contact）
- 无 i18n 框架：文案硬编码在 TSX/TS 中（workbench.tsx 单文件即含绝大部分 UI 文案）
- 站群条 label 中文（主站 aixuno-sites.js 已有六语言数据源可复用）
- 技术栈：Next.js 静态导出（`output: "export"`，GitHub Pages），无服务端运行时——i18n 方案必须兼容纯静态（参考：filepomelo 用 next-intl + 静态导出已验证可行）

## 2. 价值与成本

| 维度 | 分析 |
|---|---|
| 海外需求 | 图片格式转换/压缩是国际通用需求，英文搜索量大；但站群已有英文分流入口（aixuno.com 英文页站群条指向 pixkit，落地后是中文页，存在流失） |
| 维护成本 | 方案 A 全量约 300-500 条文案抽取与翻译；每次新增工具页需同步双份文案 |
| SEO 成本 | 需 /en/ 路由 + hreflang + 英文 sitemap；静态导出下 next-intl 已验证可行（filepomelo 先例） |
| 风险 | 机翻质量的品牌影响；双份文案漂移 |

## 3. 方案

### 方案 B（推荐先行）：轻量双语
- 范围：顶部导航、站群条（复用主站六语言数据）、首页 hero 与 CTA、工具页标题与按钮、支撑页标题
- 实现：`src/messages/en.json` + next-intl（静态导出兼容），路由用 `/en/` 目录或 Accept-Language 提示条
- 工作量：约 60-80 条核心文案；1-2 个工作日
- 收益：国际访客不再立刻流失；为方案 A 探路

### 方案 A（数据支持后）：全量 i18n
- 范围：全部工具页、任务落地页、支撑页正文
- 前置条件：方案 B 上线后 1-2 个月，确认国际流量占比与转化数据
- 工作量：约 2-3 周（含翻译校对与 hreflang/sitemap 配套）

### 方案 C：维持中文
- 若国际流量占比长期 <5%，维持现状并把 pixkit 英文需求归入站群层的英文聚合页（由主站承担）

## 4. 决策所需数据

1. image.aixuno.com 的非中文地区访问占比（接入 Cloudflare Web Analytics 或 GitHub Pages 无法直接统计——建议接入轻量统计）
2. 主站英文页跳转 pixkit 的流失率（需主站埋点配合）
