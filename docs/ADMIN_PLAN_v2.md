# 管理后台实施方案 v2（Netlify 版）

> 状态：**已实施**（2026-09-11 审批通过，S1–S4 一次做完） · 版本 v2
> 与本文的偏差记录在 §12。旧的 Cloudflare 方案 `docs/ADMIN_DESIGN.md` 已删除。
> 目标：管理**文件**（简历 PDF / 文档 / 封面图）、**视频链接**、**全站文本内容**。
> 取代 `docs/ADMIN_DESIGN.md`（v1，Cloudflare 方案，与现状不符）。

---

## 0. 先说结论

**推荐方案 A：Git 回写型后台。**

后台改内容 → Netlify Function 持有 GitHub Token 提交回仓库 → Netlify 检测 Git 变更自动重建 → 线上生效。

理由三条：

1. **链路最短。** 你现在已经是 GitHub → Netlify 自动部署，内容只要在仓库里，构建时天然可读，不需要额外的"构建期拉取"步骤。
2. **零新增云服务、零月费、零外部账号。** 不引入 Cloudflare R2 / Supabase / D1。
3. **内容自带版本历史与回滚。** 每次保存就是一次 commit，误改直接 revert。这一点对你（有 Git 安全习惯）比任何后台功能都实在。

代价：发布有 40–90 秒的构建延迟；仓库会变大（可控，见 §6 风险）。

---

## 1. 现状事实

| 项 | 实际情况 |
|---|---|
| 框架 | Vite 5 + React 18，纯静态，无 CSS 框架（手写 `src/index.css`） |
| 内容源 | `src/data/portfolio.js`，单文件导出 10 个常量 |
| 部署 | `netlify.toml`：`base="."`、`npm run build`、`publish="dist"` |
| 仓库 | `https://github.com/wjn18/portfolio-site.git`，单分支 `main` |
| 设计系统 | `DESIGN.md`（Dark Editorial 深色编辑风） |

### 1.1 两处矛盾，需要你确认

- **README 第 1 行写的是 `wjn-portfolio-site.pages.dev`（Cloudflare Pages 域名），但仓库里有 `netlify.toml` 且你明确说是 Netlify。** 本文按 Netlify 设计。若实际仍在 Cloudflare Pages，方案要换成 Pages Functions，请指出。
- **`docs/ADMIN_DESIGN.md` 整份基于 Cloudflare。** 审批通过后我会把它标记为废弃（`DEPRECATED`）并链接到本文档，不直接删除，保留历史决策记录。

---

## 2. 三个候选方案对比

| | **A. Git 回写（推荐）** | B. 外部存储（Blobs/R2） | C. 现成 CMS（Decap/Tina） |
|---|---|---|---|
| 内容存放 | 仓库内 `src/data/content.json` | Netlify Blobs / Cloudflare R2 | 仓库内 Markdown/JSON |
| 后台后端 | Netlify Functions（持 GitHub PAT） | Netlify Functions | 无（浏览器直连 Git 网关） |
| 发布方式 | commit → Netlify 自动构建 | Function 触发 Build Hook | 同上 A |
| 新增依赖 | 无 | 1 个存储服务 + 1 套密钥 | Decap + Netlify Identity/Git Gateway |
| 构建期可靠性 | **内容已在仓库，不可能拉不到** | 需网络拉取，失败要 fallback | 同 A |
| 版本回滚 | Git 原生 | 需自己做快照 | Git 原生 |
| 开发量 | 中（约 1.5 天） | 中偏大 | 小（配置为主） |
| 定制自由度 | 高 | 高 | **低**，UI 与 DESIGN.md 风格冲突，后期改不动 |

**为什么不选 C：** Decap CMS 依赖 Netlify Identity + Git Gateway，Netlify 官方已弱化该产品线；且它的界面风格与你 Dark Editorial 的设计系统完全不搭，后台做完会像贴上去的一块补丁。你的内容量很小（一个 PDF + 若干视频链接 + 十几段文案），自研成本低于驯服 CMS 的成本。

**为什么不选 B：** Blobs/R2 解决了"大文件"问题，但你的视频是**外链**不是文件，真正要存的只有 PDF 和封面图，几百 KB 量级。为了这点量引入一个外部存储 + 一套构建期拉取逻辑（还要处理拉取失败的 fallback），不划算。**若将来要上传视频文件本体，再增量引入 R2 即可，A 的架构不阻碍。**

