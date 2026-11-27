"use client";

import Link from "next/link";
import { toolContent, type ToolId } from "./tool-content";
import { useI18n } from "./i18n";

const toolIds: ToolId[] = ["format", "compress", "resize", "crop", "brand"];

export function NotFoundContent() {
  const { locale, t } = useI18n();
  const en = locale === "en";
  return (
    <main className="not-found-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label={t("brand_home")}>
          <span className="brand-mark" aria-hidden="true">P</span>
          Pixkit
        </Link>
        <span className="privacy-pill">{en ? "● Images processed locally" : "● 图片只在本地处理"}</span>
      </header>

      <section className="not-found-card">
        <span className="not-found-code">404 · PAGE NOT FOUND</span>
        <h1>{en ? "This page does not exist — the image tools are still here." : "这个页面不存在，图片工具还在。"}</h1>
        <p>{en ? "The address may have changed. Head back to the home page or jump straight into the batch tool you need." : "地址可能已经改变。你可以返回首页，或直接进入需要的批量图片工具。"}</p>
        <Link className="button primary not-found-home" href="/">
          {en ? "Back to the Pixkit home page" : "返回 Pixkit 首页"}
        </Link>

        <nav className="not-found-tools" aria-label={en ? "Pixkit image tools" : "Pixkit 图片批量处理"}>
          {toolIds.map((id) => {
            const tool = toolContent[id];
            const enMeta = tool.en;
            return (
              <Link key={id} href={`/tools/${tool.slug}`}>
                <strong>{en && enMeta ? enMeta.title : tool.title}</strong>
                <small>{en && enMeta ? enMeta.intro : tool.description}</small>
                <span aria-hidden="true">→</span>
              </Link>
            );
          })}
        </nav>
      </section>
    </main>
  );
}
