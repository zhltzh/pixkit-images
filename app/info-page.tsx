import Link from "next/link";

export function InfoPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <main className="info-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Pixkit 首页"><span className="brand-mark">P</span><span>Pixkit</span></Link>
        <nav aria-label="信息页导航"><Link href="/tools/image-format-converter">图片工具</Link><a href="https://aixuno.com">AIXUNO</a></nav>
      </header>
      <article className="info-card">
        <nav className="breadcrumb" aria-label="面包屑导航"><Link href="/">首页</Link><span>/</span><span>{title}</span></nav>
        <span className="info-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="info-intro">{intro}</p>
        <div className="info-body">{children}</div>
      </article>
      <footer><span>Pixkit · AIXUNO 旗下图片工具</span><nav><Link href="/about">关于</Link><Link href="/privacy">隐私</Link><Link href="/changelog">更新记录</Link></nav></footer>
    </main>
  );
}
