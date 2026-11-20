import type { Metadata } from "next";
import { InfoPage } from "../info-page";
import { absoluteUrl } from "../site-config";

export const metadata: Metadata = {
  title: "Pixkit 使用条款｜免费图片工具服务条款",
  description: "Pixkit 使用条款：服务的提供方式、用户内容的权利归属、可接受的使用范围与责任限制。",
  alternates: { canonical: absoluteUrl("/terms") },
};

export default function TermsPage() {
  return <InfoPage eyebrow="TERMS" title="使用条款" intro="使用 Pixkit 即表示同意以下条款。最后更新：2026 年 11 月 20 日。">
    <section><h2>1. 服务说明</h2><p>Pixkit 是免费的浏览器本地图片处理工具，按"现状"提供。我们可能随时调整、暂停或终止部分功能，恕不另行通知。</p></section>
    <section><h2>2. 你的内容</h2><p>你添加到页面的图片与生成的结果都在你的设备上处理，不会传输给我们。你保留对自己内容的全部权利，我们不对你处理的内容主张任何权利。</p></section>
    <section><h2>3. 可接受的使用</h2><p>你承诺不利用 Pixkit 处理无权使用的图片，不违反任何适用法律，不对网站进行自动化滥用或破坏其可用性的尝试。</p></section>
    <section><h2>4. 责任限制</h2><p>在法律允许的最大范围内，AIXUNO 对因使用或无法使用本服务造成的任何损失不承担责任。重要素材请自行保留备份。</p></section>
    <section><h2>5. 条款变更</h2><p>我们可能更新本条款。变更生效后继续使用本服务即视为接受修订后的条款。</p></section>
  </InfoPage>;
}
