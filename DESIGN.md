# DESIGN.md — Dark Editorial 设计系统

> 本文件是 UI/UX 的**唯一事实来源**。任何样式改动都必须复用下方 token，不得 invented 新色值 / 字号 / 间距。

## 1. 风格定位

**深色编辑风（Dark Editorial）× SaaS 产品感**

- 编辑感：超大衬线标题、细发丝线分隔、等宽小标签、编号体系、留白驱动层级
- SaaS 感：卡片化信息块、克制的功能色、清晰的可扫描栅格
- 背景**禁止**纯黑平铺，统一使用 `radial-gradient` 光晕 + 全局颗粒噪点制造纵深

## 2. 字体

| 角色 | 字体 | 用途 |
| --- | --- | --- |
| Display | Instrument Serif / Noto Serif SC | H1、H2、数值、引言 |
| Body | Sora / Noto Sans SC | 正文，最小 16px，行高 1.65 |
| Mono | JetBrains Mono | eyebrow 标签、编号、元信息 |

禁止使用 Inter / Roboto / Arial / Open Sans / 系统默认字体作为首选。

## 3. 色板（70-20-10）

- **70% 画布**：`--canvas #07070a`、`--canvas-alt #090910`
- **20% 表面**：`--surface #101017`、`--surface-2 #16161f`
- **10% 点缀**：`--accent #8b7cf6`（主）/ `--accent-warm #e3b23c`（辅）

文本层级：`--text-1 #f4f4f7`（对比度 15:1）/ `--text-2 #a9a9ba`（5.4:1）/ `--text-3 #7c7c90`（4.6:1）
分隔线：`--line .08` / `--line-2 .16` / `--line-3 .26`（白色透明度）

## 4. 排版尺度

| Token | 值 | 用途 |
| --- | --- | --- |
| `--fs-h1` | clamp(2.75rem, 7vw, 5.75rem) | 首屏姓名 |
| `--fs-h2` | clamp(1.875rem, 3.6vw, 3.25rem) | 区块标题 |
| `--fs-h3` | clamp(1.25rem, 1.8vw, 1.625rem) | 卡片标题 |
| `--fs-lead` | clamp(1rem, 1.25vw, 1.1875rem) | 导语 |
| `--fs-body` | 1rem | 正文下限，不再缩小 |

## 5. 间距与圆角

`--s-1 4` `--s-2 8` `--s-3 12` `--s-4 16` `--s-5 24` `--s-6 32` `--s-7 48` `--s-8 64` `--s-9 96`
圆角：`--r-sm 6` / `--r-md 10` / `--r-lg 16` / `--r-pill 999`（无硬边直角）
容器：`--shell min(1240px, 100% - 48px)`；区块纵向 `--section-y clamp(72px, 9vw, 136px)`

## 6. 组件契约

- `.btn` — 最小高度 **48px**（小尺寸 44px，满足触摸目标）；变体 `--primary` / `--ghost`
- `.card` — 1px 描边 + `--surface` 底 + `10px` 圆角；`--raised` 为抬升态
- `.eyebrow` — 等宽 11px、字距 .22em、全大写、左侧 22px 引导线
- `.section-head--ruled` — 区块顶部发丝线 + 编号，构成编辑式章节起手
- `.project` — 类型标签 / 角色徽章 / 编号，链接区固定在卡片底部（`margin-top:auto`）
- `.rail` — 桌面端（≥1181px）右侧纵向章节进度轨，**记忆点组件**

## 7. 响应式断点

| 断点 | 变化 |
| --- | --- |
| ≤1180px | 隐藏侧边进度轨 |
| ≤1024px | 所有多列栅格塌缩为单列；顶栏切换为汉堡抽屉 |
| ≤640px | 容器收窄至 100%-32px；按钮撑满；卡片内边距降至 24px |

## 8. 无障碍与动效

- 焦点可见：`:focus-visible` 2px `--accent-bright` 描边，offset 3px
- 键盘可达：跳转链接、抽屉支持 `Esc` 关闭、`aria-current` 标记当前章节
- 触摸目标 ≥44×44px，相邻间距 ≥8px
- `prefers-reduced-motion: reduce` 下关闭平滑滚动与全部过渡

## 9. 禁忌

- ❌ 不在组件内硬编码色值 / 字号 / 间距
- ❌ 不使用纯白或纯灰平铺背景
- ❌ 不新增未在此登记的设计 token
- ❌ 不破坏既有栅格密度与区块顺序
