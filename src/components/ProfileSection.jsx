import { profile, sectionCards } from "../data/portfolio";

const [schoolLine, periodLine] = profile.education.split("\n");

const dossierRows = [
  { label: "学历", value: schoolLine },
  { label: "在读", value: periodLine },
  { label: "方向", value: profile.targets.join(" / ") },
];

export default function ProfileSection() {
  return (
    <section className="section section--divided" aria-labelledby="profile-title">
      <div className="shell">
        <div className="profile__split">
          <div className="section-head section-head--ruled">
            <p className="eyebrow">Profile</p>
            <h2 id="profile-title" className="h2">
              聚焦系统、关卡与可验证原型
            </h2>
            <p className="lead">从用户游戏体验出发，分析不同设计的用意和效果</p>

            <ul className="stack" style={{ marginTop: "var(--s-2)" }}>
              {profile.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <article className="card dossier">
            <p className="eyebrow">Dossier</p>
            <p className="dossier__name">{profile.name}</p>
            <p className="dossier__role">{profile.role}</p>

            <dl className="dossier__rows">
              {dossierRows.map((row) => (
                <div key={row.label} className="dossier__row">
                  <b>{row.label}</b>
                  <span style={{ textAlign: "right" }}>{row.value}</span>
                </div>
              ))}
            </dl>
          </article>
        </div>

        <div className="grid-3" style={{ marginTop: "var(--s-7)" }}>
          {sectionCards.map((item) => (
            <article key={item.title} className="card">
              <p className="eyebrow">{item.title}</p>
              <p className="copy" style={{ marginTop: "var(--s-4)" }}>
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
