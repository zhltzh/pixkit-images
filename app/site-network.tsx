"use client";

import { ShareLinks } from "./share-links";
import { ContactEmail } from "./contact-email";
import { LangSwitch, useI18n, type DictKey } from "./i18n";

type SiteId = "markdown" | "image" | "compress" | "pdf" | "bg" | "scan" | "idphoto" | "restore" | "watermark";

const TONE: Record<SiteId, string> = {
  markdown: "from-amber-400 to-orange-500",
  image: "from-fuchsia-500 to-pink-500",
  compress: "from-sky-500 to-emerald-500",
  pdf: "from-rose-500 to-red-500",
  bg: "from-violet-500 to-indigo-500",
  scan: "from-blue-500 to-blue-700",
  idphoto: "from-pink-500 to-rose-500",
  restore: "from-indigo-500 to-indigo-700",
  watermark: "from-cyan-500 to-blue-600",
};

const SITES: { id: SiteId; href: string; mark: string; labelKey: DictKey }[] = [
  { id: "markdown", href: "https://aixuno.com/", mark: "MD", labelKey: "net_md" },
  { id: "image", href: "https://image.aixuno.com/", mark: "IMG", labelKey: "net_img" },
  { id: "compress", href: "https://compress.aixuno.com/", mark: "ZIP", labelKey: "net_zip" },
  { id: "pdf", href: "https://pdf.aixuno.com/", mark: "PDF", labelKey: "net_pdf" },
  { id: "bg", href: "https://bg.aixuno.com/", mark: "BG", labelKey: "net_bg" },
  { id: "scan", href: "https://scan.aixuno.com/", mark: "DOC", labelKey: "net_scan" },
  { id: "idphoto", href: "https://idphoto.aixuno.com/", mark: "ID", labelKey: "net_idphoto" },
  { id: "restore", href: "https://restore.aixuno.com/", mark: "FIX", labelKey: "net_restore" },
  { id: "watermark", href: "https://watermark.aixuno.com/", mark: "WM", labelKey: "net_watermark" },
];

const CURRENT: SiteId = "image";

// 顶部跨站条：让访客一眼看到 Aixuno 的其他工具，当前站高亮
export function SiteNetwork() {
  const { t } = useI18n();
  return (
    <nav aria-label="Aixuno 产品线" className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-1.5 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
        <span className="mr-1 shrink-0 text-xs font-bold uppercase tracking-widest text-gray-400">
          Aixuno
        </span>
        {SITES.map((site) => {
          const isCurrent = site.id === CURRENT;
          const inner = (
            <>
              <span
                className={`inline-grid h-5 min-w-[26px] shrink-0 place-items-center rounded bg-gradient-to-br px-1 text-[10px] font-bold leading-none text-white ${TONE[site.id]}`}
              >
                {site.mark}
              </span>
              <span className="whitespace-nowrap text-xs font-semibold">{t(site.labelKey)}</span>
            </>
          );
          return isCurrent ? (
            <span
              key={site.id}
              aria-current="page"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-2.5 py-1 text-fuchsia-700"
            >
              {inner}
            </span>
          ) : (
            <a
              key={site.id}
              href={site.href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-gray-600 transition-colors hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900"
            >
              {inner}
            </a>
          );
        })}
        <LangSwitch />
      </div>
    </nav>
  );
}

// 页脚：分享、反馈与隐私入口
export function SiteUtilityLinks() {
  const { t } = useI18n();
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <ShareLinks />
      <p className="mt-3 text-center text-xs text-gray-400">
        <ContactEmail
          label={t("feedback")}
          className="underline-offset-2 hover:text-gray-700 hover:underline"
        />
        <span className="mx-1.5">·</span>
        <a
          href="https://github.com/zhltzh/pixkit-images/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:text-gray-700 hover:underline"
        >
          GitHub
        </a>
        <span className="mx-1.5">·</span>
        <a href="/privacy" className="underline-offset-2 hover:text-gray-700 hover:underline">
          {t("privacy_link")}
        </a>
      </p>
    </div>
  );
}