---

## 3. 架构（方案 A）

```
浏览器 /admin
    │  口令登录
    ▼
Netlify Function: auth        →  校验口令，签发 httpOnly JWT
    │
    ▼
Netlify Function: content     →  GitHub Contents API 读写 src/data/content.json
Netlify Function: files       →  上传/替换/删除 public 下文件（base64 写入，≤2MB）
Netlify Function: deploy      →  查 Netlify 最近部署状态
    │
    ▼
commit 到 main（message: "content: <摘要>"）
    │
    ▼
Netlify 检测 Git 变更  →  npm run build  →  线上生效（40–90s）
```

### 3.1 关键技术决策

| 决策 | 选择 | 理由 |
|---|---|---|
| 后台入口 | Vite 多入口 `admin/index.html` | 后台代码进 `dist/admin/`，**不进访客站 bundle**，不影响首屏体积 |
| 后台 UI 库 | **Ant Design 5** | Table/Form/Upload 开箱即用；后台是内部工具，与访客站视觉解耦 |
| 后台视觉 | 沿用 DESIGN.md 色板 token，不复制排版尺度 | 保证"看起来是同一个项目"，但不把编辑风排版硬套到表单密集界面 |
| 内容格式 | 单文件 `content.json` | 总量 < 100KB，无查询/关联需求；将来要查询再拆 D1，JSON 结构不变 |
| 鉴权 | 口令 + httpOnly JWT（HMAC-SHA256，7 天有效） | Netlify 无 Zero Trust；口令哈希与 JWT 密钥存 Netlify 环境变量 |
| 提交身份 | Fine-grained PAT，仅单仓库 `Contents: write` | Token 只在 Function 侧，浏览器永不接触 |

### 3.2 关于后台 UI 是否遵循 DESIGN.md

需要你拍板的一点：**AGENTS.md 规定 DESIGN.md 是 UI 唯一事实来源，但它的契约（超大衬线标题、发丝线、编辑式章节）是给访客站内容展示用的，不适合表单密集的后台。**

我的建议：后台**只继承 DESIGN.md 的色板与圆角 token**（`--canvas`/`--surface`/`--accent`/`--r-*`），排版与组件密度由 Ant Design 决定。这样既保持"同一个项目"的观感，又不用把 AntD 的控件一个个改造成编辑风（那是无底洞）。这条会同步写进 DESIGN.md 的适用边界说明。

---

## 4. 数据模型

`src/data/content.json` 顶层结构，字段与现有 `portfolio.js` 的导出**一一对应**，仅新增 `videos`、`files`。

```jsonc
{
  "version": 1,
  "updatedAt": "2026-09-11T02:30:00.000Z",
  "updatedBy": "admin",

  "profile":  { name, englishTitle, role, currentRole, intro, education, targets[], highlights[] },
  "actions":  [{ label, href, primary?, external?, download? }],
  "nav":      [{ label, href }],
  "spec":     [{ value, label }],
  "about":    ["段落1", "段落2", "..."],
  "skills":   [{ title, items[] }],
  "gameExperience": ["剑星（全成就）", "..."],
  "contacts": [{ label, value, href? }],

  "projects": [{                     // 新增 id / sort / visible
    id, title, subtitle, period, type, role, summary,
    contributions[], links[{label, href}], sort, visible
  }],

  "videos":   [{                     // 新增
    id, title, description?, url, cover?,
    platform: "bilibili" | "youtube" | "other",
    tags[], sort, visible, createdAt
  }],

  "files":    [{                     // 新增
    id, kind: "resume" | "doc" | "cover",
    label, filename, publicPath, size, mime, updatedAt
  }]
}
```

`publicPath` 的意义：文件上传后落到 `public/` 的固定路径（如 `/resume.pdf`），**前台 URL 保持不变，组件代码零改动**。

访客站侧改造（`src/data/portfolio.js`）只做一件事：

```js
import content from "./content.json";
export const profile = content.profile;
export const projects = content.projects.filter(p => p.visible);
export const videos   = content.videos.filter(v => v.visible);
// ...其余同理
```

**所有组件文件零改动**，导出名与形状完全不变。这是低风险的关键。

---

## 5. 后台页面

