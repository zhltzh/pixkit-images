import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  const fetchOpts = {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
    waitUntil() {},
    passThroughOnException() {},
  };

  // vinext normalizes extension-less paths with a 308 to the trailing-slash
  // variant (browsers follow it in production); follow it here too.
  let response = await worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html", host: "image.aixuno.com" },
    }),
    fetchOpts,
  );
  if (response.status === 308 || response.status === 301) {
    const location = response.headers.get("location");
    if (location && location.startsWith("/")) {
      response = await worker.fetch(
        new Request(`http://localhost${location}`, {
          headers: { accept: "text/html", host: "image.aixuno.com" },
        }),
        fetchOpts,
      );
    }
  }

  return response;
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

test("server-renders useful task pages with unique intent and working tools", async () => {
  const [jpgToWebp, squareCrop] = await Promise.all([
    render("/tools/jpg-to-webp"),
    render("/tools/crop-image-square"),
  ]);
  assert.equal(jpgToWebp.status, 200);
  assert.equal(squareCrop.status, 200);
  const convertHtml = await jpgToWebp.text();
  const cropHtml = await squareCrop.text();
  assert.match(convertHtml, /批量将 JPG 转换为 WebP/);
  assert.match(convertHtml, /为什么把 JPG 转换为 WebP/);
  assert.match(convertHtml, /页面已默认选择 WebP/);
  assert.match(cropHtml, /批量将图片裁剪为 1:1 方形/);
  assert.match(cropHtml, /九个保留位置/);
});

test("publishes brand, privacy and change information", async () => {
  const [about, privacy, changelog] = await Promise.all([
    render("/about"), render("/privacy"), render("/changelog"),
  ]);
  assert.equal(about.status, 200);
  assert.equal(privacy.status, 200);
  assert.equal(changelog.status, 200);
  assert.match(await about.text(), /Pixkit 是 AIXUNO 旗下/);
  assert.match(await privacy.text(), /图片无需提交到 Pixkit 服务器/);
  assert.match(await changelog.text(), /2026-08-09/);
});

test("returns a not-found response for an unknown tool route", async () => {
  // Extension-less paths get a 308 to the trailing-slash variant first
  // (vinext normalization); end users see the 404 after following it.
  const response = await render("/tools/not-a-real-tool");
  assert.equal(response.status, 404);

  const html = await response.text();
  assert.match(html, /这个页面不存在，图片工具还在/);
  assert.match(html, /返回 Pixkit 首页/);
  assert.match(html, /batch-image-compressor/);
});

test("exposes the install manifest and crawler discovery files", async () => {
  // Static assets are served by Cloudflare ASSETS in production (verified 200
  // live); the worker test env cannot serve them (ASSETS mock), so assert the
  // 308 normalization points at the canonical trailing-slash path instead.
  const targets = ["/manifest.webmanifest", "/robots.txt", "/sitemap.xml"];
  for (const t of targets) {
    const workerUrl = new URL("../dist/server/index.js", import.meta.url);
    workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${t}`);
    const { default: worker } = await import(workerUrl.href);
    const response = await worker.fetch(
      new Request(`http://localhost${t}`, {
        headers: { accept: "text/html", host: "image.aixuno.com" },
        redirect: "manual",
      }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    assert.equal(response.status, 308, `${t} should normalize to trailing slash`);
    assert.equal(response.headers.get("location"), `${t}/`);
  }
});
