import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "../../site-config";
import { getGuideBySlug } from "../guide-data";
import { GuideArticle, GuideToolCta } from "../guide-article";

const guide = getGuideBySlug("add-watermark-to-images")!;
const url = absoluteUrl(`/guides/${guide.slug}/`);
const title = "图片怎么批量加水印？文字与品牌图两种做法｜Pixkit";

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
    q: "可以同时加文字水印和图片水印吗？",
    a: "可以。文字水印在右下角，图片水印在右上角，两者互不冲突，也可以只用其中一种。",
  },
  {
    q: "图片水印的大小和透明度能调吗？",
    a: "能。选择水印图片后，处理前可以调整它的相对大小和透明度，缩略图会实时预览。",
  },
  {
    q: "可以只重命名、不加任何水印吗？",
    a: "可以。文字留空、不选择水印图片，工具就只做批量文件名整理。",
  },
  {
    q: "水印图片会上传吗？",
    a: "不会。水印绘制和文件生成都在当前浏览器完成，品牌图同样留在设备里。",
  },
  {
    q: "加水印能防止别人盗图吗？",
    a: "只能降低被直接使用的可能。水印可以被裁掉或修掉，重要素材仍建议保留原图并保留发布记录。",
  },
];

export default function AddWatermarkToImagesPage() {
  return (
    <GuideArticle guide={guide} faq={faq}>
      <p>
        图片发到网上后，被保存、转发、二次使用几乎是必然的。加一层水印不能彻底防盗，但能让对方知道来源，也能避免品牌素材被误认为无主图。
        批量给图片加水印有两种做法：<strong>右下角文字水印</strong>和<strong>右上角品牌图片水印</strong>。下面说明参数怎么定、怎么一次套用到整批图片。
      </p>

      <h2>水印解决什么，不解决什么</h2>
      <p>
        水印主要起标记作用：标明版权归属、品牌名称、拍摄时间或内部文件编号。它能减少「顺手拿走」的情况，但挡不住有心人裁剪或修图。
        所以水印的定位应该是<strong>声明来源</strong>，而不是安全措施。真正重要的原图，仍然要自己留档。
      </p>

      <h2>两种水印怎么选</h2>
      <ul>
        <li>
          <strong>右下角文字水印</strong>：适合写「© 品牌名」「样片 · 请勿商用」、拍摄日期或联系方式。文字内容随时能改，最灵活。
        </li>
        <li>
          <strong>右上角图片水印</strong>：放品牌 Logo 或印章图，视觉上更正式。支持调整大小和透明度，适合商品图和作品集。
        </li>
      </ul>
      <p>两者可以叠加：右下角写文字说明，右上角放 Logo。不过叠加之后画面元素变多，参数要更克制。</p>

      <h2>大小和透明度怎么定</h2>
      <p>
        水印的第一原则是不抢主体。文字水印别写太长，一行以内最好；图片水印从较小的比例开始试，确认不遮挡商品或人脸再放大。
        透明度方面，能看清又不刺眼是关键，通常保持半透明即可，纯白或纯黑满透明度很容易变成画面里的「补丁」。
      </p>
      <p>
        还要考虑背景色。深色照片上用白字，浅色背景上用深色字；透明 PNG 素材加水印时，先放在不同底色上看一遍，避免某一种背景下完全看不见。
      </p>

      <h2>具体操作步骤</h2>
      <ol>
        <li>
          打开<Link href="/tools/batch-image-watermark-rename">水印命名</Link>工具，图片和水印都在浏览器本地处理。
        </li>
        <li>导入需要加标识的图片，支持拖拽和选择文件夹。</li>
        <li>在「右下角文字水印」里输入要显示的文字，例如「© 品牌名」。</li>
        <li>需要 Logo 时，在「右上角图片水印」选择一张 PNG、WebP、JPG、SVG、BMP 或 ICO 图片。</li>
        <li>调整图片水印的大小和透明度，看缩略图预览效果。</li>
        <li>点击开始处理，确认无误后单张下载或打包 ZIP。</li>
      </ol>

      <GuideToolCta
        href="/tools/batch-image-watermark-rename"
        label="批量添加水印并重命名（本地处理，免费无水印）"
        description="右下角文字水印 + 右上角品牌图水印，可调大小与透明度，同时统一输出文件名。"
      />

      <h2>三个容易忽略的注意点</h2>
      <h3>1. 水印位置要避开平台裁切</h3>
      <p>
        有些平台会把图片裁成正方形或加圆角。水印贴边太近，可能在展示时被切掉。留出一点边距，比贴着角落更稳。
      </p>
      <h3>2. 批量前先处理一张</h3>
      <p>
        同一组参数应用到几十张图片前，先看一张最亮和一张最暗的效果。亮度差异大的照片，水印的可读性会明显不同。
      </p>
      <h3>3. 原图不要加水印</h3>
      <p>
        水印是发布版本的处理，不是归档版本。原始文件保持干净，后续换 Logo、改文案、做印刷时才有退路。工具生成的是新文件，原图不会被覆盖。
      </p>

      <h2>顺便把文件名也统一</h2>
      <p>
        同一个工具还能设置输出文件名前缀，结果会按前缀加顺序编号命名。加完水印直接得到「品牌名-01、品牌名-02」这样整齐的文件，上传时不用再改名字。
        如果只需要整理文件名，把文字水印留空、不选择水印图片即可，具体做法见<a href="/guides/batch-rename-images">图片怎么批量重命名</a>。
      </p>

      <h2>文字水印写什么内容</h2>
      <p>
        文字水印不是越长越好。右下角本来就不宽，写满两行会把画面压得很拥挤。常见写法有三类：
      </p>
      <ul>
        <li>
          <strong>版权声明</strong>：© 加年份和名称，例如「© 2026 品牌名」，适合作品集和商品图。
        </li>
        <li>
          <strong>用途说明</strong>：样片、预览、内部资料，提醒对方这不是最终版本。
        </li>
        <li>
          <strong>联系信息</strong>：网址、店铺名或邮箱，适合需要被主动联系的素材。
        </li>
      </ul>
      <p>
        同一批图片里，水印文字保持一致，才能形成统一标识。不同系列的素材可以换前缀，但不要把一句话拆成多种写法，否则看起来像拼接素材。
      </p>

      <h2>批量加水印的正确心态</h2>
      <p>
        水印是发布环节的最后一步，不是修图的第一步。先把图片尺寸、比例、格式处理好，最后统一加水印和重命名，能避免前面每改一次都带着水印返工。
        处理完成后抽两张放大检查，确认水印没有压住主体、没有超出画面，就可以直接使用了。
      </p>
    </GuideArticle>
  );
}
