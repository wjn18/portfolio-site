import { skillGroups } from "../data/portfolio";

export default function SkillsSection() {
  return (
    <section className="section section--divided" id="skills" aria-labelledby="skills-title">
      <div className="shell">
        <div className="section-head section-head--ruled">
          <p className="eyebrow">Skills</p>
          <h2 id="skills-title" className="h2">
            能力优势
          </h2>
        </div>

        <div className="grid-3" style={{ marginTop: "var(--s-7)" }}>
          {skillGroups.map((group, index) => (
            <article key={group.title} className="card card--raised">
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
          ))}
        </div>
      </div>
    </section>
  );
}
