This is the files of my personal website, the url is https://wjn-portfolio-site.pages.dev/.

## 首屏素材

- `background1.png` — 原始素材（1448×1086，2.5 MB）。**不参与构建，请勿删除**，仅作存档。
- `background1-1920.webp`(186 KB) / `background1-1280.webp`(143 KB) — 首屏实际加载的压缩副本，按视口宽度 srcset 分发。
- `background1-1920.jpg`(284 KB) — WebP 不被支持时的兜底。

重新生成压缩副本：用 Pillow 对原图按 1448 / 1280 两个宽度重采样，WebP `quality=78, method=6`，JPEG `quality=82, progressive`。
