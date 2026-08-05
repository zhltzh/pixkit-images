import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { SITE_URL } from "./site-config";
import "./globals.css";

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#101820",
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const base = forwardedHost
    ? new URL(`${forwardedProtocol || "https"}://${forwardedHost}`)
    : new URL(SITE_URL);
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
    openGraph: { title, description, type: "website", images: [{ url: new URL("/og.png", base), width: 1536, height: 1024 }] },
    twitter: { card: "summary_large_image", title, description, images: [new URL("/og.png", base)] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
