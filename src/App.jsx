import React from "react";
import profilePhoto from "../IDphoto.PNG";

const unityDemoVideoHref =
  "https://www.bilibili.com/video/BV1gvXiBSEjx/?share_source=copy_web&vd_source=a2e61c6d61d8bfc0fad6ebcde9ac1d85";
const ue5DemoVideoHref =
  "https://www.bilibili.com/video/BV1hVRBB8En3/?share_source=copy_web&vd_source=a2e61c6d61d8bfc0fad6ebcde9ac1d85";
const unityDemoDesignHref = "/docs/unity3d-arpg-battle-system-demo-design.pdf";
const ue5DemoFileHref = "https://pan.baidu.com/s/1IPX7dLClaLcBYdBtzkrzgQ?pwd=h5rq";
const ue5DemoDesignHref = "https://www.kdocs.cn/l/cgvYIQXVailB";

const profile = {
  name: "吴嘉宁",
  englishTitle: "Game Design Portfolio",
  role: "系统策划 / 战斗拆解 / 关卡分析 / Unity 原型",
  intro:
    "目前就读于南安普顿大学计算机科学本科，长期进行系统策划案撰写、商业游戏拆解分析与 Unity 玩法原型开发，希望进入游戏行业，从系统设计、玩法分析和原型验证的结合点创造真正对玩家体验有价值的内容。",
  education: "南安普顿大学 · 计算机科学本科\n2024.09 - 2027.06",
  targets: ["系统策划", "数值策划", "关卡策划", "战斗策划", "技术策划"],
  highlights: [
    "能独立输出系统策划案、拆解文档、脑图与基础表格方案",
    "具备 Unity Demo 实操经验，可用 C# 完成玩法原型验证",
    "长期深度体验 ARPG、MMORPG、FPS、塔防与叙事驱动类游戏",
  ],
};

const actions = [
  { label: "在线查看简历", href: "/resume.pdf", primary: true, external: true },
  { label: "下载简历", href: "/resume.pdf", download: true },
  {
    label: "观看 Demo 视频",
    href: ue5DemoVideoHref,
    external: true,
  },
];

