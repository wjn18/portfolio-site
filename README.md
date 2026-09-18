# Portfolio Site

个人作品集站点。Vite 5 + React 18 静态站，仓库 `wjn18/portfolio-site`，由 **Netlify** 自动部署：push 到 `main` 即触发构建。

（早期曾部署在 Cloudflare Pages，已弃用。若看到 `pages.dev` 的旧链接，忽略即可。）

---

## 内容去哪改

**不要直接改代码里的文案，走后台：`https://<你的域名>/admin`。**

- 内容唯一事实来源：`src/data/content.json`
- `src/data/portfolio.js` 是**只读适配层**，只做字段映射，改它不会改变网站内容
- 后台每次保存 = 一次 Git commit，改错了可以到 GitHub 上 revert
  - 「仅保存」→ commit 带 `[skip netlify]`，入库但不触发构建
  - 「保存并发布」→ 触发 Netlify 构建，通常 1–2 分钟生效

### 内容约束（违规会在保存时被拦下）

- `about` 是字符串数组，段落数量不限；按顺序展示，空白段落不显示
- `profile.education` 用换行分隔，第一行学校、第二行时间
- 视频只存外链，不上传视频文件本身

---

## 后台

| 地址 | 内容 |
|---|---|
| `/admin` | 概览：内容状态、部署状态 |
| `/admin#/text` | 文本内容（基本信息 / 关于我 / 能力 / 联系方式 / 导航 / 数字） |
| `/admin#/projects` | 项目增删改与排序 |
| `/admin#/videos` | 视频链接管理 |
| `/admin#/files` | 文件上传（简历 / 文档 / 封面图） |

用管理口令登录（见下方环境变量）。

### 本地联调

后台依赖 Netlify Functions，**必须用 `netlify dev`，不能用 `npm run dev`**：

```bash
npx netlify dev
# 站点 http://localhost:8888 ，后台 http://localhost:8888/admin
```

### 环境变量（Netlify → Site configuration → Environment variables）

| 变量 | 必填 | 说明 |
|---|---|---|
| `GITHUB_TOKEN` | ✓ | fine-grained PAT，限定本仓库 Contents: read + write |
| `GITHUB_REPO` | | 默认 `wjn18/portfolio-site` |
| `GITHUB_BRANCH` | | 默认 `main` |
| `ADMIN_PASSWORD_SHA256` | ✓ | 口令的 sha256 十六进制（不存明文） |
| `JWT_SECRET` | ✓ | 随机长字符串 |
| `NETLIFY_TOKEN` | | 可选。配了才能在概览页显示部署状态 |
| `NETLIFY_SITE_ID` | | 同上 |

生成口令哈希：

```bash
node -e "console.log(require('crypto').createHash('sha256').update('你的口令').digest('hex'))"
```

### 后端结构

```
netlify/functions/   auth.mjs / content.mjs / files.mjs / deploy.mjs
netlify/lib/         github.mjs（Contents API）、jwt.mjs、guard.mjs（鉴权 + 结构校验）
```

回归测试（不联网，校验 JWT、内容结构、鉴权拦截）：

```bash
npm run test:functions
```

---

## 构建

```bash
node node_modules/vite/bin/vite.js build
```

两个入口：`index.html`（访客站）与 `admin/index.html`（后台）。后台代码不进访客站 bundle。

---

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
