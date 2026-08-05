export type ToolId = "format" | "compress" | "resize" | "crop" | "brand";

export type ToolContent = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  aboutTitle: string;
  aboutText: string;
  steps: { title: string; text: string }[];
  facts: { title: string; text: string }[];
  related: ToolId[];
  faq: { question: string; answer: string }[];
};

export const toolContent: Record<ToolId, ToolContent> = {
  format: {
    slug: "image-format-converter",
    title: "格式转换",
    metaTitle: "免费批量图片格式转换｜JPG、PNG、WebP、AVIF",
    description: "在浏览器本地批量转换 JPG、JPEG、PNG、WebP 和 AVIF，也可导入 BMP、ICO、SVG 转为常用图片格式。",
    eyebrow: "本地批量图片格式转换",
    h1: "批量转换 JPG、PNG、WebP 和 AVIF",
    intro: "一次添加多张图片，统一输出 JPG、PNG、WebP 或 AVIF；也可导入 BMP、ICO、SVG。",
    aboutTitle: "如何批量转换 JPG、PNG、WebP 和 AVIF 图片？",
    aboutText: "添加 JPG、JPEG、PNG、WebP、AVIF、BMP、ICO 或 SVG 后，选择统一输出格式再开始批量处理。BMP、ICO、SVG 属于导入格式，会转换为 JPG、PNG、WebP 或 AVIF。需要透明背景时优先选择 PNG 或 WebP。",
    steps: [
      { title: "添加图片", text: "拖入 JPG、JPEG、PNG、WebP、AVIF、BMP、ICO 或 SVG，支持多选和文件夹。" },
      { title: "选择输出格式", text: "根据兼容性、透明背景和文件体积选择 JPG、PNG、WebP 或 AVIF。" },
      { title: "转换并下载", text: "开始批量处理，完成后单张下载或打包为 ZIP。" },
    ],
    facts: [
      { title: "透明背景", text: "PNG、WebP 和 AVIF 可以保留透明背景；JPG 不支持透明通道。" },
      { title: "浏览器兼容性", text: "WebP 的通用性较好；AVIF 导出能力取决于当前浏览器。" },
      { title: "原图安全", text: "格式转换会生成新文件，不会覆盖或修改原始图片。" },
      { title: "导入与输出", text: "BMP、ICO、SVG 可以导入转换；主要输出格式为 JPG、PNG、WebP 和 AVIF。" },
    ],
    related: ["compress", "resize", "crop"],
    faq: [
      { question: "转换图片会改变原图吗？", answer: "不会。Pixkit 会生成新的结果文件，原始图片保持不变。" },
      { question: "哪些格式可以保留透明背景？", answer: "PNG、WebP 和 AVIF 可以支持透明背景；转换为 JPG 时透明区域需要填充背景色。" },
      { question: "为什么浏览器无法导出 AVIF？", answer: "AVIF 编码能力由浏览器提供；不支持时可以改用 WebP、PNG 或 JPG。" },
      { question: "BMP、ICO 和 SVG 可以保持原格式输出吗？", answer: "当前将它们作为导入格式使用；处理后请选择 JPG、PNG、WebP 或 AVIF 输出。" },
    ],
  },
  compress: {
    slug: "batch-image-compressor",
    title: "批量压缩",
    metaTitle: "免费批量压缩图片｜本地压缩 JPG、PNG、WebP",
    description: "无需上传，在浏览器中批量压缩 JPG、PNG、WebP 和 AVIF 图片，可保持原格式或转换为更小的 WebP、AVIF。",
    eyebrow: "浏览器本地图片压缩",
    h1: "批量压缩图片，减少文件体积",
    intro: "统一设置输出格式与图片质量，在清晰度和文件大小之间取得合适平衡。",
    aboutTitle: "怎样批量压缩图片并尽量保持清晰？",
    aboutText: "添加图片后选择保持原格式或输出为 WebP、AVIF、JPG、PNG，再调整质量参数。照片通常适合 WebP 或 JPG；透明素材适合 PNG 或 WebP。建议先从 75%–85% 质量开始。",
    steps: [
      { title: "导入图片", text: "一次选择多张 JPG、PNG、WebP 或 AVIF 图片。" },
      { title: "选择格式与质量", text: "保持原格式，或选择 WebP、AVIF、JPG、PNG，再从 82% 左右开始调整质量。" },
      { title: "压缩并下载", text: "批量生成压缩结果，再下载单张图片或 ZIP 文件。" },
    ],
    facts: [
      { title: "质量与体积", text: "质量数值降低通常会减小文件，但过低可能产生模糊或色块。" },
      { title: "照片格式", text: "照片通常使用 WebP 或 JPG 能获得更明显的体积优化。" },
      { title: "PNG 压缩", text: "PNG 保持原格式时质量滑杆影响有限；需要明显减小体积可选择支持透明背景的 WebP。" },
    ],
    related: ["format", "resize", "brand"],
    faq: [
      { question: "压缩图片会上传到服务器吗？", answer: "不会。图片在当前浏览器中解码、压缩和生成。" },
      { question: "质量数值越高越好吗？", answer: "数值越高通常保留更多细节，但文件也更大；网页图片通常需要在清晰度与体积之间平衡。" },
      { question: "为什么 PNG 压缩效果不明显？", answer: "PNG 适合透明图和图形素材。照片改用 WebP 或 JPG 往往能获得更小体积。" },
    ],
  },
  resize: {
    slug: "batch-image-resizer",
    title: "调整尺寸",
    metaTitle: "批量调整图片尺寸｜等比例缩放 JPG、PNG、WebP",
    description: "在浏览器本地批量调整图片宽度和尺寸，等比例缩放，不修改原图。",
    eyebrow: "批量图片尺寸调整",
    h1: "批量调整图片尺寸和宽度",
    intro: "为多张图片设置统一最大宽度，自动保持原始比例。",
    aboutTitle: "如何批量调整图片尺寸而不变形？",
    aboutText: "设置统一最大宽度后，Pixkit 会按原始宽高比计算输出尺寸。默认只缩小较大的图片，避免小图被放大后失真。",
    steps: [
      { title: "添加多张图片", text: "拖入图片或选择包含图片的文件夹。" },
      { title: "设置最大宽度", text: "输入目标宽度或选择 800、1200、1600、1920 像素预设。" },
      { title: "缩放并下载", text: "按原始比例批量缩小图片，再统一下载结果。" },
    ],
    facts: [
      { title: "保持比例", text: "高度会依据原始宽高比自动计算，避免图片被拉伸。" },
      { title: "避免放大", text: "默认不放大小图片，减少模糊、锯齿和无意义的文件增大。" },
      { title: "网页用途", text: "内容图常用 1200–1600 像素，具体尺寸应匹配页面实际展示宽度。" },
    ],
    related: ["compress", "crop", "format"],
    faq: [
      { question: "调整宽度后图片会变形吗？", answer: "不会。启用等比例缩放时，图片高度会根据原始宽高比自动计算。" },
      { question: "可以把小图片放大吗？", answer: "当前默认不放大小图，以避免产生明显模糊和锯齿。" },
      { question: "适合网页使用的图片宽度是多少？", answer: "常见内容图片可使用 1200 或 1600 像素；具体应根据页面容器和高分辨率显示需求决定。" },
    ],
  },
  crop: {
    slug: "batch-image-crop-rotate",
    title: "裁剪旋转",
    metaTitle: "批量裁剪与旋转图片｜统一图片比例",
    description: "在浏览器中批量裁剪图片比例、选择保留区域、旋转或翻转图片，支持常用方形、横向和竖向比例。",
    eyebrow: "批量裁剪与旋转",
    h1: "批量裁剪图片并统一旋转方向",
    intro: "统一图片比例，选择需要保留的画面区域，并批量旋转或翻转方向。",
    aboutTitle: "如何批量裁剪图片为统一比例？",
    aboutText: "选择 1:1、4:3、3:4、16:9 或 9:16 后，可以从九个位置中指定需要保留的画面区域，并统一旋转 90、180、270 度或水平、垂直翻转。",
    steps: [
      { title: "添加图片", text: "选择需要统一构图或方向的多张图片。" },
      { title: "设置构图和方向", text: "选择裁剪比例、保留区域，再设置旋转角度或翻转方向。" },
      { title: "预览并处理", text: "确认构图后批量生成新图片，原始文件保持不变。" },
    ],
    facts: [
      { title: "九点定位", text: "可选择左上、上方、右上、左侧、居中、右侧、左下、下方或右下作为保留区域。" },
      { title: "常用比例", text: "1:1 适合头像和商品图，16:9 适合横屏，9:16 适合竖屏内容。" },
      { title: "组合处理", text: "裁剪、旋转和翻转可以一次完成，减少重复导出造成的画质损失。" },
    ],
    related: ["resize", "format", "brand"],
    faq: [
      { question: "批量裁剪可以选择保留哪个位置吗？", answer: "可以。Pixkit 提供九个裁剪位置，适合主体位于不同区域的图片。" },
      { question: "裁剪会覆盖原始图片吗？", answer: "不会。裁剪和旋转结果会作为新文件下载。" },
      { question: "可以同时裁剪、旋转和翻转吗？", answer: "可以。三类操作会在一次批量处理中完成并生成新文件。" },
    ],
  },
  brand: {
    slug: "batch-image-watermark-rename",
    title: "水印命名",
    metaTitle: "批量添加图片水印与重命名｜浏览器本地处理",
    description: "无需上传，批量添加文字水印或品牌图片水印，调整图片水印大小与透明度，并统一重命名。",
    eyebrow: "批量水印与文件整理",
    h1: "批量添加图片水印并统一重命名",
    intro: "添加右下角文字或右上角品牌图片水印，同时整理输出文件名。",
    aboutTitle: "如何批量添加文字或图片水印并重命名？",
    aboutText: "输入文字水印或选择一张品牌图片，可调整图片水印大小与透明度。Pixkit 会把水印应用到全部图片，并按统一前缀和顺序编号输出；原图不会被覆盖。",
    steps: [
      { title: "导入待处理图片", text: "选择需要统一品牌标识或文件名称的多张图片。" },
      { title: "设置水印和前缀", text: "输入文字、选择品牌图片，调整透明度与大小，并设置输出文件名前缀。" },
      { title: "生成并整理", text: "批量绘制文字或图片水印、顺序命名，并打包下载。" },
    ],
    facts: [
      { title: "两种水印", text: "支持右下角文字水印和右上角图片水印，可同时使用。" },
      { title: "批量命名", text: "输出文件会使用统一前缀和顺序编号，便于归档与上传。" },
      { title: "本地预览", text: "水印图片留在当前设备，处理前可在缩略图查看大小和透明度效果。" },
    ],
    related: ["resize", "compress", "crop"],
    faq: [
      { question: "水印图片会上传到服务器吗？", answer: "不会。水印绘制和文件重命名都在当前浏览器中完成。" },
      { question: "可以只重命名而不加水印吗？", answer: "可以。文字留空且不选择水印图片，即可只批量整理文件名。" },
      { question: "图片水印可以调整大小和透明度吗？", answer: "可以。选择水印图片后，可以在处理前调整其相对大小与透明度。" },
    ],
  },
};

