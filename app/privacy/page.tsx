import type { Metadata } from "next";
import { InfoPage } from "../info-page";
import { absoluteUrl } from "../site-config";

export const metadata: Metadata = {
  title: "Pixkit 隐私说明｜图片在浏览器本地处理",
  description: "了解 Pixkit 如何在浏览器本地处理图片、哪些数据不会上传，以及用户使用工具时需要注意的事项。",
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return <InfoPage eyebrow="PRIVACY" title="Pixkit 隐私说明" intro="Pixkit 的核心图片处理在当前浏览器中完成，图片无需提交到 Pixkit 服务器。最后更新：2026 年 8 月 9 日。">
    <section><h2>图片与文件</h2><p>用户选择、拖入、粘贴的图片以及用于水印的图片保存在当前页面会话中，并通过浏览器能力进行处理。Pixkit 不要求创建账户，也不会主动把这些图片上传到服务器。</p></section>
    <section><h2>处理结果</h2><p>转换、压缩、裁剪、旋转、水印和 ZIP 文件均由当前设备生成。关闭或刷新页面后，尚未下载的临时结果可能丢失。</p></section>
    <section><h2>访问与统计</h2><p>托管服务可能记录维持网站安全和稳定所需的常规访问日志。未来如接入访问统计或错误监测，我们会在此说明使用目的和范围，不会把用户图片作为统计内容。</p></section>
    <section><h2>第三方链接</h2><p>页面可能链接到 AIXUNO 或其他相关资源。离开 Pixkit 后，目标网站适用其自身的隐私政策。</p></section>
  </InfoPage>;
}
