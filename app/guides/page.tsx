import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, SITE_URL } from "../site-config";
import { GUIDES, GUIDE_LIST_PATH, guideUrl } from "./guide-data";

const url = absoluteUrl(`${GUIDE_LIST_PATH}/`);
const title = "图片处理教程 - 免费在线图片工具";

export const metadata: Metadata = {
  title: { absolute: title },
  description:
    "Pixkit 出品的图片处理教程：批量改尺寸、压缩到 200KB、JPG/PNG/WebP 互转、裁剪统一比例、加水印、批量重命名，每篇都附可直接使用的免费在线工具。",
  alternates: { canonical: url },
  openGraph: {
    title,
    description: "6 篇图片处理实操教程，覆盖尺寸、压缩、格式转换、裁剪、水印与重命名，全部附免费在线工具。",
    type: "website",
    siteName: "Pixkit",
    locale: "zh_CN",
    url,
    images: [{ url: absoluteUrl("/og.png"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: "6 篇图片处理实操教程，每篇都附可直接使用的免费在线工具。",
    images: [absoluteUrl("/og.png")],
  },
};

export default function GuidesPage() {
  return (
    <main className="guide-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Pixkit 首页">
          <span className="brand-mark">P</span>
          <span>Pixkit</span>
        </Link>
        <nav aria-label="主要导航">
          <Link href="/tools/image-format-converter">图片工具</Link>
          <span className="privacy-pill">● 图片不离开设备</span>
        </nav>
      </header>

      <section className="guide-article" aria-labelledby="guides-title">
        <nav className="breadcrumb guide-crumb" aria-label="面包屑导航">
          <Link href="/">首页</Link>
          <span aria-hidden="true">/</span>
          <span>教程</span>
        </nav>

        <div className="guide-list-intro">
          <span>PIXKIT GUIDES</span>
          <h1 id="guides-title">图片处理教程</h1>
          <p>
            每个问题都给出可以直接照做的步骤，并配好对应的免费工具。全部在浏览器本地处理，图片不上传服务器。
          </p>
        </div>

        <div className="guide-grid-cards">
          {GUIDES.map((guide) => (
            <Link key={guide.slug} href={guideUrl(guide.slug)} className="guide-card">
              <h2>{guide.title}</h2>
              <p>{guide.summary}</p>
              <div className="guide-card-foot">
                <span>对应工具：{guide.toolName}</span>
                <b>阅读 →</b>
              </div>
            </Link>
          ))}
        </div>

        <div className="guide-list-foot">
          <h2>想直接开始处理图片？</h2>
          <p>教程里提到的工具全部免费，无需注册，打开网页就能用。</p>
          <Link href="/tools/image-format-converter">浏览所有图片工具</Link>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "图片处理教程",
              description: "Pixkit 出品的图片处理实操教程，覆盖批量改尺寸、压缩、格式转换、裁剪、水印与重命名。",
              url,
              inLanguage: "zh-CN",
              isPartOf: { "@type": "WebSite", name: "Pixkit", url: SITE_URL },
              hasPart: GUIDES.map((guide) => ({
                "@type": "Article",
                headline: guide.title,
                description: guide.description,
                url: absoluteUrl(guideUrl(guide.slug)),
                datePublished: guide.datePublished,
                dateModified: guide.dateModified,
              })),
            }),
          }}
        />
      </section>

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
    </main>
  );
}
