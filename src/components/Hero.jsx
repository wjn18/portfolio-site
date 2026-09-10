// IDphoto.PNG（720×1080 证件照）作为首屏人像卡片
import idPhoto from "../../IDphoto.PNG";
import { actions, profile, specCells } from "../data/portfolio";

const roles = profile.role.split(" / ");
const trustLine = specCells.map((cell) => `${cell.value} ${cell.label}`).join(" · ");

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="shell hero__wrap">
        <p className="hero__kicker anim" style={{ "--d": "0ms" }}>
          <span className="hero__kicker-strong">Wu Jianing</span>
          <span className="hero__kicker-sep" aria-hidden="true" />
          Game Design Portfolio
        </p>

        <h1 className="hero__name anim" style={{ "--d": "90ms" }}>
          吴嘉宁
        </h1>

        <div className="hero__stage anim" style={{ "--d": "200ms" }}>
          <figure className="hero__photo-card">
            <img
              src={idPhoto}
              alt="吴嘉宁个人照片"
              width="720"
              height="1080"
              decoding="async"
            />
          </figure>

          <div className="hero__badge" aria-hidden="true">
            <svg viewBox="0 0 120 120" role="presentation">
              <defs>
                <path
                  id="badge-circle"
                  d="M 60 60 m -46 0 a 46 46 0 1 1 92 0 a 46 46 0 1 1 -92 0"
                />
              </defs>
              <text>
                <textPath href="#badge-circle">
                  Open to Work · 可到岗 · Game Design ·
                </textPath>
              </text>
            </svg>
            <span className="hero__badge-dot" />
          </div>
        </div>

        <div className="hero__foot">
          <div className="hero__cta anim" style={{ "--d": "340ms" }}>
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
            <p className="hero__trust">{trustLine}</p>
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
