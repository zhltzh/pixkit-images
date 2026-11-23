/**
 * 教程（guides）元数据。
 * 正文在 app/guides/<slug>/page.tsx，这里只存列表、SEO 与互链需要的信息。
 */
export interface GuideMeta {
  slug: string;
  /** 页面 H1 与 metadata title（不含站点后缀） */
  title: string;
  /** meta description，150 字以内 */
  description: string;
  /** 列表页卡片摘要 */
  summary: string;
  /** 对应站内工具 slug */
  toolSlug: string;
  toolName: string;
  /** 建议 3 个，必须存在于本列表，避免死链 */
  related: string[];
  datePublished: string;
  dateModified: string;
}

export const GUIDE_LIST_PATH = "/guides";

const PUBLISHED = "2026-11-23";
const MODIFIED = "2026-11-23";

export const GUIDES: GuideMeta[] = [
  {
    slug: "batch-resize-images",
    title: "图片怎么批量改尺寸？一次统一 50 张的宽度",
    description:
      "几十张图片宽度参差不齐？本文讲清目标宽度怎么定、等比例缩放怎么避免变形，以及在浏览器里一次批量调整图片尺寸并打包下载的完整步骤。",
    summary: "目标宽度怎么定、等比例怎么保持，50 张图片一次处理完。",
    toolSlug: "batch-image-resizer",
    toolName: "批量调整尺寸",
    related: ["compress-image-to-200kb", "crop-images-to-square", "jpg-png-webp-conversion"],
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
  },
  {
    slug: "compress-image-to-200kb",
    title: "图片怎么压缩到 200KB 以内？按这个顺序试",
    description:
      "上传平台要求图片小于 200KB？本文说明质量和格式怎么调、为什么 PNG 压不动，以及压缩不达标时先改尺寸再换格式的处理顺序。",
    summary: "从质量参数到改尺寸，压到 200KB 以内的处理顺序。",
    toolSlug: "batch-image-compressor",
    toolName: "批量压缩",
    related: ["batch-resize-images", "jpg-png-webp-conversion", "add-watermark-to-images"],
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
  },
  {
    slug: "jpg-png-webp-conversion",
    title: "JPG、PNG、WebP 怎么互转？批量格式转换指南",
    description:
      "照片、透明素材、网页配图该用哪种格式？本文对比 JPG、PNG、WebP 的透明支持、体积和兼容性，并给出批量互转的具体操作步骤。",
    summary: "透明、体积、兼容性三方面对比，选对格式再批量转换。",
    toolSlug: "image-format-converter",
    toolName: "格式转换",
    related: ["compress-image-to-200kb", "batch-resize-images", "crop-images-to-square"],
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
  },
  {
    slug: "crop-images-to-square",
    title: "图片怎么裁剪成 1:1 正方形？批量统一比例",
    description:
      "电商主图、头像、封面需要统一比例？本文讲 1:1、4:3、16:9 怎么选，九个保留位置怎么用，避免批量裁剪时切掉图片主体。",
    summary: "九宫格定位保住主体，1:1、16:9 比例批量统一。",
    toolSlug: "batch-image-crop-rotate",
    toolName: "裁剪旋转",
    related: ["batch-resize-images", "add-watermark-to-images", "compress-image-to-200kb"],
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
  },
  {
    slug: "add-watermark-to-images",
    title: "图片怎么批量加水印？文字与品牌图两种做法",
    description:
      "给图片加文字水印或品牌图片水印，防止素材被随意转发。本文说明水印位置、大小、透明度怎么设置，以及一次应用到全部图片的步骤。",
    summary: "右下角文字、右上角图片水印，一次套用到全部图片。",
    toolSlug: "batch-image-watermark-rename",
    toolName: "水印命名",
    related: ["batch-rename-images", "batch-resize-images", "compress-image-to-200kb"],
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
  },
  {
    slug: "batch-rename-images",
    title: "图片怎么批量重命名？统一前缀加顺序编号",
    description:
      "商品图、相册、交付文件的文件名混乱？用统一前缀加顺序编号批量重命名，本文讲清排序依据、非法字符处理以及如何避免覆盖原图。",
    summary: "统一前缀加 01、02 编号，导入顺序就是命名顺序。",
    toolSlug: "batch-image-watermark-rename",
    toolName: "水印命名",
    related: ["add-watermark-to-images", "batch-resize-images", "crop-images-to-square"],
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
  },
];

export function getGuideBySlug(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug);
}

export function guideUrl(slug: string) {
  return `/guides/${slug}/`;
}
