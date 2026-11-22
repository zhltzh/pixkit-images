import type { Metadata } from "next";
import { InfoPage } from "../info-page";
import { absoluteUrl } from "../site-config";

const title = "Pixkit 免责声明｜图片处理结果与使用建议";
const description = "Pixkit 免责声明：处理结果质量、批量操作建议、第三方链接与商标归属说明。";
const canonical = absoluteUrl("/disclaimer/");

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Pixkit",
    locale: "zh_CN",
    url: canonical,
    images: [{ url: absoluteUrl("/og.png"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [absoluteUrl("/og.png")],
  },
};

export default function DisclaimerPage() {
  return <InfoPage eyebrow="DISCLAIMER" title="免责声明" intro="使用 Pixkit 前请了解以下事项。最后更新：2026 年 11 月 20 日。">
    <section><h2>处理结果</h2><p>格式转换、压缩、裁剪与水印均为尽力而为的算法处理。结果质量取决于原图与浏览器能力，请在分发或商用前自行检查输出效果。</p></section>
    <section><h2>批量操作</h2><p>批量处理大量图片时，建议先用少量样本确认参数效果，再处理全部图片，避免参数不当造成批量返工。</p></section>
    <section><h2>浏览器兼容性</h2><p>AVIF 等新格式的导出能力取决于浏览器实现。不同浏览器的结果可能存在差异，请以你实际使用的浏览器输出为准。</p></section>
    <section><h2>商标与归属</h2><p>JPG、PNG、WebP、AVIF 等均为各自所有者的商标或产物，与 AIXUNO 无从属关系。页面提及的第三方项目仅用于说明兼容性。</p></section>
    <section><h2>外部链接</h2><p>页面链接到 AIXUNO 站群或其他资源仅为方便起见，我们对外部站点的内容与做法不承担责任。</p></section>
  </InfoPage>;
}
