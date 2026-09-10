import { profile } from "../data/portfolio";

export default function EducationBand() {
  return (
    <section className="section edu" aria-label="教育背景与目标方向">
      <div className="shell edu__inner">
        <div>
          <p className="eyebrow">Education</p>
          <h2 className="edu__title" style={{ marginTop: "var(--s-4)" }}>
            {profile.education}
          </h2>
        </div>

        <div className="tags" aria-label="目标岗位方向">
          {profile.targets.map((item) => (
            <span key={item} className="tag">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