| 路由 | 功能 |
|---|---|
| `/admin` | 登录 + Dashboard：上次保存时间、部署状态、未保存提醒 |
| `/admin/text` | 分 Tab：基本信息 / 关于我 / 能力标签 / 游戏经历 / 联系方式 / 导航与数字 |
| `/admin/projects` | 项目增删改、拖拽排序、`visible` 开关、contributions/links 子项编辑 |
| `/admin/videos` | 视频链接表：标题 / 链接 / 平台 / 标签 / 排序 / 可见性，封面上传 |
| `/admin/files` | 简历与文档上传替换、列表（大小/更新时间）、删除 |

统一交互约定：

- 编辑为**本地草稿态**，点「保存」才提交；顶部固定条显示未保存标记，`beforeunload` 拦截误关
- 保存弹窗二选一：**「仅保存」**（commit message 带 `[skip netlify]`，不触发构建）与 **「保存并发布」**（立即构建）
- 乐观锁：提交时带 `baseUpdatedAt`，服务端比对不一致返回 409，防止多端覆盖

---

## 6. API 设计

Base：`/.netlify/functions/*`（netlify.toml 里 rewrite 成 `/api/*`）

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/auth/login` | 口令登录 → 设置 httpOnly cookie |
| POST | `/api/auth/logout` | 清除 cookie |
| GET | `/api/session` | 当前登录态 |
| GET | `/api/content` | 读取整份 content.json |
| PUT | `/api/content` | 全量覆盖保存（乐观锁） |
| POST | `/api/files` | 上传文件（multipart，≤2MB） |
| DELETE | `/api/files/:id` | 删除文件并从 files[] 移除 |
| GET | `/api/deploy/status` | 最近一次 Netlify 部署状态 |

统一响应：`{ ok: true, data }` / `{ ok: false, error: { code, message } }`

错误码：`UNAUTHORIZED 401` · `VALIDATION 422` · `CONFLICT 409` · `NOT_FOUND 404` · `UPSTREAM 502`

---

## 7. 目录结构（新增部分）

```
portfolio-site/
├─ admin/                        # 后台前端（独立入口）
│  ├─ index.html
│  ├─ main.jsx
│  ├─ App.jsx                    # Layout + 侧边导航 + 未保存状态
│  ├─ api.js                     # fetch 封装，统一带 credentials
│  └─ pages/
│     ├─ LoginPage.jsx
│     ├─ DashboardPage.jsx
│     ├─ TextPage.jsx
│     ├─ ProjectsPage.jsx
│     ├─ VideosPage.jsx
│     └─ FilesPage.jsx
│
├─ netlify/
│  ├─ functions/
│  │  ├─ auth.mjs
│  │  ├─ content.mjs
│  │  ├─ files.mjs
│  │  └─ deploy.mjs
│  └─ lib/
│     ├─ github.mjs              # Contents API 封装（读 / 写 / 带 sha 的更新）
│     ├─ jwt.mjs                 # HMAC 签发与校验
│     └─ guard.mjs               # 鉴权中间件 + 结构校验
│
├─ scripts/
│  └─ seed-content.mjs           # 一次性：portfolio.js → content.json
│
└─ src/data/
   ├─ content.json               # 【入库】内容唯一事实来源
   └─ portfolio.js               # 改为薄适配层，读 content.json
