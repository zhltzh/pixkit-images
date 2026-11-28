"use client";

import { InfoPage } from "../info-page";

export function TermsContent() {
  const en = useI18n().locale === "en";
  return (
    <InfoPage
      eyebrow="TERMS"
      title="Terms of Service"
      intro="By using Pixkit you agree to the terms below. Last updated: November 2026."
      eyebrowEn="TERMS"
      titleEn="Terms of Service"
      introEn="By using Pixkit you agree to the terms below. Last updated: November 2026."
    >
      {en ? (
        <>
          <section><h2>1. The service</h2><p>Pixkit is a free browser-based image tool, provided as-is, without warranties of any kind. We may change, suspend, or discontinue any part of the service at any time.</p></section>
          <section><h2>2. Your content</h2><p>Your images are processed on your device and never transmitted to us. You retain all rights to everything you create with the tool. We claim no ownership over your content.</p></section>
          <section><h2>3. Acceptable use</h2><p>You agree not to use Pixkit to process content you have no right to use, or to violate any applicable law. Automated abuse of the site or attempts to disrupt its availability are prohibited.</p></section>
          <section><h2>4. Limitation of liability</h2><p>To the maximum extent permitted by law, Aixuno is not liable for any damages, data loss, or losses arising from the use or inability to use this service. Always keep your own backups of important images.</p></section>
          <section><h2>5. Changes</h2><p>We may update these terms from time to time. Continued use of the service after changes take effect constitutes acceptance of the revised terms.</p></section>
        </>
      ) : (
        <>
          <section><h2>1. 服务说明</h2><p>Pixkit 是免费的浏览器本地图片工具，按"现状"提供。我们可能随时调整、暂停或终止部分功能，恕不另行通知。</p></section>
          <section><h2>2. 你的内容</h2><p>你添加的图片与生成的结果都在你的设备上处理，不会传输给我们。你保留对自己内容的全部权利，我们不对你处理的内容主张任何权利。</p></section>
          <section><h2>3. 可接受的使用</h2><p>你承诺不利用 Pixkit 处理无权使用的图片，不违反任何适用法律，不对网站进行自动化滥用或破坏其可用性的尝试。</p></section>
          <section><h2>4. 责任限制</h2><p>在法律允许的最大范围内，AIXUNO 对因使用或无法使用本服务造成的任何损失不承担责任。重要素材请自行保留备份。</p></section>
          <section><h2>5. 条款变更</h2><p>我们可能更新本条款。变更生效后继续使用本服务即视为接受修订后的条款。</p></section>
        </>
      )}
    </InfoPage>
  );
}
