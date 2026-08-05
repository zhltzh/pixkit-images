# Pixkit

Pixkit 是 AIXUNO 旗下的浏览器本地批量图片工具，计划使用正式域名：

`https://image.aixuno.com`

支持 JPG、PNG、WebP、AVIF 格式转换、批量压缩、调整尺寸、裁剪旋转、水印、重命名和 ZIP 下载，并可导入 BMP、ICO、SVG 转换为常用格式。GIF 不在当前支持范围内。图片默认只在用户的浏览器中处理，不上传服务器。

## 产品与域名定位

- 主品牌：AIXUNO
- 图片工具品牌：Pixkit
- 正式域名：`image.aixuno.com`
- 首页定位：批量图片处理入口
- 工具页：每项核心功能使用独立、可索引 URL
- 文档转换产品继续保持原有站点，不与图片处理功能混合

如需部署到临时域名，可设置 `NEXT_PUBLIC_SITE_URL`；canonical、Open Graph、robots、sitemap 和结构化数据会统一使用该地址。正式上线时必须设置为 `https://image.aixuno.com`。

## 开发

需要 Node.js `>=22.13.0`。

```bash
npm install
npm run dev
npm run build
npm test
```

项目开发必须遵循 [SEO-GEO-BASELINE.md](./SEO-GEO-BASELINE.md)。SEO 与 GEO 是架构、设计、文案和实现阶段的基础要求，不是上线前的附加工作。
