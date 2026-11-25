"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "zh" | "en";

const LOCALE_KEY = "pixkit-locale";

const DICT = {
  zh: {
    net_md: "Markdown 转换",
    net_img: "Pixkit 图片批量处理",
    net_zip: "文件压缩",
    net_pdf: "PDF 工具",
    net_bg: "AI 抠图",
    net_scan: "文档扫描",
    net_idphoto: "证件照制作",
    net_restore: "老照片修复",
    net_watermark: "视频去水印",
    nav_tools: "批量处理",
    nav_features: "功能",
    nav_guides: "教程",
    nav_privacy_pill: "● 图片不离开设备",
    home_breadcrumb: "首页",
    picker_title: "选择工具",
    picker_desc: "选择一个功能，添加图片后即可开始批量处理。",
    tool_format_tag: "默认",
    tool_format_title: "格式转换",
    tool_format_desc: "JPG、PNG、WebP、AVIF 互转",
    tool_compress_tag: "常用",
    tool_compress_title: "批量压缩",
    tool_compress_desc: "更小体积，保持清晰",
    tool_resize_tag: "批量",
    tool_resize_title: "调整尺寸",
    tool_resize_desc: "等比例统一图片宽度",
    tool_crop_tag: "编辑",
    tool_crop_title: "裁剪旋转",
    tool_crop_desc: "统一比例与图片方向",
    tool_brand_tag: "更多",
    tool_brand_title: "水印命名",
    tool_brand_desc: "添加水印并整理文件名",
    feedback: "邮件反馈",
    privacy_link: "隐私说明",
    home_link: "首页",
    brand_home: "Pixkit 首页",
    nav_main: "主要导航",
    breadcrumb: "面包屑导航",
    picker_aria: "选择图片工具",
    dropzone_aria: "图片上传区域，按回车选择图片或将文件拖入",
    dropzone_strong: "将图片拖到这里",
    dropzone_small: "支持批量选择，图片不会上传到服务器",
    dropzone_pick: "选择图片",
    dropzone_folder: "选择文件夹",
    dropzone_paste: "粘贴图片（Ctrl+V）",
    download_zip: "打包下载 ZIP ↓",
    download_result: "下载结果 ↓",
    assurance_batch: "支持批量选择",
    assurance_local: "图片不上传服务器",
    assurance_formats: "主要格式 JPG · PNG · WebP · AVIF",
    assurance_import: "可导入 BMP · ICO · SVG",
    workspace_back: "返回上传图片",
    workspace_add: "继续添加",
    status_ready: "准备就绪",
    status_working_prefix: "正在处理",
    status_done_suffix: "张已完成",
    images_count: "张图片",
    total_size: "共",
  },
  en: {
    net_md: "Markdown",
    net_img: "Pixkit Image Tools",
    net_zip: "File Compress",
    net_pdf: "PDF Tools",
    net_bg: "AI Cutout",
    net_scan: "Document Scan",
    net_idphoto: "ID Photo",
    net_restore: "Photo Restore",
    net_watermark: "Watermark Remover",
    nav_tools: "Batch tools",
    nav_features: "Features",
    nav_guides: "Guides",
    nav_privacy_pill: "● Images never leave your device",
    home_breadcrumb: "Home",
    picker_title: "Choose a tool",
    picker_desc: "Pick a tool, add your images and start batch processing.",
    tool_format_tag: "Default",
    tool_format_title: "Convert format",
    tool_format_desc: "JPG, PNG, WebP, AVIF",
    tool_compress_tag: "Popular",
    tool_compress_title: "Compress",
    tool_compress_desc: "Smaller files, same clarity",
    tool_resize_tag: "Batch",
    tool_resize_title: "Resize",
    tool_resize_desc: "Unify image width",
    tool_crop_tag: "Edit",
    tool_crop_title: "Crop & rotate",
    tool_crop_desc: "Unify ratio and orientation",
    tool_brand_tag: "More",
    tool_brand_title: "Watermark & rename",
    tool_brand_desc: "Add watermarks and tidy filenames",
    feedback: "Feedback",
    privacy_link: "Privacy",
    home_link: "Home",
    brand_home: "Pixkit home",
    nav_main: "Main navigation",
    breadcrumb: "Breadcrumb",
    picker_aria: "Choose an image tool",
    dropzone_aria: "Image upload area — press Enter to browse or drop files here",
    dropzone_strong: "Drop images here",
    dropzone_small: "Batch selection supported — images never leave your device",
    dropzone_pick: "Choose images",
    dropzone_folder: "Choose folder",
    dropzone_paste: "Paste images (Ctrl+V)",
    download_zip: "Download all as ZIP ↓",
    download_result: "Download result ↓",
    assurance_batch: "Batch selection supported",
    assurance_local: "Images never leave your device",
    assurance_formats: "Main formats JPG · PNG · WebP · AVIF",
    assurance_import: "Import BMP · ICO · SVG",
    workspace_back: "Back to upload",
    workspace_add: "Add more",
    status_ready: "Ready",
    status_working_prefix: "Processing",
    status_done_suffix: "done",
    images_count: "images",
    total_size: "Total",
  },
} as const;

export type DictKey = keyof typeof DICT.zh;

type I18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: DictKey) => string;
};

const LocaleContext = createContext<I18nValue>({
  locale: "zh",
  setLocale: () => undefined,
  t: (key) => DICT.zh[key],
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_KEY) as Locale | null;
      if (saved === "en" || saved === "zh") {
        setLocaleState(saved);
        return;
      }
      if ((navigator.language || "").toLowerCase().startsWith("en")) setLocaleState("en");
    } catch {
      // localStorage unavailable
    }
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale: (next) => {
        try {
          localStorage.setItem(LOCALE_KEY, next);
        } catch {
          // localStorage unavailable
        }
        setLocaleState(next);
      },
      t: (key) => DICT[locale][key] ?? DICT.zh[key] ?? key,
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  return useContext(LocaleContext);
}

export function LangSwitch() {
  const { locale, setLocale } = useI18n();
  return (
    <span className="ml-auto flex shrink-0 items-center gap-1 pr-1 text-xs font-semibold">
      {(["zh", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`rounded-full px-2 py-0.5 transition-colors ${
            locale === l ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {l === "zh" ? "中文" : "EN"}
        </button>
      ))}
    </span>
  );
}
