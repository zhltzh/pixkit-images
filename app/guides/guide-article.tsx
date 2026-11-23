import Link from "next/link";
import { absoluteUrl, SITE_URL } from "../site-config";
import { getGuideBySlug, GUIDE_LIST_PATH, guideUrl } from "./guide-data";
import type { GuideMeta } from "./guide-data";

/** 文章内嵌的工具引导按钮 */
export function GuideToolCta({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <div className="guide-tool-cta">
      <strong>{label}</strong>
      <p>{description}</p>
      <Link href={href}>立即免费使用 →</Link>
    </div>
  );
}

export function GuideArticle({
  guide,
  faq,
  children,
}: {
  guide: GuideMeta;
  faq?: { q: string; a: string }[];
  children: React.ReactNode;
}) {
  const url = absoluteUrl(`/guides/${guide.slug}/`);
  const listUrl = absoluteUrl(`${GUIDE_LIST_PATH}/`);
  const related = guide.related
    .map((slug) => getGuideBySlug(slug))
    .filter((item): item is GuideMeta => Boolean(item));

  return (
    <main className="guide-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Pixkit 首页">
          <span className="brand-mark">P</span>
          <span>Pixkit</span>
        </Link>
        <nav aria-label="主要导航">
          <Link href={GUIDE_LIST_PATH}>全部教程</Link>
          <Link href={`/tools/${guide.toolSlug}`}>{guide.toolName}</Link>
          <span className="privacy-pill">● 图片不离开设备</span>
        </nav>
      </header>

      <article className="guide-article">
        <nav className="breadcrumb guide-crumb" aria-label="面包屑导航">
          <Link href="/">首页</Link>
          <span aria-hidden="true">/</span>
          <Link href={GUIDE_LIST_PATH}>教程</Link>
          <span aria-hidden="true">/</span>
          <span>{guide.title}</span>
        </nav>

        <span className="info-eyebrow">图片处理教程</span>
        <h1>{guide.title}</h1>
        <div className="guide-meta">
          <time dateTime={guide.dateModified}>更新于 {guide.dateModified}</time>
          <span>对应工具：{guide.toolName}</span>
        </div>

        <div className="guide-body">{children}</div>

        {faq && faq.length > 0 && (
          <section className="guide-faq" aria-label="常见问题">
            <h2>常见问题</h2>
            {faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </section>
        )}

        {related.length > 0 && (
          <section className="guide-related" aria-label="相关教程">
            <h2>相关教程</h2>
            <div className="guide-related-list">
              {related.map((item) => (
                <Link key={item.slug} href={guideUrl(item.slug)}>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.summary}</small>
                  </span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
            <p className="guide-meta" style={{ marginTop: 14 }}>
              <Link href={GUIDE_LIST_PATH}>查看全部图片处理教程</Link>
            </p>
          </section>
        )}
      </article>

      <footer className="guide-footer">
        <span>Pixkit · <a href="https://aixuno.com">AIXUNO 旗下图片工具</a></span>
        <nav aria-label="Aixuno 站群">
          <a href="https://aixuno.com/">Markdown 转换</a>
          <a href="https://compress.aixuno.com/">文件压缩</a>
          <a href="https://pdf.aixuno.com/">PDF 工具</a>
          <a href="https://bg.aixuno.com/">AI 抠图</a>
          <a href="https://scan.aixuno.com/">文档扫描</a>
          <a href="https://restore.aixuno.com/">老照片修复</a>
          <a href="https://watermark.aixuno.com/">视频去水印</a>
        </nav>
        <nav aria-label="站点信息">
          <a href="/guides">教程</a>
          <a href="/about">关于</a>
          <a href="/contact">联系</a>
          <a href="/privacy">隐私</a>
          <a href="/terms">条款</a>
          <a href="/disclaimer">免责声明</a>
          <a href="/changelog">更新记录</a>
        </nav>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                headline: guide.title,
                description: guide.description,
                url,
                mainEntityOfPage: { "@type": "WebPage", "@id": url },
                image: [absoluteUrl("/og.png")],
                datePublished: guide.datePublished,
                dateModified: guide.dateModified,
                inLanguage: "zh-CN",
                author: { "@type": "Organization", name: "Pixkit", url: SITE_URL },
                publisher: {
                  "@type": "Organization",
                  name: "Pixkit",
                  logo: { "@type": "ImageObject", url: absoluteUrl("/favicon.svg") },
                },
              },
              ...(faq && faq.length > 0
                ? [
                    {
                      "@type": "FAQPage",
                      mainEntity: faq.map((item) => ({
                        "@type": "Question",
                        name: item.q,
                        acceptedAnswer: { "@type": "Answer", text: item.a },
                      })),
                    },
                  ]
                : []),
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "首页", item: absoluteUrl("/") },
                  { "@type": "ListItem", position: 2, name: "教程", item: listUrl },
                  { "@type": "ListItem", position: 3, name: guide.title, item: url },
                ],
              },
            ],
          }),
        }}
      />
    </main>
  );
}