export const homeContent: ToolContent = {
  slug: "",
  title: "Pixkit",
  metaTitle: "Pixkit 批量图片处理工具",
  description: "浏览器本地批量转换、压缩、调整尺寸、裁剪和添加水印，支持导入 JPG、PNG、WebP、AVIF、BMP、ICO、SVG。",
  eyebrow: "浏览器本地批量图片工具",
  h1: "批量图片，简单处理。",
  intro: "格式转换、压缩、调整尺寸和裁剪；无需上传，无需登录。",
  aboutTitle: "免费批量处理 JPG、PNG、WebP、AVIF 等图片",
  aboutText: "Pixkit 是一款浏览器本地图片处理工具。可以导入 JPG、JPEG、PNG、WebP、AVIF、BMP、ICO、SVG，统一转换格式、压缩体积、限制尺寸、裁剪、旋转、添加文字或图片水印并批量重命名。处理过程不需要上传图片。",
  steps: [
    { title: "选择处理工具", text: "根据目标选择格式转换、压缩、尺寸、裁剪旋转或水印命名。" },
    { title: "添加多张图片", text: "拖入图片、选择文件夹，或直接粘贴剪贴板中的图片。" },
    { title: "设置并下载", text: "调整参数后批量处理，单张下载或打包为 ZIP。" },
  ],
  facts: [
    { title: "为什么选择本地处理？", text: "图片直接在设备中解码和生成，减少上传等待，也避免私人素材离开设备。" },
    { title: "支持哪些图片格式？", text: "主要输入输出为 JPG、PNG、WebP、AVIF，并可导入 BMP、ICO、SVG 转换为常用格式。" },
    { title: "批量处理会修改原图吗？", text: "不会。Pixkit 生成新的结果文件，原始图片保持不变。" },
  ],
  related: ["format", "compress", "resize", "crop", "brand"],
  faq: [
    { question: "Pixkit 会上传或保存我的图片吗？", answer: "不会。核心图片处理在当前浏览器中完成，图片不会提交到 Pixkit 服务器。" },
    { question: "可以一次处理多少张图片？", answer: "没有人为设置的次数限制；实际数量取决于设备内存、图片分辨率和浏览器性能。" },
    { question: "批量处理会改变原图吗？", answer: "不会。Pixkit 会生成新的结果文件，原始图片保持不变。" },
  ],
};

export const toolIds = Object.keys(toolContent) as ToolId[];

export function toolIdFromSlug(slug: string) {
  return toolIds.find((id) => toolContent[id].slug === slug);
}
