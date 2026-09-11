This is the files of my personal website, the url is https://wjn-portfolio-site.pages.dev/.

## 首屏素材

首屏自 2026-09 改版后不再使用背景图（改为大字排版 + 旋转徽章），`background1` 系列素材已全部从仓库移除，共省下约 3.2 MB：

- `background1.png` — 原始素材（1448×1086，2.59 MB）
- `background1-1920.webp`(186 KB) / `background1-1280.webp`(143 KB) — 压缩副本
- `background1-1920.jpg`(284 KB) — WebP 不被支持时的兜底

如需取回（删除前最后一个含这些文件的提交是 `bfcf400`）：

```bash
git show bfcf400:background1.png > background1.png
git show bfcf400:background1-1920.webp > background1-1920.webp
```

重新生成压缩副本：用 Pillow 对原图按 1448 / 1280 两个宽度重采样，WebP `quality=78, method=6`，JPEG `quality=82, progressive`。
