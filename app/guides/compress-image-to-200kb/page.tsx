import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "../../site-config";
import { getGuideBySlug } from "../guide-data";
import { GuideArticle, GuideToolCta } from "../guide-article";

const guide = getGuideBySlug("compress-image-to-200kb")!;
const url = absoluteUrl(`/guides/${guide.slug}/`);
const title = "图片怎么压缩到 200KB 以内？按这个顺序试｜Pixkit";

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
    q: "能把图片精确压到 200KB 吗？",
    a: "工具按质量和格式压缩，不能输入目标体积。做法是逐步调低质量并查看结果，通常两三分钟就能落到 200KB 以内。",
  },
  {
    q: "为什么 PNG 照片压缩效果很差？",
    a: "PNG 使用无损编码，质量滑杆对它的影响有限。照片改用 WebP 或 JPG 往往能大幅减小体积。",
  },
  {
    q: "压缩后图片会变模糊吗？",
    a: "质量越低细节损失越明显。建议从 82% 开始，逐级下调，每次下载后放大检查文字和边缘。",
  },
  {
    q: "图片会上传到服务器吗？",
    a: "不会。解码、压缩和导出都在当前浏览器中完成，适合证件、合同等不便外传的素材。",
  },
  {
    q: "可以一次压缩多张图片吗？",
    a: "可以。统一设置格式和质量后批量处理，再单张下载或打包为 ZIP。",
  },
];

export default function CompressImageTo200KbPage() {
  return (
    <GuideArticle guide={guide} faq={faq}>
      <p>
        报名系统、投稿后台、表单附件经常限制单张图片不超过 200KB。很多人第一反应是截图再存一遍，结果文字糊了、体积也没降多少。把图片压缩到 200KB 以内其实有固定顺序：
        <strong>先调质量，再换格式，最后才动尺寸</strong>。下面按这个顺序说明每步该怎么做。
      </p>

      <h2>先分清：200KB 限制的是文件体积</h2>
      <p>
        一张图片的体积由三部分决定：像素尺寸、文件格式和编码质量。像素越多、细节越密，压缩后能省的空间越有限。
        所以同一张照片，压到 200KB 可能很轻松，也可能怎么压都差一点，关键看原图本身有多大、多复杂。
      </p>

      <h2>压缩工具实际能调的两个参数</h2>
      <ul>
        <li>
          <strong>输出格式</strong>：可以保持原格式，也可以统一输出 JPG、PNG、WebP 或 AVIF。照片优先 WebP 或 JPG，需要透明背景时选 WebP 或 PNG。
        </li>
        <li>
          <strong>质量</strong>：数值越低体积越小，细节损失越明显。网页照片通常从 75% 到 85% 开始试。
        </li>
      </ul>
      <p>
        需要说明的是：<strong>工具没有「输入 200KB 自动压到目标体积」的选项</strong>。它不会为了凑数字反复重编码，而是按你设置的质量输出。所以操作上要「压一次、看一次体积」，这比盲目找一键目标值更快。
      </p>

      <h2>具体操作步骤</h2>
      <ol>
        <li>
          打开<Link href="/tools/batch-image-compressor">批量压缩</Link>工具。图片在浏览器本地处理，不会上传。
        </li>
        <li>拖入需要压缩的图片，支持一次多选或选择整个文件夹。</li>
        <li>输出格式先选「保持原格式」或 JPG，质量填 82% 左右。</li>
        <li>点击「开始处理 →」，查看每张图片压缩后的体积。</li>
        <li>如果结果仍超过 200KB，把质量往下调到 70%、60% 再试一次。</li>
        <li>达到要求的图片单张下载，或打包成 ZIP 一次取回。</li>
      </ol>

      <GuideToolCta
        href="/tools/batch-image-compressor"
        label="批量压缩图片（本地处理，可保持原格式或转 WebP）"
        description="统一设置格式与质量，一次压缩多张图片，处理完直接看体积，可单张或 ZIP 下载。"
      />

      <h2>压不到 200KB，按这个顺序继续</h2>
      <ol>
        <li>
          <strong>PNG 照片先换格式</strong>：照片类 PNG 转成 JPG 或 WebP，体积经常直接减半以上。
        </li>
        <li>
          <strong>质量逐级下调</strong>：82% → 70% → 60%。每次只降一档，方便判断画质还能不能接受。
        </li>
        <li>
          <strong>降低宽度</strong>：很多上传场景只在小窗口里预览，把 3000 像素宽缩到 1200 像素，比继续压质量更有效。用<Link href="/tools/batch-image-resizer">批量调整尺寸</Link>一次处理。
        </li>
        <li>
          <strong>裁掉无关区域</strong>：截图里的大片空白、照片边缘的杂物都会占用体积，用<Link href="/tools/batch-image-crop-rotate">批量裁剪</Link>去掉后重新压缩。
        </li>
        <li>
          <strong>换 WebP 收尾</strong>：如果平台支持 WebP 上传，通常还能再省一截体积。
        </li>
      </ol>

      <h2>别为了体积把文字压糊</h2>
      <p>
        压缩对照片很友好，对文字和线条就没那么宽容。截图、表格、带小字的证明文件，质量压到 60% 以下容易在文字边缘出现杂色和毛刺。
        这类图片建议优先降低尺寸或裁剪，而不是一味压质量；如果必须保留全文清晰度，宁可拆成两张图分次上传。
      </p>
      <p>
        另外，压缩不会改变原图。生成的始终是新文件，原始图片可以留着作为归档版本，后续需要更高清时随时重来。
      </p>

      <h2>不同图片类型怎么处理</h2>
      <ul>
        <li>
          <strong>手机或相机拍的照片</strong>：这类图体积最大，也最耐压。先按 82% 试，超标再降到 70%，一般不需要动尺寸就能落到 200KB 附近。
        </li>
        <li>
          <strong>截图、聊天记录、表格</strong>：文字多、细节密，质量不宜低于 60%。优先降低宽度或裁掉无关部分，保住字迹清晰。
        </li>
        <li>
          <strong>带透明背景的素材</strong>：需要保留透明就输出 WebP，不要转 JPG。PNG 保持原格式时质量参数影响有限，体积下降会比较慢。
        </li>
        <li>
          <strong>纯色图标、Logo</strong>：本身体积就小，通常不需要为 200KB 发愁；如果确实超标，多半是原图尺寸过大。
        </li>
      </ul>

      <h2>压缩前后怎么快速对比</h2>
      <p>
        不要只看数字。压缩完成后，把原图和结果并排打开，重点看三个地方：人脸和皮肤过渡有没有色块、文字边缘有没有彩色毛刺、天空和渐变有没有出现条纹。
        这三处正常，说明当前质量可以接受；如果第一眼就能看出差别，回到工具把质量提高一档，再牺牲一点体积换回画质。
      </p>
      <p>
        还有一个常被忽略的点：压缩后的图片如果还要继续编辑，尽量保留原图。反复打开有损压缩的结果再保存，画质会一次次叠加损失，最后很难救回来。
      </p>

      <h2>小结：200KB 不是死磕出来的</h2>
      <p>
        处理顺序很清楚：先换更省体积的格式，再调质量，然后降尺寸、裁区域，最后用 WebP 收尾。多数照片在第二步就能达到目标，只有分辨率特别高的原图才需要走到第三步。
        按这个顺序做，既不会一开始就把画质压坏，也不用反复猜参数。
      </p>
    </GuideArticle>
  );
}