const projects = [
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
      {
        label: "游玩视频链接",
        href: unityDemoVideoHref,
      },
      {
        label: "策划案链接",
        href: unityDemoDesignHref,
      },
    ],
  },
  {
    title: "UE5 开放世界城市关卡设计 Demo（灰盒）",
    subtitle: "UE5 个人项目 / 开放世界城市关卡设计 / 灰盒验证",
    period: "2026.05 - 开发中",
    type: "UE5 Demo",
    role: "独立完成",
    summary:
      "一个以开放世界城市区域为核心的 UE5 灰盒关卡 Demo，围绕街区尺度、路径组织、探索引导与空间节奏进行验证，重点展示我将关卡设计思路落到可游玩场景中的能力。",
    contributions: [
      "使用 UE5 进行城市灰盒搭建、空间迭代与关卡验证",
      "独立梳理街区动线、地标引导与区域节奏分配",
      "将设计文档、场景灰盒与演示视频结合，用于验证关卡方案可行性",
    ],
    links: [
      {
        label: "视频演示链接",
        href: ue5DemoVideoHref,
      },
      {
        label: "Demo文件链接",
        href: ue5DemoFileHref,
      },
      {
        label: "设计文档站内查看",
        href: ue5DemoDesignHref,
      },
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

const skillGroups = [
  {
    title: "系统策划与文档输出",
    items: [
      "熟悉 MMORPG、二次元卡牌、FPS 等商业游戏的开发流程与商业模式",
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
      "了解 Unity 与 UE5，具备 Unity Demo 实操经验",
      "可使用 C# 在 Unity 中编写脚本并完成玩法原型验证",
    ],
  },
];

const gameExperience = [
  "剑星（全成就）",
  "艾尔登法环（128h）",
  "博德之门 3（200h+）",
  "燕云十六声（100h+）",
  "命运 2（120h+）",
  "三角洲行动（100h+）",
  "皇室战争（200h+）12000皇冠",
  "黑神话：悟空（50h）",
  "王国保卫战 / Thronefall / 战争传说 / 王者荣耀 等",
];

const contacts = [
  { label: "邮箱", value: "2757286950@qq.com", href: "mailto:2757286950@qq.com" },
  { label: "电话", value: "18367367610", href: "tel:18367367610" },
  { label: "微信", value: "ILEve041818" },
];

const sectionCards = [
  {
    title: "系统感",
    desc: "能把玩法目标、资源循环、奖励结构与体验节奏串联起来分析，而不只停留在感性评价。",
  },
  {
    title: "表达力",
    desc: "能把复杂内容整理成策划文档、脑图、表格与界面流程，方便团队理解与推进。",
  },
  {
    title: "落地意识",
    desc: "知道什么想法适合写方案，什么内容必须做原型验证，重视可实现性与实际开发成本。",
  },
];

function LinkButton({ item }) {
  return (
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      download={item.download}
      className={item.primary ? "button button-primary" : "button button-secondary"}
    >
      {item.label}
    </a>
  );
}

function ContactCard({ item }) {
  const isLink = typeof item.href === "string" && item.href.length > 0;
  const isExternal = isLink && item.href.startsWith("http");
  const Component = isLink ? "a" : "div";

  return (
    <Component
      href={isLink ? item.href : undefined}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className="contact-card"
    >
      <div className="contact-label">{item.label}</div>
      <div className="contact-value">{item.value}</div>
    </Component>
  );
}

export default function App() {
  return (
    <div className="page-shell">
      <div className="page-glow page-glow-left" />
      <div className="page-glow page-glow-right" />

      <div className="site-wrap">
        <header className="topbar">
          <div className="brand-block">
            <div className="eyebrow">{profile.englishTitle}</div>
            <div className="brand-name">{profile.name}</div>
            <div className="brand-role">{profile.role}</div>
          </div>

          <div className="topbar-photo-wrap" aria-hidden="true">
            <img className="topbar-photo" src={profilePhoto} alt="" />
          </div>

          <nav className="topnav">
            <a href="#home">首页</a>
            <a href="#works">代表作品</a>
            <a href="#skills">能力优势</a>
            <a href="#about">关于我</a>
            <a href="#contact">联系方式</a>
          </nav>
        </header>

        <main>
          <section id="home" className="hero-grid">
            <div className="panel hero-panel">
              <h1>
                我把“喜欢玩游戏”
                <span>做成了可展示的作品和能力</span>
              </h1>
              <p className="hero-copy">{profile.intro}</p>

              <div className="button-row">
                {actions.map((item) => (
                  <LinkButton key={item.label} item={item} />
                ))}
              </div>

              <div className="highlight-grid">
                {profile.highlights.map((item) => (
                  <div key={item} className="mini-card">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="side-stack">
              <div className="panel">
                <div className="section-label">教育经历</div>
                <div className="side-strong">{profile.education}</div>
              </div>

              <div className="panel">
                <div className="section-label">目标岗位</div>
                <div className="tag-list">
                  {profile.targets.map((item) => (
                    <div key={item} className="tag-item">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="section-label">一句话总结</div>
                <p className="muted-copy">
                  擅长把玩家体验拆成系统逻辑，把设计思路落成文档，再把关键玩法做成
                  Unity 原型。
                </p>
              </div>
            </div>
          </section>

          <section className="three-up">
            {sectionCards.map((item) => (
              <article key={item.title} className="panel">
                <h3>{item.title}</h3>
                <p className="muted-copy">{item.desc}</p>
              </article>
            ))}
          </section>

          <section id="works" className="section-block">
            <div className="section-label">Selected Works</div>
            <h2>代表作品</h2>
            <p className="section-copy">
              这些内容覆盖了我目前最核心的能力方向：系统策划、战斗与关卡拆解、动作表现分析，以及 Unity 原型开发。
            </p>

            <div className="project-grid">
              {projects.map((project) => (
                <article key={project.title} className="panel project-card">
                  <div className="project-head">
                    <div>
                      <div className="project-type">{project.type}</div>
                      <h3>{project.title}</h3>
                      <div className="project-subtitle">{project.subtitle}</div>
                    </div>
                    <div className="role-badge">{project.role}</div>
                  </div>

                  <div className="project-period">{project.period}</div>
                  <p className="muted-copy">{project.summary}</p>

                  <div className="bullet-list">
                    {project.contributions.map((item) => (
                      <div key={item} className="mini-card">
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="link-row">
                    {project.links.map((link) => (
                      <a
                        key={`${project.title}-${link.href}`}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                        className="inline-link"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="skills" className="section-block">
            <div className="section-label">Skills</div>
            <h2>能力优势</h2>

            <div className="skill-grid">
              {skillGroups.map((group) => (
                <article key={group.title} className="panel">
                  <h3>{group.title}</h3>
                  <div className="bullet-list">
                    {group.items.map((item) => (
                      <div key={item} className="mini-card">
                        {item}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="about" className="about-grid">
            <article className="panel">
              <div className="section-label">About Me</div>
              <h2>关于我</h2>
              <p className="section-copy">
                我是吴嘉宁，21 岁。相比只停留在“喜欢玩游戏”，我更习惯把游戏体验转化为可复用的输出：文档、流程、表格，以及能够验证想法的玩法原型。
              </p>
              <p className="section-copy">
                我长期关注 ARPG、MMORPG、FPS、塔防与叙事驱动类游戏，愿意投入大量时间研究新作、复盘机制并整理设计思路，也希望在职业路径中持续深化这件事。
              </p>
              <p className="section-copy">
                一些闲聊：我的游戏生涯开始于小学一年级，那时我表哥在电脑上玩4399小游戏。随着智能手机普及，我也在手机上接触了植物大战僵尸，汤姆猫等等有趣的游戏。 随后的日子里，我在闲暇之余便会打开手机搜搜新的游戏，整个小学时期我至少已经玩过并通关50款游戏。
              </p>
              <p className="section-copy">
                从此之后游戏成为了我人生重要的一部分，他的美妙超过世界上任何一种娱乐，对我来说他就是真正的“第九艺术”。进入大学以后，我就打算毕业以后做游戏， 后来我意识到其实并不一定要等毕业，我可以在空余时间开发，于是我就开始了自己的游戏开发之路。
              </p>
              <p className="section-copy">
                我不是最有天赋的那个，我大概率也不是最努力那个，但是我想我对游戏的热爱，可以排个第一。
              </p>
            </article>

            <article className="panel">
              <div className="section-label">Player Background</div>
              <h2>游戏经历</h2>
              <p className="section-copy">
                累计体验近百款游戏。相比单纯通关，我更关注作品背后的系统结构、关卡节奏控制、玩法核心与商业定位，这也是我做拆解和策划案的重要基础。
              </p>

              <div className="game-grid">
                {gameExperience.map((game) => (
                  <div key={game} className="tag-item">
                    {game}
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section id="contact" className="section-block">
            <div className="panel contact-panel">
              <div className="section-label">Contact</div>
              <h2>联系我</h2>
              <p className="section-copy">
                如果你正在寻找一位既能从玩家体验出发做分析，也能执行想法到游戏原型中的人，欢迎联系我。
              </p>

              <div className="contact-grid">
                {contacts.map((item) => (
                  <ContactCard key={item.label} item={item} />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
