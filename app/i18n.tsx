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
