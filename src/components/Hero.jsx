// background1.png（2527 KB）保留为原始素材，首屏只使用压缩副本：
// 1448w WebP 186 KB / 1280w WebP 143 KB / JPEG 284 KB 兜底
import heroWebp1280 from "../../background1-1280.webp";
import heroWebp1920 from "../../background1-1920.webp";
import heroJpg from "../../background1-1920.jpg";
import { actions, profile } from "../data/portfolio";

const [schoolLine, periodLine] = profile.education.split("\n");

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__media" aria-hidden="true">
        <picture>
          <source
            type="image/webp"
            srcSet={`${heroWebp1280} 1280w, ${heroWebp1920} 1448w`}
            sizes="100vw"
          />
          <img
            src={heroJpg}
            alt=""
            className="hero__photo"
            fetchpriority="high"
            decoding="async"
          />
        </picture>
        <div className="hero__veil" />
      </div>

      <div className="hero__rules" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="hero__inner">
        <div className="hero__grid">
          <div>
            <p className="eyebrow">Game Design Portfolio · 作品集</p>

            <h1 className="display hero__title">
              {profile.name}
              <em>.</em>
            </h1>

            <p className="hero__role">{profile.role}</p>
            <p className="lead hero__intro">{profile.intro}</p>

            <div className="hero__actions">
              {actions.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  download={item.download}
                  className={item.primary ? "btn btn--primary" : "btn btn--ghost"}
                >
                  {item.label}
                  {item.primary && (
                    <span className="btn__arrow" aria-hidden="true">
                      →
                    </span>
                  )}
                </a>
              ))}
            </div>

            <div className="hero__foot">
              <span>
                <b>{schoolLine}</b>
              </span>
              <span>{periodLine}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
