import { contacts } from "../data/portfolio";

export default function ContactSection() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="shell">
        <div className="section-head section-head--ruled">
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title" className="h2">
            如果你正在寻找一位既能从玩家体验出发做分析，也能执行想法到游戏原型中的人，请联系我！
          </h2>
        </div>

        <div className="contact__grid">
          {contacts.map((item) => {
            const isLink = typeof item.href === "string" && item.href.length > 0;
            const Component = isLink ? "a" : "div";

            return (
              <Component
                key={item.label}
                className="contact-card"
                href={isLink ? item.href : undefined}
              >
                <p className="eyebrow">{item.label}</p>
                <p className="contact-card__value">{item.value}</p>
                <p className="contact-card__hint">
                  {isLink ? "立即联系 →" : "添加好友"}
                </p>
              </Component>
            );
          })}
        </div>
      </div>
    </section>
  );
}
