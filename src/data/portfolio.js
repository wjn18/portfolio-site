/**
 * 内容数据源（唯一事实来源）
 * 所有文案均来自原 App.jsx，未做任何事实性改动。
 * resume.pdf 更新时，同步维护本文件即可驱动全站内容。
 */

export const unityDemoVideoHref =
  "https://www.bilibili.com/video/BV1gvXiBSEjx/?share_source=copy_web&vd_source=a2e61c6d61d8bfc0fad6ebcde9ac1d85";
export const ue5DemoVideoHref =
  "https://www.bilibili.com/video/BV1hVRBB8En3/?share_source=copy_web&vd_source=a2e61c6d61d8bfc0fad6ebcde9ac1d85";
export const unityDemoDesignHref = "/docs/unity3d-arpg-battle-system-demo-design.pdf";
export const ue5DemoFileHref = "https://pan.baidu.com/s/1IPX7dLClaLcBYdBtzkrzgQ?pwd=h5rq";
export const ue5DemoDesignHref = "/docs/ue5-open-world-city-level-demo.pdf";

export const profile = {
  name: "吴嘉宁",
  englishTitle: "Game Design Portfolio",
  role: "系统策划 / 战斗拆解 / 关卡分析 / 关卡原型",
  intro:
    "目前就读于南安普顿大学计算机科学本科，进行过系统策划案撰写、商业游戏拆解分析与 Unity 玩法原型开发，希望进入游戏行业，创造真正对玩家体验有价值的内容。",
  education: "南安普顿大学 · 计算机科学本科\n2024.09 - 2027.06",
  targets: ["系统策划", "数值策划", "关卡策划", "战斗策划", "技术策划"],
  highlights: [
    "能独立输出系统策划案、拆解文档、脑图与基础表格方案",
    "具备 Unity Demo 实操经验，可用 C# 完成玩法原型验证",
    "长期深度体验 ARPG、MMORPG、FPS、塔防与叙事驱动类游戏",
  ],
};

export const actions = [
  { label: "在线查看简历", href: "/resume.pdf", primary: true, external: true },
  { label: "下载简历", href: "/resume.pdf", external: true, download: true },
  { label: "观看 Demo 视频", href: ue5DemoVideoHref, external: true },
];

export const projects = [
  {
    title: "Unity3D ARPG 战斗系统 Demo",
    subtitle: "Unity 个人项目 / 第三人称俯视角 ARPG / 战斗系统验证",
    period: "2026.02 - 开发中",
    type: "Unity Demo",
    role: "独立完成",
    summary:
      "一款第三人称俯视角 ARPG 战斗系统 Demo。玩家操控角色与敌人进行小兵战和 Boss 战，重点展示我在战斗原型、敌我交互和玩法验证上的落地能力。",
    contributions: [
      "使用 Unity 2023、C#、Blender 进行原型开发与迭代",
      "独立完成玩法雏形、敌我交互和战斗细节",
      "将策划思路转化为可运行 Demo，用于验证玩法节奏与系统可行性",
    ],
    links: [
      { label: "视频演示链接", href: unityDemoVideoHref },
      { label: "策划案链接", href: unityDemoDesignHref },
    ],
  },
  {
    title: "UE5 开放世界城市关卡设计 Demo（灰盒）",
    subtitle: "UE5 个人项目 / 开放世界城市关卡设计 / 灰盒验证",
    period: "2026.05 - 开发中",
    type: "UE5 Demo",
    role: "独立完成",
    summary:
      "一个以开放世界城市区域为核心的 UE5 灰盒关卡 Demo，围绕多样玩法路径、探索引导与空间节奏进行验证，重点展示我将关卡设计思路落到可游玩场景中的能力。",
    contributions: [
      "使用 UE5 进行城市灰盒搭建、空间迭代与关卡验证",
      "梳理兴趣点游玩动线、地标引导与区域节奏分配",
      "将设计文档落地至场景灰盒，结合演示视频，用于验证关卡方案可行性",
    ],
    links: [
      { label: "视频演示链接", href: ue5DemoVideoHref },
      { label: "Demo文件链接", href: ue5DemoFileHref },
      { label: "设计文档链接", href: ue5DemoDesignHref },
    ],
  },
  {
    title: "《燕云十六声》新家业系统策划案",
    subtitle: "系统策划 / 资源循环 / 玩法扩展",
    period: "2025.08",
    type: "系统策划案",
    role: "独立完成",
    summary:
      "围绕现有家业系统的体验问题，提出结合建造、生产与守村玩法的改造方向，强化资源消耗、重复游玩价值与世界观合理性，同时兼顾开发成本与功能复用率。",
    contributions: [
      "将建造系统与守村战斗绑定，提升已有功能利用率",
      "设计庄客战斗等级、资源循环与长线成长体验",
      "从商业产品视角考虑开发成本、内容复用与长期留存",
    ],
    links: [
      { label: "站内查看 PDF", href: "/docs/yanyun-home-system-plan.pdf" },
      { label: "金山文档版本", href: "https://www.kdocs.cn/l/ctnEh5PqZ3za" },
    ],
  },
  {
    title: "《真三国无双：起源》战斗系统拆解",
    subtitle: "战斗分析 / 资源管理 / 节奏设计",
    period: "2025.07",
    type: "战斗拆解",
    role: "独立完成",
    summary:
      "从武器差异、关卡路径、士气与资源管理等角度分析其高爽感与策略感并存的原因，总结战场压力如何分阶段投放，并讨论系列创新与经典保留之间的平衡。",
    contributions: [
      "分析武器、路线、士气与战场资源之间的联动逻辑",
      "总结敌兵与武将压力的分阶段投放方式",
      "从产品定位角度讨论爽感、策略与老玩家预期的平衡",
    ],
    links: [
      { label: "站内查看 PDF", href: "/docs/dynasty-warriors-origin-analysis.pdf" },
      { label: "金山文档版本", href: "https://www.kdocs.cn/l/cl7RBZHv5pXh" },
    ],
  },
  {
    title: "《剑星》战斗动作拆解",
    subtitle: "动作表现 / 镜头语言 / 打击反馈",
    period: "2025.09",
    type: "动作拆解",
    role: "独立完成",
    summary:
      "围绕连续进攻动作进行逐帧拆解，分析动作节奏、镜头处理、特效配合与打击反馈如何共同构成爽感，并从动作表现反推产品受众定位与风格表达。",
    contributions: [
      "聚焦关键帧、顿帧、镜头拉近与动态模糊的配合方式",
      "分析较慢动作节奏与更广受众定位之间的关系",
      "从表现设计反推动作策略与风格化表达逻辑",
    ],
    links: [{ label: "站内查看 PDF", href: "/docs/stellar-blade-analysis.pdf" }],
  },
  {
    title: "《天国：拯救 2》序章关卡拆解",
    subtitle: "关卡设计 / 教学引导 / 环境叙事",
    period: "2025.10",
    type: "关卡拆解",
    role: "独立完成",
    summary:
      "以序章新手关为样本，分析开放世界叙事驱动关卡中的空间结构、机制教学、情绪曲线与沉浸式引导，重点总结教程设计如何自然融入剧情和场景逻辑。",
    contributions: [
      "分析地图结构、潜行机制与环境叙事的配合",
      "关注非封闭式关卡中的引导方式与节奏控制",
      "总结教程设计如何融入剧情推进与空间逻辑",
    ],
    links: [
      { label: "站内查看 PDF", href: "/docs/kingdom-come-2-level-analysis.pdf" },
      { label: "金山文档版本", href: "https://www.kdocs.cn/l/ci6dPy89l2US" },
    ],
  },
];