```

需改动：`vite.config.js`（多入口）、`netlify.toml`（functions 目录 + `/api` rewrite）、`.gitignore`（无需新增）。
本地联调用 `netlify dev`（不是 `npm run dev`），因为要跑 Functions。

---

## 8. 实施阶段

| 阶段 | 内容 | 交付验证标准 |
|---|---|---|
| **S1** | `seed-content.mjs` 生成 `content.json`；`portfolio.js` 改薄适配层 | `npm run build` 产物与改造前**逐字一致**；删掉适配层即可回滚 |
| **S2** | Netlify Functions + GitHub API + 口令鉴权 | `/api/content` 读写通；未登录调写接口返 401 |
| **S3** | 后台 6 个页面 | 文本内容、项目、视频、文件四类均可增删改并成功发布 |
| **S4** | 部署状态显示、文档回填 | Dashboard 能看到构建中/成功；README、AGENTS.md 同步更新 |

S1 单独可交付、可回滚。**建议 S1 先做，验收通过再进 S2。**

---

## 9. 风险与对策

| 风险 | 等级 | 对策 |
|---|---|---|
| 仓库体积膨胀 | 中 | 上传限 2MB/文件；图片走 webp 压缩后再传；视频只存外链不存文件 |
| GitHub PAT 泄露 | 高 | 只存 Netlify 环境变量；fine-grained 限单仓库、仅 Contents 写权限；浏览器不可见；定期轮换 |
| 后台被扫描/爆破 | 中 | Function 侧简单速率限制（同 IP 5 次/分钟失败即冷却）；`/admin` 加 `noindex` |
| 构建期内容异常 | 低 | 内容在仓库内，不存在拉取失败；`content.json` 加 JSON Schema 校验，坏数据在本地 prebuild 就报错 |
| Netlify Functions 免费额度 | 低 | 125k 请求/月，个人后台远远用不完 |

---

## 10. 需要你拍板的 4 件事

1. **部署平台**：Netlify（本文假设）还是仍在 Cloudflare Pages？README 与 netlify.toml 冲突，必须确认。
2. **方案选型**：确认 A（Git 回写）/ 还是选 B（Blobs/R2）/ C（现成 CMS）。
3. **后台 UI**：确认允许 Ant Design，且后台只继承 DESIGN.md 色板、不套编辑风排版。
4. **阶段推进方式**：S1 单独验收后再继续，还是一次性做完 S1–S4 再统一验收？

---

## 11. 迁移后对 AI 协作规则的影响

审批通过后需同步改动，否则我以后会把内容改到错的地方：

- **`AGENTS.md`**：第 5 步「替换 hosted resume 文件」→ 改为「后台上传或更新 `src/data/content.json` 的 `files[]`」；「更新 website content」的目标从 `portfolio.js` 改为 `content.json`（`portfolio.js` 变为只读适配层）。
- **`docs/ADMIN_DESIGN.md`**：已删除（Cloudflare 方案，已弃用）。
- **`README.md`**：已补后台入口 `/admin`、本地联调命令 `npx netlify dev`、环境变量清单；并去掉了 `pages.dev` 这个已失效的 Cloudflare 域名。

---

## 12. 实施记录：与本文的偏差

审批时定了三件事，实施时据此偏离了原文：

1. **后台 UI 不用 Ant Design，改原生 React + 一份 `admin/styles.css`。**
   理由是「从简、看得清楚就行」，不值得为一个内部工具引入 ~1MB 依赖和另一套设计语言。
   代价：没有现成的 Table/Upload 组件，列表编辑器（一行一条的 textarea）和排序按钮是手写的。

2. **文件上传走 JSON + base64，不走 multipart。**
   前端用 `FileReader` 转 base64 后 POST，后端直接转交 GitHub Contents API。
   省掉了在 Function 里手写 multipart 解析器。单文件上限 2MB。

3. **`publicPath` 由后端生成，不接受前端指定。**
   resume → `/resume.pdf`，doc → `/docs/<name>`，cover → `/covers/<name>`。
   避免任意路径写入。

### 实施后的验证结果

| 项 | 结果 |
|---|---|
| 访客站 JS 总量 | 154.66 kB（改造前 154.68 kB，几乎不变） |
| 访客站 CSS | 19.15 kB（与改造前一致） |
| 访客站渲染文案 | 关键文案 7/7 命中（姓名、项目、游戏经历、联系方式…） |
| S1 基线比对 | 中文文案 159/159 零缺失，index.html 归一化 hash 后逐字一致 |
| 后端冒烟测试 | 13/13 通过（`npm run test:functions`） |
| 后台产物 | `admin` JS 23.71 kB + CSS 3.37 kB，与访客站 bundle 分离 |

### 上线前还需要你做的一次性配置

Netlify 后台 → Site configuration → Environment variables 里加 5 个变量：

- `GITHUB_TOKEN`（fine-grained PAT，限定本仓库 Contents: read + write）
- `GITHUB_REPO` = `wjn18/portfolio-site`
- `ADMIN_PASSWORD_SHA256`（口令的 sha256）
- `JWT_SECRET`（随机长字符串）
- `NETLIFY_TOKEN` + `NETLIFY_SITE_ID`（可选，配了后台才能显示部署状态）

口令哈希生成：

```bash
node -e "console.log(require('crypto').createHash('sha256').update('你的口令').digest('hex'))"
```
