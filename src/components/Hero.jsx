import { actions, profile } from "../data/portfolio";

const roles = profile.role.split(" / ");

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="shell hero__wrap">
        <h1 className="hero__name anim" style={{ "--d": "90ms" }}>
          吴嘉宁
        </h1>

        <div className="hero__stage anim" style={{ "--d": "200ms" }}>
          <div className="hero__badge" aria-hidden="true">
            <svg viewBox="0 0 120 120" role="presentation">
              <defs>
                <path
                  id="badge-circle"
                  d="M 60 60 m -52 0 a 52 52 0 1 1 104 0 a 52 52 0 1 1 -104 0"
                />
              </defs>
              <text>
                <textPath href="#badge-circle">
                  Agent Harness · Unity 6 · Full Stack ·
                </textPath>
              </text>
            </svg>
            <span className="hero__badge-dot" />
          </div>
        </div>

        <div className="hero__foot">
          <div className="hero__cta anim" style={{ "--d": "340ms" }}>
            <div className="hero__cta-row">
              <a
                className="btn btn--primary"
                href={actions[0].href}
                target="_blank"
                rel="noreferrer"
              >
                查看简历
                <span className="btn__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
              <a className="btn btn--dark" href="#contact">
                现在联系
                <span className="btn__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>

          <ul className="hero__roles anim" style={{ "--d": "420ms" }}>
            {roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="hero__scroll anim" style={{ "--d": "560ms" }} aria-hidden="true">
        Scroll
      </p>
    </section>
  );
}