export const skillGroups = [
  {
    title: "系统策划与文档输出",
    items: [
      "熟悉 MMORPG、ARPG、FPS 等商业游戏的开发流程与商业模式",
      "能够独立完成系统策划案、拆解文档、思维导图与基础表格方案",
      "了解关卡设计、敌人 AI、动作设计等相关内容",
    ],
  },
  {
    title: "工具与表达能力",
    items: [
      "熟练使用 Xmind、Excel、Axure",
      "可使用 Excel 进行数值表设计、资源消耗测算与简单推演",
      "可使用 Axure 梳理界面结构与基础交互流程",
    ],
  },
  {
    title: "开发与原型能力",
    items: [
      "熟悉 Java、Python、C# 的基础开发流程",
      "了解 Unity 与 UE5，具备 Unity 3D 和UE5 实操经验",
      "可使用 C# 在 Unity 中编写脚本并完成玩法原型验证",
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
  "我是吴嘉宁，21 岁。相比只停留在“喜欢玩游戏”，我更习惯把游戏体验转化为可复用的输出：文档、流程、表格，以及能够验证想法的玩法原型。",
  "我长期关注 ARPG、MMORPG、FPS、塔防与叙事驱动类游戏，愿意投入大量时间研究新作、复盘机制并整理设计思路，也希望在职业路径中持续深化这件事。",
  "一些闲聊：我的游戏生涯开始于小学一年级，那时我表哥在电脑上玩4399小游戏。随着智能手机普及，我也在手机上接触了植物大战僵尸，汤姆猫等等有趣的游戏。随后的日子里，我在闲暇之余便会打开手机搜搜新的游戏，整个小学时期我至少已经玩过并通关50款游戏。",
  "从此之后游戏成为了我人生重要的一部分，他的美妙超过世界上任何一种娱乐，对我来说他就是真正的“第九艺术”。进入大学以后，我就打算毕业以后做游戏，后来我意识到其实并不一定要等毕业，我可以在空余时间开发，于是我就开始了自己的游戏开发之路。",
  "希望热爱和初心一直在，正在看这段话的你也是。",
];

export const navItems = [
  { label: "作品", href: "#works" },
  { label: "关于", href: "#about" },
  { label: "联系", href: "#contact" },
];

export const specCells = [
  { value: "02", label: "核心 Demo 项目" },
  { value: "05", label: "策划案 / 拆解文档" },
  { value: "09", label: "深度体验游戏类型" },
];
