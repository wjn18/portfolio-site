import { contacts } from "../data/portfolio";
import Reveal from "./Reveal";

export default function ContactSection() {
  return (
    <section className="section contact" id="contact" aria-label="Contact">
      <div className="shell">
        <Reveal className="section-head section-head--ruled">
          <p className="eyebrow">Contact</p>
        </Reveal>

        <div className="contact__grid">
          {contacts.map((item, index) => {
            const isLink = typeof item.href === "string" && item.href.length > 0;
            const Component = isLink ? "a" : "div";

            return (
              <Reveal key={item.label} delay={index * 90}>
                <Component
                  className="contact-card"
                  href={isLink ? item.href : undefined}
                >
                  <p className="eyebrow">{item.label}</p>
                  <p className="contact-card__value">{item.value}</p>
                  <p className="contact-card__hint">
                    {isLink ? "立即联系 →" : "添加好友"}
                  </p>
                </Component>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
