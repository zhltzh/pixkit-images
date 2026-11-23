import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "../../site-config";
import { getGuideBySlug } from "../guide-data";
import { GuideArticle, GuideToolCta } from "../guide-article";

const guide = getGuideBySlug("batch-rename-images")!;
const url = absoluteUrl(`/guides/${guide.slug}/`);
const title = "图片怎么批量重命名？统一前缀加顺序编号｜Pixkit";

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
    q: "批量重命名会覆盖原图吗？",
    a: "不会。工具生成的是新文件，原名保持不变，下载后按新名字保存即可。",
  },
  {
    q: "文件名里的特殊字符怎么处理？",
    a: "Windows 不允许的字符，例如反斜杠、冒号、星号、问号和尖括号，会自动替换为短横线，避免下载后无法打开。",
  },
  {
    q: "编号顺序由什么决定？",
    a: "按导入顺序编号。用资源管理器多选通常会按文件名顺序导入，导入后看一眼缩略图顺序即可确认。",
  },
  {
    q: "可以只重命名、不压缩不加水印吗？",
    a: "可以。文字水印留空、不选择水印图片，工具就只整理输出文件名。",
  },
  {
    q: "支持中文前缀吗？",
    a: "支持，但用于网页或跨系统传输时，建议使用小写英文、数字和短横线，兼容性最好。",
  },
];

export default function BatchRenameImagesPage() {
  return (
    <GuideArticle guide={guide} faq={faq}>
      <p>
        相机导出的文件名是一串编号，微信保存的图片叫「微信图片_2024xxxx」，客户给的素材则是「新建文件夹 (2)」。等到要上传、归档或交付时，
        文件名混乱比图片本身更浪费时间。图片批量重命名不需要写脚本，用统一前缀加顺序编号就能一次整理完整批文件。
      </p>

      <h2>什么时候该批量重命名</h2>
      <ul>
        <li>
          <strong>电商上架</strong>：主图、细节图、场景图需要按顺序对应商品，文件名最好能看出顺序。
        </li>
        <li>
          <strong>相册归档</strong>：旅行、活动、婚礼照片按日期或地点统一命名，之后检索方便。
        </li>
        <li>
          <strong>交付客户</strong>：设计稿、样片用统一前缀交付，显得专业，也方便对方排序查看。
        </li>
        <li>
          <strong>避免特殊字符</strong>：空格、中文标点、括号在部分系统或网页上传时会出问题。
        </li>
      </ul>

      <h2>命名规则怎么定</h2>
      <p>
        一条好用的规则通常包含「前缀 + 两位编号」，例如 <strong>product-01、product-02</strong>。前缀说明这是什么，编号保证顺序稳定。
      </p>
      <ul>
        <li>前缀用<strong>小写英文、数字和短横线</strong>，跨系统兼容性最好。</li>
        <li>编号至少两位，超过 99 张时用三位，避免排序时 10 排在 2 前面。</li>
        <li>不要在文件名里写空格和中文标点，部分上传系统会转义或直接拒绝。</li>
        <li>同一次交付只用一套前缀，不同批次换前缀区分。</li>
      </ul>
      <p>
        如果前缀里包含 <strong>\ / : * ? &quot; &lt; &gt; |</strong> 这类字符，工具会自动替换成短横线，避免生成无法保存的文件名。
      </p>

      <h2>只改名、不加水印的操作步骤</h2>
      <ol>
        <li>
          打开<Link href="/tools/batch-image-watermark-rename">水印命名</Link>工具，整个处理在浏览器本地完成。
        </li>
        <li>导入需要整理的图片，可以多选，也可以选择整个文件夹。</li>
        <li>在「文件名前缀」里填入统一名称，例如 product。</li>
        <li>确认「右下角文字水印」留空，并且没有选择水印图片。</li>
        <li>点击开始处理，结果会按 product-01、product-02 的顺序命名。</li>
        <li>单张下载或打包 ZIP，ZIP 文件名也会使用同一前缀。</li>
      </ol>

      <GuideToolCta
        href="/tools/batch-image-watermark-rename"
        label="批量重命名（浏览器本地处理，免费无水印）"
        description="统一前缀加顺序编号，文字和水印留空即只改名，可打包 ZIP 一次下载。"
      />

      <h2>编号顺序从哪里来</h2>
      <p>
        编号按导入顺序生成。用资源管理器多选文件时，系统通常按名称排序加入列表；用「选择文件夹」导入时同样如此。
        所以如果编号和预期不一致，多半是原文件名排序不同，而不是工具随机编号。
      </p>
      <p>
        需要严格顺序时有两个办法：先按想要的顺序把文件重命名成临时编号再导入，或者在导入后查看缩略图顺序，确认无误再处理。批量操作前多看一眼，比下载后返工省事。
      </p>

      <h2>会不会覆盖原图</h2>
      <p>
        不会。重命名作用在输出文件上，原始图片仍保留原来的名字和内容。下载后的新文件是独立副本，可以放心对比新旧两套命名。
      </p>

      <h2>几种常见命名方案</h2>
      <ul>
        <li>
          <strong>商品图</strong>：product-01 到 product-12，主图单独用 product-main。
        </li>
        <li>
          <strong>活动照片</strong>：event-2026-01、event-2026-02，前缀带年份便于归档。
        </li>
        <li>
          <strong>设计交付</strong>：clientname-banner-01，前缀写客户名，后缀写用途。
        </li>
        <li>
          <strong>网页素材</strong>：hero、thumb-01、thumb-02，简短且全小写，方便写进代码。
        </li>
      </ul>
      <p>
        命名只是整理的第一步。同一批图片还需要统一尺寸或体积时，可以接着用<Link href="/tools/batch-image-resizer">批量调整尺寸</Link>和
        <Link href="/tools/batch-image-compressor">批量压缩</Link>处理，最后再统一命名，避免中间过程产生多套文件名。
      </p>

      <h2>为什么不建议直接在系统里全选重命名</h2>
      <p>
        Windows 和 macOS 都支持全选后统一改名，但它只会生成「名字 (1)」「名字 (2)」这样的结果，顺序由系统决定，也无法指定前缀格式或统一扩展名写法。
        更重要的是，系统重命名是直接在原文件上修改，一旦顺序错了，想恢复原来的名字很麻烦。
      </p>
      <p>
        用工具生成新文件则安全得多：原名不动，新名字是另一份副本，确认顺序和格式都满意后再决定保留哪一套。对需要交给客户或上传平台的素材，这一点尤其重要。
      </p>

      <h2>重命名之后的检查清单</h2>
      <ul>
        <li>名字是否符合目标平台要求：小写、无空格、无中文标点。</li>
        <li>编号是否连续，有没有因为跳过失败图片而出现断号。</li>
        <li>扩展名是否和实际格式一致，例如 JPG 与 JPEG 混用是否需要统一。</li>
        <li>ZIP 包解开后是否按名字自然排序，方便对方浏览。</li>
      </ul>
      <p>
        这四项检查花不了一分钟，却能避免上传后被平台退回、或客户打开压缩包发现顺序错乱的情况。
      </p>

      <h2>小结：先定规则，再批量执行</h2>
      <p>
        批量重命名本身只是一次操作，真正决定效果的是命名规则。前缀写清楚「是什么」，编号写清楚「第几张」，跨系统时避开特殊字符，
        剩下的交给工具完成即可。规则定好一次，之后每批素材都能复用同一套命名方式。
      </p>
    </GuideArticle>
  );
}
