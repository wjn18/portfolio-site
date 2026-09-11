# 管理后台设计文档

> 状态：待确认 · 版本 v1 · 2026-09-10
> 目标：为作品集站点提供内容管理后台，管理**视频链接**、**简历/文档文件**、**全站文本内容**。

---

## 1. 架构总览

### 1.1 选型

| 层 | 选型 | 说明 |
|---|---|---|
| 站点框架 | 现有 Vite 5 + React 18 | 不动 |
| 后台 UI | **Ant Design 5** | Table / Form / Upload 开箱即用，不引入 Tailwind，对现有工程零污染 |
| 后台入口 | Vite 多页 `admin/index.html` | 后台代码不进访客站 bundle |
| API | **Hono** + Cloudflare Pages Functions | 纯 JS（ESM），不引入 TS 工具链 |
| 内容存储 | **R2** `content/snapshot.json` | 单文件全量快照，见 §3 |
| 文件存储 | **R2** `resume/` `docs/` `covers/` | 简历、设计文档、视频封面 |
| 登录 | **Cloudflare Zero Trust Access** | 保护 `/admin` 与 `/api`，邮箱 OTP，零认证代码 |
| 发布 | Cloudflare Pages **Deploy Hook** | 保存后触发重建，1–2 分钟生效 |

### 1.2 数据流

```
后台 /admin  ──PUT──>  Pages Functions (Hono)
                            │
                            ├──> R2: content/snapshot.json   （全量覆盖）
                            └──> R2: resume/ docs/ covers/   （文件上传）

npm run build
   └─ prebuild: scripts/fetch-content.mjs
         ├── GET  snapshot  ──> 写入 src/data/generated.js
         ├── GET  各文件    ──> 写入 public/resume.pdf、public/docs/*.pdf
         └── 触发失败时：生产构建直接报错；本地 dev 回退到种子数据

保存后  ──>  Functions 调 Deploy Hook  ──>  Pages 重新构建  ──>  线上生效
```

### 1.3 为什么不用 D1

- Cloudflare Pages 的**构建环境没有 D1 绑定**，构建时想读内容必须走 REST API + API Token，多一套密钥管理。
- 内容总量 < 100KB，无查询、无关联需求，单文件快照完全够用。
- 少一个服务 = 少一套 migration。**将来若需要查询能力，把 snapshot 拆表迁入 D1 即可，JSON 结构不变。**

---

## 2. 目录结构

```
portfolio-site/
├─ functions/                      # Cloudflare Pages Functions（后端）
│  └─ api/
│     ├─ [[route]].js              # Hono catch-all 入口
│     ├─ content.js                # 内容读写路由
│     ├─ files.js                  # 文件上传 / 删除
│     ├─ deploy.js                 # 触发构建、查询部署状态
│     └─ lib/
│        ├─ snapshot.js            # R2 快照读写 + 结构校验
│        ├─ auth.js                # 解析 CF-Access-Jwt-Assertion
│        └─ ids.js                 # id 生成（crypto.randomUUID）
│
├─ admin/                          # 后台前端（独立入口）
│  ├─ index.html
│  ├─ main.jsx
│  ├─ App.jsx                      # Layout + 侧边导航
│  ├─ api.js                       # fetch 封装，统一带 credentials
│  └─ pages/
│     ├─ DashboardPage.jsx         # 上次保存时间 / 构建状态 / 重新构建按钮
│     ├─ TextPage.jsx              # profile、about、skills、contacts、nav、spec
│     ├─ ProjectsPage.jsx          # 项目卡片增删改排序
│     ├─ VideosPage.jsx            # 视频链接管理（Table 行内编辑 + 拖拽排序）
│     └─ FilesPage.jsx             # 简历 / 文档上传替换
│
├─ scripts/
│  ├─ fetch-content.mjs            # prebuild / predev：拉快照 → generated.js + public/
│  └─ seed-snapshot.mjs            # 从 portfolio.js 生成初始快照（一次性）
│
├─ src/data/
│  ├─ generated.js                 # 【构建产物，gitignore】构建期注入的内容
│  └─ seed.json                    # 【入库】当前 portfolio.js 内容的种子副本
│
├─ wrangler.jsonc                  # R2 binding 声明（本地 wrangler pages dev 用）
└─ vite.config.js                  # 增加 admin/index.html 多入口
```

