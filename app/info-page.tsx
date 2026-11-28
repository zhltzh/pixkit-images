"use client";

import Link from "next/link";
import { useI18n } from "./i18n";

export function InfoPage({
  eyebrow,
  title,
  intro,
  eyebrowEn,
  titleEn,
  introEn,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  eyebrowEn?: string;
  titleEn?: string;
  introEn?: string;
  children: React.ReactNode;
}) {
  const { locale, t } = useI18n();
  const en = locale === "en";
  return (
    <main className="info-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Pixkit 首页"><span className="brand-mark">P</span><span>Pixkit</span></Link>
        <nav aria-label="信息页导航"><Link href="/tools/image-format-converter">{t("nav_tools")}</Link><a href="https://aixuno.com">AIXUNO</a></nav>
      </header>
      <article className="info-card">
        <nav className="breadcrumb" aria-label="面包屑导航"><Link href="/">{t("home_breadcrumb")}</Link><span>/</span><span>{en && titleEn ? titleEn : title}</span></nav>
        <span className="info-eyebrow">{en && eyebrowEn ? eyebrowEn : eyebrow}</span>
        <h1>{en && titleEn ? titleEn : title}</h1>
        <p className="info-intro">{en && introEn ? introEn : intro}</p>
        <div className="info-body">{children}</div>
      </article>
      <footer><span>Pixkit · AIXUNO 旗下图片工具</span><nav aria-label="Aixuno 站群"><a href="https://aixuno.com/">Markdown 转换</a><a href="https://compress.aixuno.com/">文件压缩</a><a href="https://pdf.aixuno.com/">PDF 工具</a><a href="https://bg.aixuno.com/">AI 抠图</a><a href="https://scan.aixuno.com/">文档扫描</a><a href="https://restore.aixuno.com/">老照片修复</a><a href="https://watermark.aixuno.com/">视频去水印</a></nav><nav><Link href="/about">关于</Link><Link href="/contact">联系</Link><Link href="/privacy">隐私</Link><Link href="/terms">条款</Link><Link href="/disclaimer">免责声明</Link><Link href="/changelog">更新记录</Link></nav></footer>
    </main>
  );
}
