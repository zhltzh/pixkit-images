import type { Metadata } from "next";
import { InfoPage } from "../info-page";
import { absoluteUrl } from "../site-config";

export const metadata: Metadata = {
  title: "Pixkit 更新记录｜批量图片工具版本变化",
  description: "查看 Pixkit 格式转换、图片压缩、裁剪、水印、SEO 和浏览器本地处理能力的更新记录。",
  alternates: { canonical: absoluteUrl("/changelog") },
};

export default function ChangelogPage() {
  return <InfoPage eyebrow="CHANGELOG" title="Pixkit 更新记录" intro="记录已经上线的功能和页面变化，让工具说明、搜索内容和实际能力保持一致。">
    <section><h2>2026-08-09 · 搜索与内容体系</h2><ul><li>增加 JPG、PNG、WebP 常见格式转换任务页。</li><li>增加批量压缩 JPG 和 1:1 方形裁剪任务页。</li><li>增加关于、隐私和更新记录页面。</li><li>强化 AIXUNO、Pixkit、工具页之间的品牌实体与站内链接。</li><li>明确允许 OAI-SearchBot 抓取公开内容。</li></ul></section>
    <section><h2>2026-08-05 · 首次公开版本</h2><ul><li>上线格式转换、批量压缩、调整尺寸、裁剪旋转和水印命名。</li><li>支持单张下载和 ZIP 下载。</li><li>加入独立工具 URL、FAQ、操作步骤和结构化数据。</li></ul></section>
  </InfoPage>;
}
