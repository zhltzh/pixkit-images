import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html", host: "image.aixuno.com" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Pixkit homepage with usable and indexable content", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Pixkit/);
  assert.match(html, /批量图片，简单处理/);
  assert.match(html, /将图片拖到这里/);
  assert.match(html, /选择文件夹/);
  assert.match(html, /图片不离开设备/);
  assert.match(html, /可导入 BMP/);
  assert.doesNotMatch(html, /\bGIF\b/);
  assert.match(html, /ZIP 下载/);
  assert.match(html, /AIXUNO 旗下图片工具/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /FAQPage/);
  assert.match(html, /HowTo/);
  assert.match(html, /相关工具/);
});

test("server-renders an independent compressor page with unique intent", async () => {
  const response = await render("/tools/batch-image-compressor");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /批量压缩图片，减少文件体积/);
  assert.match(html, /怎样批量压缩图片并尽量保持清晰/);
  assert.match(html, /压缩图片会上传到服务器吗/);
  assert.match(html, /选择格式与质量/);
  assert.match(html, /BreadcrumbList/);
  assert.match(html, /batch-image-compressor/);
});

test("server-renders the image watermark page with accurate capabilities", async () => {
  const response = await render("/tools/batch-image-watermark-rename");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /批量添加图片水印并统一重命名/);
  assert.match(html, /文字水印或品牌图片水印/);
  assert.match(html, /图片水印可以调整大小和透明度吗/);
  assert.doesNotMatch(html, /图片水印会作为后续/);
});

test("server-renders the crop page with positioning and flip guidance", async () => {
  const response = await render("/tools/batch-image-crop-rotate");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /九个位置中指定需要保留的画面区域/);
  assert.match(html, /裁剪、旋转和翻转可以一次完成/);
  assert.doesNotMatch(html, /当前采用居中裁剪/);
});

test("returns a not-found response for an unknown tool route", async () => {
  const response = await render("/tools/not-a-real-tool");
  assert.equal(response.status, 404);

  const html = await response.text();
  assert.match(html, /这个页面不存在，图片工具还在/);
  assert.match(html, /返回 Pixkit 首页/);
  assert.match(html, /batch-image-compressor/);
});

test("exposes the install manifest and crawler discovery files", async () => {
  const [manifest, robots, sitemap] = await Promise.all([
    render("/manifest.webmanifest"),
    render("/robots.txt"),
    render("/sitemap.xml"),
  ]);

  assert.equal(manifest.status, 200);
  const manifestBody = await manifest.json();
  assert.equal(manifestBody.name, "Pixkit — 本地批量图片工具");
  assert.equal(manifestBody.start_url, "/");
  assert.equal(manifestBody.display, "standalone");

  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /https:\/\/image\.aixuno\.com\/sitemap\.xml/);

  assert.equal(sitemap.status, 200);
  const sitemapBody = await sitemap.text();
  assert.match(sitemapBody, /image-format-converter/);
  assert.match(sitemapBody, /batch-image-compressor/);
  assert.match(sitemapBody, /batch-image-watermark-rename/);
});