---

## 3. 内容数据模型（snapshot.json）

### 3.1 顶层结构

```jsonc
{
  "version": 1,
  "updatedAt": "2026-09-10T15:30:00.000Z",
  "profile":        { ... },   // 见 3.2
  "actions":        [ ... ],   // 见 3.3
  "nav":            [ ... ],   // 见 3.4
  "spec":           [ ... ],   // 见 3.5
  "about":          [ "段落1", "段落2" ],
  "skills":         [ ... ],   // 见 3.6
  "gameExperience": [ "剑星（全成就）", "..." ],
  "contacts":       [ ... ],   // 见 3.7
  "projects":       [ ... ],   // 见 3.8
  "videos":         [ ... ],   // 见 3.9
  "files":          [ ... ]    // 见 3.10
}
```

所有字段与现有 `src/data/portfolio.js` 的导出**一一对应**，仅新增 `videos` 与 `files`。

### 3.2 profile

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| name | string | ✓ | 姓名 |
| englishTitle | string | ✓ | 英文副标题 |
| role | string | ✓ | 岗位 |
| currentRole | string | ✓ | 当前岗位 |
| intro | string | ✓ | 一句话简介 |
| education | string | ✓ | 支持 `\n` 换行 |
| targets | string[] | ✓ | 求职方向标签 |
| highlights | string[] | ✓ | 首屏要点 |

### 3.3 actions

| 字段 | 类型 | 说明 |
|---|---|---|
| label | string | 按钮文案 |
| href | string | 链接 |
| primary | boolean | 是否主按钮 |
| external | boolean | 是否外链 |
| download | boolean | 是否下载 |

### 3.4 nav / 3.5 spec

- `nav[]`: `{ label: string, href: string }`
- `spec[]`: `{ value: string, label: string }`

### 3.6 skills

```jsonc
{ "title": "Agent Harness 工程", "items": ["...", "..."] }
```

### 3.7 contacts

`{ label: string, value: string, href?: string }`（`href` 可空，如微信号）

### 3.8 projects

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | ✓ | UUID |
| title | string | ✓ | |
| subtitle | string | | |
| period | string | | |
| type | string | | 如 "Unity Project" |
| role | string | | 如 "独立完成" |
| summary | string | | |
| contributions | string[] | | 贡献列表 |
| links | `{label, href}[]` | | 项目外链 |
| sort | number | ✓ | 排序权重，小的在前 |
| visible | boolean | ✓ | 是否展示 |

### 3.9 videos（新增）

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | ✓ | UUID |
| title | string | ✓ | 视频标题 |
| description | string | | 一句话描述 |
| url | string | ✓ | 视频链接（B 站 / YouTube / 直链） |
| cover | string | | 封面图 URL，可上传到 R2 `covers/` |
| platform | enum | ✓ | `bilibili` \| `youtube` \| `other` |
| tags | string[] | | 标签，用于筛选 |
| sort | number | ✓ | 排序权重 |
| visible | boolean | ✓ | |
| createdAt | string | ✓ | ISO 8601 |

### 3.10 files

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | ✓ | UUID |
| kind | enum | ✓ | `resume` \| `doc` \| `cover` |
| label | string | ✓ | 展示名，如 "简历 PDF" |
| filename | string | ✓ | 原始文件名 |
| key | string | ✓ | R2 object key |
| url | string | ✓ | 公开访问 URL |
| publicPath | string | | 构建时落地到 `public/` 的相对路径，如 `/resume.pdf` |
| size | number | | 字节数 |
| mime | string | | |
| updatedAt | string | ✓ | ISO 8601 |

