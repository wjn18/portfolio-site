# Portfolio 项目长期笔记

## 部署

- 平台：**Netlify**（Git 触发，push `main` 即构建）。Cloudflare Pages 已弃用。
- 线上地址：**https://wjn18-portfolio-site.netlify.app**
- 后台入口：**https://wjn18-portfolio-site.netlify.app/admin**
- 仓库：`wjn18/portfolio-site`，单分支 `main`
- 跳过构建：commit message 里写 `[skip netlify]`

## 内容架构（2026-09-11 起）

- **唯一事实来源：`src/data/content.json`**。改网站文案改这里，或走 `/admin` 后台。
- `src/data/portfolio.js` 是**只读适配层**（字段映射），改它不改变网站内容。
- 后台保存 = 一次 Git commit，可 revert。
- 约束：`about` 至少 5 段（第 1 段自我介绍、末段收尾）；`profile.education` 换行分隔（学校 / 时间）；视频只存外链。

## 后台

- 前端：`admin/`（原生 React + `admin/styles.css`，不用 AntD —— 吴总要求从简、只要看得清楚）
- 后端：`netlify/functions/`（auth / content / files / deploy）+ `netlify/lib/`（github / jwt / guard）
- 本地联调：**必须 `npx netlify dev`**（不是 `npm run dev`），站点与后台都在 `http://localhost:8888`
  - `netlify.toml` 的 `[dev] targetPort = 4173` 不能删：本项目 vite 端口是 4173，Netlify 默认等 5173，不声明就启动超时
  - **agent 沙箱里跑不起来**：CLI 调 `wmic.exe` 被 Program Blacklist 拦 + `EPERM rmdir .netlify/functions-serve`。只能吴总自己终端跑
  - 本地口令写在 `.env`（不入库），模板见 `.env.example`（入库）
- 回归测试：`npm run test:functions`（不联网，13 项）
- 必填环境变量：`GITHUB_TOKEN`、`GITHUB_REPO`、`ADMIN_PASSWORD_SHA256`、`JWT_SECRET`；可选 `NETLIFY_TOKEN` + `NETLIFY_SITE_ID`（配了才显示部署状态）
- 改完环境变量必须重新部署才生效

## 约定

- 设计系统以 `DESIGN.md` 为准（Dark Editorial 深色编辑风，非 AGENTS.md 里写的 Airbnb 白底）
- AI 协作规则见 `AGENTS.md`（内容源已指向 content.json）
- `.workbuddy/memory` 照旧入仓（吴总拍板，不加入 .gitignore）

## 环境坑

- Bash 工具 PATH 损坏，用前先贴：
  `export PATH="/c/Users/Administrator/.workbuddy/binaries/PortableGit/versions/1.2.0/usr/bin:/c/Users/Administrator/.workbuddy/binaries/PortableGit/versions/1.2.0/bin:/c/Program Files/nodejs:/usr/bin:/bin:$PATH"`
- PowerShell 工具 stdout 被吞（exit 0 无输出），取结果只用 Bash
- 本机 `npm` 走 wsl.exe 会被沙箱拦截，用 `node node_modules/vite/bin/vite.js build` 代替
- 终端中文显示成 GBK 乱码，文件本身正常，用 Read 工具确认
