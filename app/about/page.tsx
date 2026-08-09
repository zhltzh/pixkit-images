import type { Metadata } from "next";
import { InfoPage } from "../info-page";
import { absoluteUrl } from "../site-config";

export const metadata: Metadata = {
  title: "关于 Pixkit｜AIXUNO 旗下本地图片工具",
  description: "了解 Pixkit 的产品定位、浏览器本地处理方式、支持的图片任务和隐私原则。",
  alternates: { canonical: absoluteUrl("/about") },
};

export default function AboutPage() {
  return <InfoPage eyebrow="ABOUT PIXKIT" title="关于 Pixkit" intro="Pixkit 是 AIXUNO 旗下的浏览器本地批量图片处理工具，帮助用户更简单地完成常见图片任务。">
    <section><h2>我们解决什么问题？</h2><p>Pixkit 专注于批量格式转换、压缩、尺寸调整、裁剪旋转、水印和文件重命名。每个工具都尽量减少中间步骤，让用户添加图片后直接设置参数并下载结果。</p></section>
    <section><h2>为什么采用本地处理？</h2><p>图片解码、Canvas 绘制、格式编码和 ZIP 打包主要在当前浏览器完成。图片不需要上传到 Pixkit 服务器，能够减少上传等待，也降低私人照片、客户素材和未发布作品离开设备的风险。</p></section>
    <section><h2>支持哪些图片格式？</h2><p>主要输入输出格式为 JPG、JPEG、PNG、WebP 和 AVIF；BMP、ICO、SVG 可以作为导入格式转换为常用图片格式。实际 AVIF 导出能力取决于浏览器。</p></section>
    <section><h2>产品与品牌</h2><p>Pixkit 由 AIXUNO 提供。AIXUNO 同时关注 Markdown、PDF、Office 和图片等日常文件处理工作流。我们会持续记录功能变化，并保持工具说明与实际能力一致。</p></section>
  </InfoPage>;
}