> `publicPath` 的存在意义：构建脚本把文件下载回 `public/`，**前台 URL 保持不变**（`/resume.pdf`、`/docs/*.pdf`），组件代码无需改动。

### 3.11 R2 key 布局

```
content/snapshot.json          全站内容快照
resume/resume.pdf              简历（唯一，替换式覆盖）
docs/<uuid>-<filename>         设计文档
covers/<uuid>.<ext>            视频封面
```

Bucket 名：`portfolio-assets`。开启 **R2 公开访问**（r2.dev 子域或自定义域），供构建脚本无鉴权读取。

---

## 4. API 设计

Base: `/api`，全部位于 Cloudflare Access 保护之下。

| 方法 | 路径 | 说明 | 请求体 / 响应 |
|---|---|---|---|
| GET | `/api/session` | 当前登录身份 | → `{ email, name }` |
| GET | `/api/content` | 读取整份 snapshot | → `Snapshot` |
| PUT | `/api/content` | 全量覆盖保存（乐观锁） | `{ snapshot, baseUpdatedAt }` → `Snapshot` |
| GET | `/api/videos` | 视频列表 | → `Video[]` |
| POST | `/api/videos` | 新增视频 | `VideoInput` → `Video` |
| PATCH | `/api/videos/:id` | 修改视频 | `Partial<VideoInput>` → `Video` |
| DELETE | `/api/videos/:id` | 删除视频 | → `{ ok: true }` |
| POST | `/api/videos/reorder` | 排序 | `{ ids: string[] }` → `Video[]` |
| GET | `/api/projects` | 项目列表 | → `Project[]` |
| POST/PATCH/DELETE | `/api/projects[/:id]` | 项目增删改 | 同 videos 模式 |
| POST | `/api/files` | 上传文件（multipart） | `kind`, `label`, `publicPath?`, `file` → `FileItem` |
| DELETE | `/api/files/:id` | 删除文件 | → `{ ok: true }` |
| POST | `/api/deploy` | 触发 Deploy Hook | → `{ deploymentId }` |
| GET | `/api/deploy/status` | 最近一次部署状态 | → `{ state, createdAt, url }` |

### 4.1 统一响应与错误码

```jsonc
// 成功
{ "ok": true, "data": { ... } }
// 失败
{ "ok": false, "error": { "code": "CONFLICT", "message": "内容已被其他端修改" } }
```

| code | HTTP | 场景 |
|---|---|---|
| `UNAUTHORIZED` | 401 | 未通过 Access 或 JWT 校验失败 |
| `VALIDATION` | 422 | 结构校验不通过（附 `field` 路径） |
| `CONFLICT` | 409 | `baseUpdatedAt` 与当前 `updatedAt` 不一致 |
| `NOT_FOUND` | 404 | id 不存在 |
| `UPSTREAM` | 502 | R2 / Deploy Hook 调用失败 |

### 4.2 鉴权（防御纵深）

1. **Cloudflare Zero Trust Access** 策略保护 `/admin/*` 与 `/api/*`，邮箱 OTP 或 Google 登录。
2. Functions 侧额外校验请求头 `CF-Access-Jwt-Assertion`（用 Access 的 JWKS 验签），防止绕过 Access 直连 API。
3. 写操作全部记录 `updatedAt` 与操作者邮箱到 snapshot 的 `updatedAt` / `updatedBy`（审计留痕，不做历史版本，历史版本交给 R2 对象版本控制）。

---

## 5. 构建期内容注入

### 5.1 `scripts/fetch-content.mjs`

```
node scripts/fetch-content.mjs [--fallback]
```

步骤：

1. `GET $CONTENT_SNAPSHOT_URL`（默认 `https://<r2-public>/content/snapshot.json`）
2. 结构校验（字段存在性 + 类型），失败则抛错
3. 写入 `src/data/generated.js`：`export default { ...snapshot };`
4. 遍历 `snapshot.files`，按 `publicPath` 下载到 `public/` 对应路径
5. 任一步失败：
   - 带 `--fallback` → 用 `src/data/seed.json` 生成，仅警告
   - 不带 → **非零退出，构建失败**（宁可构建失败，也不能让线上内容错乱）

