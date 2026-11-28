"use client";

import { InfoPage } from "../info-page";

export function AboutContent() {
  const en = useI18n().locale === "en";
  return (
    <InfoPage
      eyebrow="ABOUT"
      title="About Pixkit"
      intro="Pixkit is a free local-first image tool that runs entirely in your browser. Part of the Aixuno tool ecosystem."
      eyebrowEn="ABOUT"
      titleEn="About Pixkit"
      introEn="Pixkit is a free local-first image tool that runs entirely in your browser. Part of the Aixuno tool ecosystem."
    >
      {en ? (
        <>
          <section><h2>Why local-first</h2><p>Pixkit decodes, converts, compresses and marks up images directly on your device. Your photos never leave the browser — no uploads, no queues, no waiting on someone else&apos;s server.</p></section>
          <section><h2>The Aixuno ecosystem</h2><p>Pixkit is part of the Aixuno tool family: a Markdown converter, file compression, PDF utilities, AI background removal, document scanning, ID photo maker, old photo restoration and video watermark removal. Each tool is free and requires no account.</p></section>
        </>
      ) : (
        <>
          <section><h2>为什么本地优先</h2><p>Pixkit 直接在你的设备上完成图片解码、转换、压缩与水印处理。图片永远不会离开浏览器——没有上传、没有排队，也不必等待别人的服务器。</p></section>
          <section><h2>Aixuno 工具生态</h2><p>Pixkit 是 Aixuno 工具家族的一员：Markdown 转换、文件压缩、PDF 工具、AI 抠图、文档扫描、证件照制作、老照片修复与视频去水印。每个工具都免费，且无需注册。</p></section>
        </>
      )}
    </InfoPage>
  );
}
