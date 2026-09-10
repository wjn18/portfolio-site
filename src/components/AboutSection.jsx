import { aboutParagraphs, gameExperience } from "../data/portfolio";

export default function AboutSection() {
  const leadParagraphs = aboutParagraphs.slice(0, 4);
  const closingParagraph = aboutParagraphs[aboutParagraphs.length - 1];

  return (
    <section
      className="section section--divided section--alt"
      id="about"
      aria-labelledby="about-title"
    >
      <div className="shell">
        <div className="section-head section-head--ruled">
          <p className="eyebrow">About</p>
          <h2 id="about-title" className="h2">
            关于我
          </h2>
        </div>

        <div className="about__grid">
          <article className="card longform">
            {leadParagraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p className="pullquote">{closingParagraph}</p>
          </article>

          <article className="card card--raised">
            <p className="eyebrow">Player Background</p>
            <h3 className="h3" style={{ marginTop: "var(--s-4)" }}>
              游戏经历
            </h3>
            <p className="copy" style={{ marginTop: "var(--s-4)" }}>
              累计体验近百款游戏。相比单纯通关，我更关注作品背后的系统结构、关卡节奏控制、玩法核心与商业定位，这也是我做拆解和策划案的重要基础。
            </p>

            <ul className="experience">
              {gameExperience.map((game, index) => (
                <li key={game}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {game}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