### 5.2 `src/data/portfolio.js` 改造

```js
import generated from "./generated.js";

export const profile = generated.profile;
export const actions = generated.actions;
export const projects = generated.projects.filter(p => p.visible);
export const videos   = generated.videos.filter(v => v.visible);
export const skillGroups = generated.skills;
export const gameExperience = generated.gameExperience;
export const contacts = generated.contacts;
export const aboutParagraphs = generated.about;
export const navItems = generated.nav;
export const specCells = generated.spec;
```

**组件代码零改动**，导出名与形状完全不变。

### 5.3 npm scripts

```jsonc
"predev":   "node scripts/fetch-content.mjs --fallback",
"prebuild": "node scripts/fetch-content.mjs",
"dev":      "vite",
"build":    "vite build"
```

### 5.4 vite.config.js 多入口

```js
build: {
  rollupOptions: {
    input: {
      main:  resolve(__dirname, "index.html"),
      admin: resolve(__dirname, "admin/index.html"),
    },
  },
}
```

---

## 6. 后台页面

| 路由 | 内容 |
|---|---|
| `/admin` | Dashboard：上次保存时间、构建状态、[保存并发布] / [仅保存] 按钮 |
| `/admin/text` | 分 Tab：基本信息 / 关于我 / 能力标签 / 联系方式 / 导航与数字 |
| `/admin/projects` | AntD Table 行内编辑 + 拖拽排序，弹窗编辑 contributions / links |
| `/admin/videos` | AntD Table，行内编辑标题/链接/平台/可见性，拖拽排序，封面上传 |
| `/admin/files` | Upload.Dragger 上传简历与文档，列表显示大小/更新时间，替换与删除 |

统一约定：

- 所有编辑为**本地草稿态**，点 [保存] 才 PUT 到服务端（避免频繁写 R2）
- 顶部固定条显示未保存标记，离开页面前 `beforeunload` 提醒
- 保存成功可选「立即发布」→ 调 `/api/deploy`

---

## 7. 迁移步骤（一次性）

1. `node scripts/seed-snapshot.mjs`：读 `src/data/portfolio.js` → 生成 `src/data/seed.json` + 上传为 `content/snapshot.json`
2. 把 `public/resume.pdf`、`public/docs/*.pdf` 上传到 R2，写入 `files[]` 并填 `publicPath`
3. `src/data/portfolio.js` 改为读 `generated.js`（§5.2）
4. `src/data/generated.js` 加入 `.gitignore`
5. 验证：`npm run build` 产物内容应与迁移前**逐字一致**

---

## 8. 需要同步修改的其他文件

- **`AGENTS.md`**：第 5 步「替换 hosted resume 文件」变更为「上传到 R2 并更新 `files[]`」；「更新 website content」的目标从 `src/data/portfolio.js` 变更为后台 / `snapshot.json`。**不改会导致 AI 以后把内容改到错的地方。**
- **`.gitignore`**：新增 `src/data/generated.js`
- **`README.md`**：补后台入口与本地联调方式（`wrangler pages dev`）
- **`netlify.toml`**：若 Netlify 仍是备用部署渠道，需确认其环境变量里也有 `CONTENT_SNAPSHOT_URL`，否则构建会失败

---

## 9. 实施阶段

| 阶段 | 内容 | 产出 |
|---|---|---|
| S1 | 内容模型 + seed + 构建注入 | 站点行为不变，内容源切到 snapshot |
| S2 | Functions API + R2 + Access 鉴权 | `/api/*` 可用 |
| S3 | 后台 UI（5 个页面） | `/admin` 可用 |
| S4 | Deploy Hook + 状态显示 + 文档回填 | 闭环完成 |

S1 单独可交付、可回滚：把 `generated.js` 删掉、还原 `portfolio.js` 即回到现状。
