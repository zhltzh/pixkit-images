import { ShareLinks } from "./share-links";

const SITES = [
  { href: "https://aixuno.com/", mark: "MD", label: "Markdown 转换" },
  { href: "https://compress.aixuno.com/", mark: "ZIP", label: "文件压缩" },
  { href: "https://pdf.aixuno.com/", mark: "PDF", label: "PDF 工具" },
  { href: "https://bg.aixuno.com/", mark: "BG", label: "AI 抠图" },
];

// Cross-site entry points so visitors can reach the sibling Aixuno tools.
export function SiteNetwork() {
  return (
    <>
      <ShareLinks />
      <nav aria-label="AIXUNO 工具" className="mx-auto mt-6 w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
      <ul className="flex flex-wrap items-center justify-center gap-2 text-xs">
        {SITES.map((site) => (
          <li key={site.href}>
            <a
              href={site.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900"
            >
              <span className="font-bold">{site.mark}</span>
              {site.label}
            </a>
          </li>
        ))}
      </ul>
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
    </nav>
    </>
  );
}
