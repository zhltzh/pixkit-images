import type { ToolContent, ToolId } from "./tool-content";

export type TaskPage = {
  slug: string;
  tool: ToolId;
  initialFormat?: "image/jpeg" | "image/png" | "image/webp" | "image/avif";
  content: ToolContent;
};

export const taskPages: TaskPage[] = [
  {
    slug: "jpg-to-png",
    tool: "format",
    initialFormat: "image/png",
    content: {
      slug: "jpg-to-png", title: "JPG 转 PNG", metaTitle: "JPG 转 PNG｜免费批量转换并保留清晰度",
      description: "免费批量将 JPG、JPEG 转换为 PNG，图片在浏览器本地处理，无需上传，不覆盖原图。",
      eyebrow: "浏览器本地 JPG 转 PNG", h1: "批量将 JPG 转换为 PNG", intro: "添加多张 JPG 或 JPEG，直接生成 PNG 并单张下载或打包 ZIP。",
      aboutTitle: "如何批量把 JPG 转换成 PNG？",
      aboutText: "选择 JPG 或 JPEG 图片后，Pixkit 已默认设置为 PNG 输出。PNG 适合需要无损保存、继续编辑或兼容透明素材的工作流；但 JPG 原图本身没有透明通道，转换不会自动移除背景。",
      steps: [{ title: "添加 JPG", text: "拖入、粘贴或选择多张 JPG、JPEG 图片。" }, { title: "确认 PNG 输出", text: "输出格式已预设为 PNG，可直接开始处理。" }, { title: "下载 PNG", text: "下载单张结果，或将全部 PNG 打包为 ZIP。" }],
      facts: [{ title: "画质", text: "PNG 使用无损编码，转换过程不会再次引入 JPG 式有损压缩。" }, { title: "透明背景", text: "JPG 不含透明通道，转为 PNG 后背景仍与原图相同。" }, { title: "文件大小", text: "照片转成 PNG 后通常会变大；图形、截图和文字素材更适合 PNG。" }],
      related: ["format", "compress", "brand"],
      faq: [{ question: "JPG 转 PNG 会变清晰吗？", answer: "不会恢复 JPG 已经丢失的细节，但 PNG 输出不会继续使用 JPG 有损压缩。" }, { question: "转换后会自动变成透明背景吗？", answer: "不会。格式转换不等于抠图，原有背景仍会保留。" }, { question: "可以一次转换多张 JPG 吗？", answer: "可以，支持多选、文件夹、拖拽和 ZIP 下载。" }],
    },
  },
  {
    slug: "png-to-jpg", tool: "format", initialFormat: "image/jpeg",
    content: {
      slug: "png-to-jpg", title: "PNG 转 JPG", metaTitle: "PNG 转 JPG｜免费批量转换并减小图片体积",
      description: "在浏览器本地批量把 PNG 转换为 JPG，适合照片和不需要透明背景的网页图片。",
      eyebrow: "浏览器本地 PNG 转 JPG", h1: "批量将 PNG 转换为 JPG", intro: "把不需要透明背景的 PNG 转成兼容性良好的 JPG，处理过程无需上传。",
      aboutTitle: "PNG 转 JPG 前需要注意什么？", aboutText: "JPG 不支持透明通道，透明区域在导出时会使用白色背景。照片类 PNG 转成 JPG 往往能显著减小体积；Logo、图标和需要透明背景的素材应继续使用 PNG 或改用 WebP。",
      steps: [{ title: "添加 PNG", text: "选择一张或多张 PNG 图片。" }, { title: "确认背景", text: "检查透明区域是否适合使用白色背景。" }, { title: "转换并下载", text: "批量生成 JPG，再单张或 ZIP 下载。" }],
      facts: [{ title: "透明区域", text: "JPG 不支持透明背景，透明像素会被填充为白色。" }, { title: "适合照片", text: "照片和渐变较多的图片通常适合 JPG。" }, { title: "不适合图标", text: "文字、线条、Logo 和透明素材通常继续使用 PNG 更合适。" }],
      related: ["format", "compress", "resize"],
      faq: [{ question: "为什么 PNG 转 JPG 后背景变白？", answer: "因为 JPG 没有透明通道，透明像素必须转换为不透明颜色。" }, { question: "PNG 转 JPG 一定会变小吗？", answer: "照片通常会明显变小，但纯色图形或尺寸很小的 PNG 不一定。" }, { question: "原始 PNG 会被覆盖吗？", answer: "不会，Pixkit 只生成新的 JPG 文件。" }],
    },
  },
  {
    slug: "jpg-to-webp", tool: "format", initialFormat: "image/webp",
    content: {
      slug: "jpg-to-webp", title: "JPG 转 WebP", metaTitle: "JPG 转 WebP｜免费批量转换网页图片",
      description: "批量将 JPG 转换为 WebP，适合优化网页图片体积；浏览器本地处理，无需上传。",
      eyebrow: "网页图片格式优化", h1: "批量将 JPG 转换为 WebP", intro: "为网页、博客和商品图片生成体积更友好的 WebP。",
      aboutTitle: "为什么把 JPG 转换为 WebP？", aboutText: "WebP 通常能在相近视觉质量下减小照片体积，并获得现代浏览器的广泛支持。建议转换后抽查人物面部、文字边缘和渐变区域，再决定是否用于正式页面。",
      steps: [{ title: "导入 JPG", text: "添加需要用于网页的 JPG 或 JPEG。" }, { title: "输出 WebP", text: "页面已默认选择 WebP，可直接处理。" }, { title: "检查并下载", text: "检查结果清晰度后下载或 ZIP 打包。" }],
      facts: [{ title: "网页用途", text: "WebP 适合内容图片、商品图、封面图和缩略图。" }, { title: "兼容性", text: "现代主流浏览器已普遍支持 WebP。" }, { title: "SEO 价值", text: "更小的图片有助于减少传输量，但排名仍取决于整体页面体验和内容质量。" }],
      related: ["format", "compress", "resize"],
      faq: [{ question: "WebP 一定比 JPG 小吗？", answer: "多数照片在相近质量下会更小，但最终结果取决于图片内容和编码质量。" }, { question: "JPG 转 WebP 会影响清晰度吗？", answer: "有损输出可能产生轻微变化，建议处理后抽查关键细节。" }, { question: "能批量转换并下载吗？", answer: "可以，处理完成后支持单张下载或 ZIP 下载全部结果。" }],
    },
  },
  {
    slug: "png-to-webp", tool: "format", initialFormat: "image/webp",
    content: {
      slug: "png-to-webp", title: "PNG 转 WebP", metaTitle: "PNG 转 WebP｜批量转换并保留透明背景",
      description: "免费批量把 PNG 转为 WebP，适合减小透明图片、Logo 和网页素材体积。",
      eyebrow: "透明网页图片转换", h1: "批量将 PNG 转换为 WebP", intro: "保留透明背景的同时，为网页素材生成更轻量的 WebP。",
      aboutTitle: "PNG 转 WebP 能保留透明背景吗？", aboutText: "WebP 支持透明通道，因此多数透明 PNG 可以继续保留透明背景。对于需要像素级无损归档的原始素材，应保留 PNG 原文件；WebP 更适合作为网页交付版本。",
      steps: [{ title: "添加 PNG", text: "选择透明或不透明 PNG 图片。" }, { title: "转换为 WebP", text: "输出格式已预设为 WebP。" }, { title: "检查透明区域", text: "确认边缘和透明背景后下载结果。" }],
      facts: [{ title: "透明支持", text: "WebP 支持透明背景，适合 Logo、商品图和界面素材。" }, { title: "保留原图", text: "转换会生成新文件，不会覆盖用于设计归档的 PNG。" }, { title: "体积差异", text: "复杂透明素材通常能减小体积，简单小图的差异可能有限。" }],
      related: ["format", "compress", "brand"],
      faq: [{ question: "PNG 转 WebP 后透明背景还在吗？", answer: "通常会保留；建议下载后在深色和浅色背景上各检查一次边缘。" }, { question: "WebP 可以用于 Logo 吗？", answer: "可以用于网页展示，但建议同时保留原始 PNG 或矢量文件。" }, { question: "图片会上传服务器吗？", answer: "不会，解码和转换都在当前浏览器完成。" }],
    },
  },
  {
    slug: "webp-to-jpg", tool: "format", initialFormat: "image/jpeg",
    content: {
      slug: "webp-to-jpg", title: "WebP 转 JPG", metaTitle: "WebP 转 JPG｜免费批量转换兼容图片",
      description: "批量将 WebP 转换为 JPG，适合不支持 WebP 的软件、系统和上传平台。",
      eyebrow: "WebP 兼容格式转换", h1: "批量将 WebP 转换为 JPG", intro: "为旧软件、文档和上传平台生成兼容性更好的 JPG。",
      aboutTitle: "什么时候需要把 WebP 转换为 JPG？", aboutText: "当编辑软件、办公系统或上传平台不接受 WebP 时，可以转换为 JPG。JPG 不支持透明通道；含透明背景的 WebP 应优先转换为 PNG。",
      steps: [{ title: "添加 WebP", text: "拖入或选择多张 WebP 图片。" }, { title: "确认 JPG 输出", text: "页面已默认设置为 JPG。" }, { title: "转换并下载", text: "批量生成兼容 JPG 文件。" }],
      facts: [{ title: "软件兼容", text: "JPG 适合旧版图片软件、办公文档和多数上传平台。" }, { title: "透明限制", text: "透明 WebP 转为 JPG 后透明区域会使用白色背景。" }, { title: "原图安全", text: "WebP 原文件不会被覆盖或删除。" }],
      related: ["format", "resize", "compress"],
      faq: [{ question: "透明 WebP 应该转 JPG 还是 PNG？", answer: "需要保留透明背景时请选择 PNG；不需要透明且重视兼容性时选择 JPG。" }, { question: "转换后为什么文件可能变大？", answer: "不同格式和编码参数会产生不同体积，兼容性转换不保证文件一定更小。" }, { question: "可以转换多个文件吗？", answer: "可以，支持批量处理和 ZIP 下载。" }],
    },
  },
  {
    slug: "webp-to-png", tool: "format", initialFormat: "image/png",
    content: {
      slug: "webp-to-png", title: "WebP 转 PNG", metaTitle: "WebP 转 PNG｜批量转换并保留透明背景",
      description: "在浏览器本地批量将 WebP 转换为 PNG，适合继续编辑和保留透明背景。",
      eyebrow: "WebP 转可编辑 PNG", h1: "批量将 WebP 转换为 PNG", intro: "将 WebP 生成通用 PNG，便于设计软件编辑和透明素材归档。",
      aboutTitle: "WebP 转 PNG 会保留透明背景吗？", aboutText: "PNG 和 WebP 都支持透明通道，因此透明 WebP 通常可以继续保留透明背景。PNG 使用无损编码，文件可能比 WebP 大，但更适合继续编辑和传统设计工作流。",
      steps: [{ title: "添加 WebP", text: "选择需要编辑或归档的 WebP 图片。" }, { title: "输出 PNG", text: "页面已预设 PNG 输出。" }, { title: "检查并下载", text: "检查透明边缘后下载 PNG。" }],
      facts: [{ title: "继续编辑", text: "PNG 通常更容易被传统设计与办公软件接受。" }, { title: "透明背景", text: "透明通道通常能够保留。" }, { title: "体积", text: "PNG 文件可能明显大于原始 WebP，这是格式特性造成的。" }],
      related: ["format", "brand", "crop"],
      faq: [{ question: "WebP 转 PNG 会降低画质吗？", answer: "PNG 输出本身是无损的，但无法恢复原 WebP 编码前已经丢失的细节。" }, { question: "为什么 PNG 结果更大？", answer: "PNG 使用无损编码，照片类图片通常比 WebP 占用更多空间。" }, { question: "处理过程需要联网上传吗？", answer: "不需要，图片在浏览器本地转换。" }],
    },
  },
  {
    slug: "compress-jpg", tool: "compress", initialFormat: "image/jpeg",
    content: {
      slug: "compress-jpg", title: "压缩 JPG", metaTitle: "批量压缩 JPG｜免费减小照片文件体积",
      description: "浏览器本地批量压缩 JPG 和 JPEG，调整质量并查看预计体积，无需上传图片。",
      eyebrow: "本地批量 JPG 压缩", h1: "批量压缩 JPG 图片", intro: "统一调整 JPG 质量，在清晰度和文件大小之间取得平衡。",
      aboutTitle: "JPG 压缩质量设置多少合适？", aboutText: "网页照片可从 75%–85% 开始测试；包含小字、截图或细密纹理时应提高质量。不要只看文件大小，下载后还应检查人脸、文字边缘和渐变区域。",
      steps: [{ title: "添加 JPG", text: "一次选择多张 JPG 或 JPEG。" }, { title: "调整质量", text: "从 82% 开始，根据用途提高或降低。" }, { title: "检查结果", text: "比较清晰度和体积后下载结果。" }],
      facts: [{ title: "网页照片", text: "多数网页照片可先尝试 75%–85% 质量。" }, { title: "避免重复压缩", text: "反复压缩 JPG 会累积画质损失，应从原图重新输出。" }, { title: "保留原图", text: "Pixkit 生成新文件，原始 JPG 不会被修改。" }],
      related: ["compress", "resize", "format"],
      faq: [{ question: "JPG 压缩会变模糊吗？", answer: "有损压缩可能损失细节，质量越低越明显，建议先从 82% 左右测试。" }, { question: "为什么同样质量的文件大小不同？", answer: "图片尺寸、纹理、噪点和颜色复杂度都会影响最终体积。" }, { question: "可以同时压缩多张照片吗？", answer: "可以，统一设置后批量处理并 ZIP 下载。" }],
    },
  },
  {
    slug: "crop-image-square", tool: "crop",
    content: {
      slug: "crop-image-square", title: "图片裁剪为 1:1", metaTitle: "图片裁剪为 1:1｜批量制作方形图片",
      description: "免费批量把图片裁剪为 1:1 方形，可选择九个保留位置并旋转、翻转图片。",
      eyebrow: "批量方形图片裁剪", h1: "批量将图片裁剪为 1:1 方形", intro: "制作头像、商品主图和社交媒体方图，并选择主体保留位置。",
      aboutTitle: "如何避免 1:1 裁剪切掉图片主体？", aboutText: "Pixkit 默认使用 1:1 比例，并提供左上、上方、右上、左侧、居中、右侧、左下、下方和右下九个保留位置。可逐张保存不同构图，也可将同一设置应用到全部图片。",
      steps: [{ title: "添加图片", text: "选择需要制作方图的多张图片。" }, { title: "选择保留位置", text: "在预览图或九点定位中指定主体区域。" }, { title: "批量裁剪", text: "确认构图后生成新的 1:1 图片。" }],
      facts: [{ title: "适用场景", text: "1:1 适合头像、商品主图、作品封面和社交媒体方图。" }, { title: "九点定位", text: "主体不在中央时可选择对应位置，减少误裁。" }, { title: "逐张设置", text: "不同图片可以保存不同的裁剪位置和旋转方向。" }],
      related: ["crop", "resize", "brand"],
      faq: [{ question: "可以选择裁剪保留的位置吗？", answer: "可以，支持九个位置，也可以直接点击预览图选择区域。" }, { question: "所有图片必须使用同一位置吗？", answer: "不必，可以逐张保存设置，也可以一键应用到全部图片。" }, { question: "裁剪后会覆盖原图吗？", answer: "不会，结果会作为新文件下载。" }],
    },
  },
];

export function taskPageFromSlug(slug: string) {
  return taskPages.find((page) => page.slug === slug);
}
