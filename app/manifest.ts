import type { MetadataRoute } from "next";

// Static export: this metadata route is emitted as a plain file at build time.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pixkit — 本地批量图片工具",
    short_name: "Pixkit",
    description:
      "在浏览器本地批量转换、压缩、调整尺寸、裁剪、旋转和添加水印，无需上传图片。",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f5f0",
    theme_color: "#101820",
    lang: "zh-CN",
    categories: ["utilities", "productivity", "photo"],
  };
}
