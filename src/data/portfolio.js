/**
 * 内容数据源（唯一事实来源）
 * 所有文案均来自原 App.jsx，未做任何事实性改动。
 * resume.pdf 更新时，同步维护本文件即可驱动全站内容。
 */

export const profile = {
  name: "吴嘉宁",
  englishTitle: "Game Design Portfolio",
  role: "游戏开发全栈工程师",
  currentRole: "游戏开发全栈工程师",
  intro:
    "目前在职游戏开发全栈工程师，专注 Unity 6 与游戏 Agent Harness 工程的开发：把 Unity 6 的引擎能力、编辑器接口与验证闭环封装成 AI Agent 可安全调用的工具层，让 Agent 真正能改工程、能验证、能回滚。",
  education: "南安普顿大学 · 计算机科学本科\n2024.09 - 2027.06",
  targets: ["游戏开发全栈工程师", "Agent Harness 工程", "游戏工具链 / 编辑器扩展", "战斗系统设计"],
  highlights: [
    "专注 Unity 6 与游戏 Agent Harness 工程：工具层封装、上下文管理与执行闭环设计",
    "具备游戏全栈开发能力，覆盖玩法原型、编辑器工具与自动化流程",
    "有战斗系统设计与战斗美术表现经验，习惯用可玩原型快速验证想法",
  ],
};

export const actions = [
  { label: "在线查看简历", href: "/resume.pdf", primary: true, external: true },
  { label: "下载简历", href: "/resume.pdf", external: true, download: true },
];

export const projects = [
  {
    title: "Unity 炸弹人复刻",
    subtitle: "Unity 个人项目 / 经典玩法复刻 / 网格对战",
    period: "2026.08 - 开发中",
    type: "Unity Project",
    role: "独立完成",
    summary:
      "对经典炸弹人玩法的 Unity 复刻。玩家在网格地图中放置炸弹、利用十字爆炸与连锁引爆清场，同时规避自己的爆炸范围并与敌人周旋，目标是把原作的规则与手感完整还原并做出可玩的对战节奏。",
    contributions: [
      "使用 Unity + C# 从零搭建网格地图、炸弹放置与爆炸连锁逻辑",
      "梳理炸弹数量、爆炸范围、道具成长等规则，并拆成可调的数值与配表",
      "设计敌人 AI 行为与关卡布局，验证单局节奏与对战可玩性",
      "打磨引爆的特效、顿帧与音效反馈，强化放置与引爆的爽感",
    ],
    links: [],
  },
];

export const skillGroups = [
  {
    title: "Agent Harness 工程",
    items: [
      "设计面向游戏开发的 Agent Harness：工具层、上下文层与执行闭环",
      "为 Agent 封装引擎侧能力：Editor 自动化、场景与资产读写、运行时状态查询",
      "设计权限边界、改动预检与回滚策略，控制 Agent 改动工程的风险",
    ],
  },
  {
    title: "游戏全栈开发",
    items: [
      "以 Unity 6 为主力引擎，同时具备 Godot 与 UE5 的实操经验",
      "使用 C# / Python / TypeScript 完成从玩法原型到工具链的端到端开发",
      "熟悉数据驱动架构：配置表 → 导入器 → 运行时数据，支撑策划自助改数值",
    ],
  },
  {
    title: "自动化与验证",
    items: [
      "搭建自动化构建、冒烟与回归流程，减少重复人力投入",
      "用双验证机制校验 Agent 产出：视觉检测 + 运行时状态 / 内存检测",
      "开发编辑器扩展与外部接口（如 MCP），把重复性工作工具化",
    ],
  },
  {
    title: "设计与文档表达",
    items: [
      "能独立输出战斗系统方案，并用可玩 Demo 快速验证手感与节奏",
      "对动作节奏、顿帧、镜头与打击反馈有较多拆解与实践",
      "熟练使用 Xmind、Excel、Axure 输出方案、数值表与界面流程",
    ],
  },
];

export const gameExperience = [
  "剑星（全成就）",
  "艾尔登法环（128h）",
  "博德之门 3（200h+）",
  "燕云十六声（100h+）",
  "命运 2（120h+）",
  "三角洲行动（100h+）",
  "皇室战争（200h+）13000皇冠",
  "黑神话：悟空（50h）",
  "王国保卫战 / Thronefall / 战争传说 / 王者荣耀 等",
];

export const contacts = [
  { label: "邮箱", value: "2757286950@qq.com", href: "mailto:2757286950@qq.com" },
  { label: "电话", value: "18367367610", href: "tel:18367367610" },
  { label: "微信", value: "ILEve041818" },
];

export const aboutParagraphs = [
  "我是吴嘉宁，21 岁，在职游戏开发全栈工程师，目前专注 Unity 6 与游戏 Agent Harness 工程的开发。相比单点做功能，我更在意把引擎能力、工具链和验证闭环搭起来，让 AI Agent 能真正安全地改一个 Unity 工程。",
  "我长期关注 ARPG、动作游戏与 MMORPG，也在工程侧持续投入：Agent 工具链、编辑器扩展与自动化验证，是我现在花时间最多的方向。",
  "一些闲聊：我的游戏生涯开始于小学一年级，那时我表哥在电脑上玩4399小游戏。随着智能手机普及，我也在手机上接触了植物大战僵尸，汤姆猫等等有趣的游戏。随后的日子里，我在闲暇之余便会打开手机搜搜新的游戏，整个小学时期我至少已经玩过并通关50款游戏。",
  "从此之后游戏成为了我人生重要的一部分，他的美妙超过世界上任何一种娱乐，对我来说他就是真正的“第九艺术”。进入大学以后，我就打算毕业以后做游戏，后来我意识到其实并不一定要等毕业，我可以在空余时间开发，于是我就开始了自己的游戏开发之路。",
  "希望热爱和初心一直在，正在看这段话的你也是。",
];

export const navItems = [
  { label: "首页", href: "#home" },
  { label: "作品", href: "#works" },
  { label: "关于", href: "#about" },
  { label: "联系", href: "#contact" },
];

export const specCells = [
  { value: "01", label: "在研项目" },
  { value: "04", label: "核心能力方向" },
  { value: "09", label: "深度体验游戏类型" },
];
