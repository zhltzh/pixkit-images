import type { Metadata, Viewport } from "next";
import { SITE_URL } from "./site-config";
import { SiteNetwork, SiteUtilityLinks } from "./site-network";
import "./globals.css";

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#101820",
};

export async function generateMetadata(): Promise<Metadata> {
  // Static export has no request headers, so the canonical base comes from the
  // configured site URL instead of x-forwarded-host.
  const base = new URL(SITE_URL);
  const title = "Pixkit — 批量图片转换、压缩与尺寸调整";
  const description = "免费的浏览器本地批量图片工具，支持 JPG、PNG、WebP、AVIF 转换，并可导入 BMP、ICO、SVG 进行压缩、裁剪、尺寸调整和水印处理。";
  return {
    metadataBase: base,
    applicationName: "Pixkit",
    title,
    description,
    manifest: "/manifest.webmanifest",
    authors: [{ name: "Pixkit" }],
    creator: "Pixkit",
    publisher: "AIXUNO",
    category: "technology",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: { canonical: base },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Pixkit",
      locale: "zh_CN",
      url: base,
      images: [{ url: new URL("/og.png", base), width: 1536, height: 1024 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [new URL("/og.png", base)] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteNetwork />
        {children}
        <SiteUtilityLinks />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://aixuno.com/#organization",
              name: "AIXUNO",
              url: "https://aixuno.com",
              subOrganization: { "@id": `${SITE_URL}/#organization` },
            },
            {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "Pixkit",
              url: SITE_URL,
              parentOrganization: { "@id": "https://aixuno.com/#organization" },
            },
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              name: "Pixkit",
              url: SITE_URL,
              inLanguage: "zh-CN",
              publisher: { "@id": `${SITE_URL}/#organization` },
            },
          ],
        }) }} />
      </body>
    </html>
  );
}
