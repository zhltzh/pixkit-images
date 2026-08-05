import Link from "next/link";
import { toolContent, type ToolId } from "./tool-content";

const toolIds: ToolId[] = ["format", "compress", "resize", "crop", "brand"];

export default function NotFound() {
  return (
    <main className="not-found-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Pixkit 首页">
          <span className="brand-mark" aria-hidden="true">P</span>
          Pixkit
        </Link>
        <span className="privacy-pill">● 图片只在本地处理</span>
      </header>

      <section className="not-found-card">
        <span className="not-found-code">404 · PAGE NOT FOUND</span>
        <h1>这个页面不存在，图片工具还在。</h1>
        <p>地址可能已经改变。你可以返回首页，或直接进入需要的批量图片工具。</p>
        <Link className="button primary not-found-home" href="/">
          返回 Pixkit 首页
        </Link>

        <nav className="not-found-tools" aria-label="Pixkit 图片工具">
          {toolIds.map((id) => {
            const tool = toolContent[id];
            return (
              <Link key={id} href={`/tools/${tool.slug}`}>
                <strong>{tool.title}</strong>
                <small>{tool.description}</small>
                <span aria-hidden="true">→</span>
              </Link>
            );
          })}
        </nav>
      </section>
    </main>
  );
}
