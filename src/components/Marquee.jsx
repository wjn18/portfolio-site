import { profile } from "../data/portfolio";

const items = profile.role.split(" / ");

/** 无限滚动字幕带：跑马灯内容 ×2 保证 -50% 平移无缝循环 */
export default function Marquee() {
  const row = [...items, ...items, ...items];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((half) => (
          <div className="marquee__group" key={half}>
            {row.map((item, index) => (
              <span key={`${half}-${index}`} className="marquee__item">
                {item}
                <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
