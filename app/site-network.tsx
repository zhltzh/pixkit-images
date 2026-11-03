import { ShareLinks } from "./share-links";

type SiteId = "markdown" | "image" | "compress" | "pdf" | "bg";

const TONE: Record<SiteId, string> = {
  markdown: "from-amber-400 to-orange-500",
  image: "from-fuchsia-500 to-pink-500",
  compress: "from-sky-500 to-emerald-500",
  pdf: "from-rose-500 to-red-500",
  bg: "from-violet-500 to-indigo-500",
};

const SITES: { id: SiteId; href: string; mark: string; label: string }[] = [
  { id: "markdown", href: "https://aixuno.com/", mark: "MD", label: "Markdown 转换" },
  { id: "image", href: "https://image.aixuno.com/", mark: "IMG", label: "Pixkit 图片" },
  { id: "compress", href: "https://compress.aixuno.com/", mark: "ZIP", label: "文件压缩" },
  { id: "pdf", href: "https://pdf.aixuno.com/", mark: "PDF", label: "PDF 工具" },
  { id: "bg", href: "https://bg.aixuno.com/", mark: "BG", label: "AI 抠图" },
];

const CURRENT: SiteId = "image";

// 顶部跨站条：让访客一眼看到 Aixuno 的其他工具，当前站高亮
export function SiteNetwork() {
  return (
    <nav aria-label="Aixuno 产品线" className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-1.5 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
        <span className="mr-1 shrink-0 text-[11px] font-bold uppercase tracking-widest text-gray-400">
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
              <span className="whitespace-nowrap text-xs font-semibold">{site.label}</span>
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
      </div>
    </nav>
  );
}

// 页脚：分享、反馈与隐私入口
export function SiteUtilityLinks() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <ShareLinks />
      <p className="mt-3 text-center text-xs text-gray-400">
        <a
          href="https://github.com/zhltzh/pixkit-images/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:text-gray-700 hover:underline"
        >
          意见反馈
        </a>
        <span className="mx-1.5">·</span>
        <a href="/privacy" className="underline-offset-2 hover:text-gray-700 hover:underline">
          隐私说明
        </a>
      </p>
    </div>
  );
}
