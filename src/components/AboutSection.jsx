import {
  aboutParagraphs,
  gameExperience,
  profile,
  skillGroups,
} from "../data/portfolio";
import Reveal from "./Reveal";

const [schoolLine, periodLine] = profile.education.split("\n");

export default function AboutSection() {
  const [bio, , , , closing] = aboutParagraphs;

  return (
    <section className="section section--divided" id="about" aria-labelledby="about-title">
      <div className="shell">
        <Reveal className="section-head section-head--ruled">
          <p className="eyebrow">About</p>
          <h2 id="about-title" className="h2">
            关于我
          </h2>
        </Reveal>

        <div className="about__grid">
          <Reveal>
            <p className="about__lead">{bio}</p>
            <p className="pullquote">{closing}</p>
            <dl className="dossier__rows">
              <div className="dossier__row">
                <b>在职</b>
                <span style={{ textAlign: "right" }}>{profile.currentRole}</span>
              </div>
              <div className="dossier__row">
                <b>学历</b>
                <span style={{ textAlign: "right" }}>{schoolLine}</span>
              </div>
              <div className="dossier__row">
                <b>在读</b>
                <span style={{ textAlign: "right" }}>{periodLine}</span>
              </div>
              <div className="dossier__row">
                <b>方向</b>
                <span style={{ textAlign: "right" }}>{profile.targets.join(" / ")}</span>
              </div>
            </dl>
          </Reveal>

          <div className="about__skills">
            {skillGroups.map((group, index) => (
              <Reveal key={group.title} delay={index * 100}>
                <article className="card card--raised skill-card">
                  <h3 className="skill__title">
                    <span className="skill__num">{String(index + 1).padStart(2, "0")}</span>
                    {group.title}
                  </h3>
                  <ul className="stack">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="about__games">
          <p className="eyebrow">Player Background</p>
          <div className="tags">
            {gameExperience.map((game) => (
              <span key={game} className="tag tag--muted">
                {game}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
