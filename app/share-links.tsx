"use client";

import { useEffect, useState } from "react";
import { useI18n } from "./i18n";

const X_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.9 2H22l-7 8 8.2 12h-6.6l-5.2-7.6L5.5 22H2.3l7.5-8.6L2 2h6.8l4.7 7L18.9 2Zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20Z" />
  </svg>
);

const WEIBO_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M10.1 20.2c-4 0-7.2-1.9-7.2-4.4 0-1.3.8-2.8 2.3-4.2 1.9-1.8 4.1-2.6 5-1.8.4.4.4 1 .1 1.8-.1.4.4.2.4.2 1.6-.7 3-.7 3.5.1.3.4.2 1 0 1.6-.1.3 0 .3.2.4 1 .3 2.1 1.1 2.1 2.5 0 2.1-2.5 3.8-6.4 3.8Z" />
  </svg>
);

const REDDIT_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12c0-1.1-.9-2-2-2-.5 0-1 .2-1.4.5-1.4-1-3.3-1.6-5.4-1.7l.9-3.1 2.7.6c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5-.7-1.5-1.5-1.5c-.6 0-1.1.3-1.3.9l-3-.7c-.2 0-.4.1-.4.3l-1 3.6c-2.2 0-4.2.6-5.6 1.7-.4-.3-.9-.5-1.4-.5-1.1 0-2 .9-2 2 0 .8.5 1.5 1.2 1.8v.6C3.9 17.4 7.5 20 12 20s8.1-2.6 8.1-5.8v-.5c.6-.3 1-.9 1-1.7Zm-13.7 2.6c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5Zm6.7 3.1c-.8.8-2.2 1-2.9 1s-2.2-.2-2.9-1c-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0 .5.5 1.5.7 2.2.7s1.7-.2 2.2-.7c.2-.2.5-.2.7 0 .2.2.2.5 0 .7Zm.4-1.6c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5Z" />
  </svg>
);

const COPY_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h8" />
  </svg>
);

async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission can still be denied inside a secure context.
    }
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

const pill =
  "inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900";

export function ShareLinks() {
  const { locale } = useI18n();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [copied, setCopied] = useState(false);
  const isZh = locale === "zh";

  useEffect(() => {
    setUrl(`${window.location.origin}${window.location.pathname}`);
    setTitle(document.title.replace(/\s*[|｜]\s*Pixkit\s*$/, ""));
  }, []);

  const handleCopy = async () => {
    if (!url) return;
    const ok = await copyText(url);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="mx-auto mt-8 flex w-full max-w-6xl flex-wrap items-center justify-center gap-2 px-4 text-xs sm:px-6 lg:px-8">
      <span className="text-gray-400">{isZh ? "分享这篇内容" : "Share this page"}</span>
      <button type="button" onClick={handleCopy} className={pill} aria-label={isZh ? "复制链接" : "Copy link"}>
        {COPY_ICON}
        {copied ? (isZh ? "已复制" : "Copied") : isZh ? "复制链接" : "Copy link"}
      </button>
      <a
        href={url ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` : undefined}
        target="_blank"
        rel="noopener noreferrer"
        className={pill}
        aria-label={isZh ? "分享到 X" : "Share on X"}
      >
        {X_ICON}
        X
      </a>
      {isZh ? (
        <a
          href={url ? `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={pill}
          aria-label="分享到微博"
        >
          {WEIBO_ICON}
          微博
        </a>
      ) : (
        <a
          href={url ? `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={pill}
          aria-label="Share on Reddit"
        >
          {REDDIT_ICON}
          Reddit
        </a>
      )}
    </div>
  );
}
