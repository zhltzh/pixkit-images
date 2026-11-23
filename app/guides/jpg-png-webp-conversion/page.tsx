import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "../../site-config";
import { getGuideBySlug } from "../guide-data";
import { GuideArticle, GuideToolCta } from "../guide-article";

const guide = getGuideBySlug("jpg-png-webp-conversion")!;
const url = absoluteUrl(`/guides/${guide.slug}/`);
const title = "JPG、PNG、WebP 怎么互转？批量格式转换指南｜Pixkit";

export const metadata: Metadata = {
  title: { absolute: title },
  description: guide.description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description: guide.description,
    type: "article",
    siteName: "Pixkit",
    locale: "zh_CN",
    url,
    images: [{ url: absoluteUrl("/og.png"), width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title, description: guide.description, images: [absoluteUrl("/og.png")] },
};

const faq = [
  {
    q: "JPG 转 PNG 会变清晰吗？",
    a: "不会。转换不会恢复 JPG 已经丢失的细节，只是换了一种编码方式保存。",
  },
  {
    q: "透明背景转成 JPG 会怎样？",
    a: "JPG 不支持透明通道，透明区域会被填充为白色。需要保留透明时请输出 PNG 或 WebP。",
  },
  {
    q: "转换格式能顺便压缩体积吗？",
    a: "部分情况会变小，例如照片转 WebP；但转换本身不保证减体积，需要控制体积请用压缩工具并调整质量。",
  },
  {
    q: "BMP、ICO、SVG 可以转成什么格式？",
    a: "它们属于导入格式，转换后会输出为 JPG、PNG、WebP 或 AVIF，不能保持原格式导出。",
  },
  {
    q: "为什么浏览器无法导出 AVIF？",
    a: "AVIF 编码能力由浏览器提供。当前浏览器不支持时，改用 WebP 或 JPG 输出即可。",
  },
];

export default function JpgPngWebpConversionPage() {
  return (
    <GuideArticle guide={guide} faq={faq}>
      <p>
        收到一张 WebP 图片打不开，或者平台只接受 JPG，都需要做格式转换。JPG、PNG、WebP 之间的批量互转并不复杂，关键是先选对目标格式，
        避免转完发现透明背景没了、体积反而更大。下面把三种格式的差别和操作步骤一次讲清。
      </p>

      <h2>三种格式到底差在哪</h2>
      <ul>
        <li>
          <strong>JPG（JPEG）</strong>：有损压缩，兼容性最好，几乎所有软件和平台都支持；不支持透明背景，反复编辑保存会累积画质损失。
        </li>
        <li>
          <strong>PNG</strong>：无损压缩，支持透明背景，适合截图、文字、图标和需要继续编辑的素材；照片类图片体积通常偏大。
        </li>
        <li>
          <strong>WebP</strong>：同时支持有损和无损，也支持透明背景，现代浏览器普遍可用；同样画质下体积通常比 JPG 更小。
        </li>
      </ul>
      <p>
        简单记：<strong>照片看体积选 JPG 或 WebP，透明素材选 PNG 或 WebP，需要最大兼容性选 JPG</strong>。
      </p>

      <h2>按用途选目标格式</h2>
      <ul>
        <li>
          <strong>网页文章配图、商品照片</strong>：输出 WebP，兼顾体积和清晰度；需要兼容老系统时用 JPG。
        </li>
        <li>
          <strong>Logo、图标、带透明背景的商品图</strong>：输出 PNG 或 WebP，不要转 JPG。
        </li>
        <li>
          <strong>截图、表格、带大量文字的图片</strong>：输出 PNG，避免 JPG 在文字边缘产生杂色。
        </li>
        <li>
          <strong>旧版软件、办公文档、只收 JPG 的上传平台</strong>：输出 JPG。
        </li>
      </ul>

      <h2>批量互转的操作步骤</h2>
      <ol>
        <li>
          打开<Link href="/tools/image-format-converter">格式转换</Link>工具，图片在浏览器本地转换，不上传服务器。
        </li>
        <li>拖入图片或选择文件夹，可同时导入 JPG、PNG、WebP、AVIF，也支持 BMP、ICO、SVG。</li>
        <li>选择统一的输出格式：JPG、PNG、WebP 或 AVIF。</li>
        <li>点击开始处理，等待生成结果。</li>
        <li>抽查一两张关键图片，确认透明区域、文字边缘和颜色正常。</li>
        <li>单张下载，或打包 ZIP 下载全部结果。</li>
      </ol>

      <GuideToolCta
        href="/tools/image-format-converter"
        label="批量格式转换（本地处理，免费无水印）"
        description="JPG、PNG、WebP、AVIF 批量互转，可导入 BMP、ICO、SVG，支持单张或 ZIP 下载。"
      />

      <h2>转换时最容易踩的四个坑</h2>
      <h3>1. 透明背景转 JPG 会变白底</h3>
      <p>
        这是格式本身的限制，不是工具出错。需要透明背景时请输出 PNG 或 WebP；确实要 JPG，就要接受白色背景，或提前给图片铺好底色。
      </p>
      <h3>2. 转换不等于压缩</h3>
      <p>
        有些转换会顺带改变体积，但不能指望它一定变小。例如 JPG 转 PNG 往往更大。要控制体积，转换后再用<Link href="/tools/batch-image-compressor">批量压缩</Link>处理。
      </p>
      <h3>3. 转换不会提升清晰度</h3>
      <p>
        JPG 已经丢失的细节不会因为存成 PNG 而回来。反过来，PNG 转 JPG 有可能损失细节，质量参数不宜太低。
      </p>
      <h3>4. 不是所有格式都能原样导出</h3>
      <p>
        BMP、ICO、SVG 属于导入格式，会被转换成常用图片格式；AVIF 的导出能力取决于当前浏览器，不支持时改用 WebP 或 JPG。
      </p>

      <h2>转换后怎么快速验证</h2>
      <p>
        不用逐张检查，重点看三类：带透明背景的图，放在深色和浅色背景下各看一次边缘；带文字的截图，放大看字边是否出现彩色杂点；有渐变的照片，看天空或肤色是否出现色带。
        三类都正常，整批结果基本可以放心使用。
      </p>

      <h2>WebP 为什么有时反而更大</h2>
      <p>
        WebP 不是「一定更小」的格式。图片内容简单、颜色块大、本身已经是高质量 JPG 时，转成 WebP 有可能体积接近甚至略大。
        另外，不同浏览器和编码参数也会让结果有差异。所以转换后要看实际体积，而不是默认相信格式名。
      </p>
      <p>
        如果目标只是减小体积，正确顺序是先转 WebP 试一次，再用压缩工具把质量调到合适档位；不要指望一次格式转换解决所有体积问题。
      </p>

      <h2>转换前先确认目标平台的限制</h2>
      <p>
        上传前先看一眼平台说明，重点确认三件事：允许哪些格式、是否限制单张体积、是否支持透明背景。
        有些后台写着「支持 JPG、PNG」，实际上传 WebP 会被直接拒绝；也有平台允许 WebP，但生成缩略图时会把透明区域变成黑底。
      </p>
      <p>
        不确定时的稳妥选择是 JPG：兼容性最好，代价是没有透明背景、体积略大。网页自用则可以优先 WebP，减少加载体积。
      </p>

      <h2>格式转换和其他处理怎么配合</h2>
      <p>
        推荐顺序是：<strong>先裁剪统一构图 → 再调整尺寸 → 然后转换格式 → 最后压缩体积</strong>。
        如果先转格式再反复编辑，有损格式会累积损失；先在原始画质上完成裁剪和缩放，再一次性输出目标格式，画质最省。
      </p>
      <p>
        透明素材尤其要注意顺序：先裁掉多余区域，再转 WebP 或 PNG，避免在 JPG 上做完再发现透明通道已经丢失。
      </p>

      <h2>小结：先想用途，再选格式</h2>
      <p>
        照片用于网页，WebP 通常最划算；需要最大兼容性，JPG 最稳；透明素材和文字截图，PNG 或 WebP 更合适。
        格式本身没有绝对好坏，关键是匹配使用场景，并在转换后抽查关键细节。
      </p>
    </GuideArticle>
  );
}
