import { footerGroups, profile } from "../data/portfolio";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__grid">
          <div className="footer__brand">
            <p className="footer__mark">{profile.name}</p>
            <p className="copy" style={{ fontSize: "var(--fs-sm)" }}>
              {profile.englishTitle}
            </p>
            <p className="meta">{profile.role}</p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title} className="footer__group">
              <p className="eyebrow">{group.title}</p>
              <div className="footer__list">
                {group.links.map((item) => (
                  <a
                    key={`${group.title}-${item.label}`}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    className="footer__link"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="footer__bar">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Built with React · Vite</span>
        </div>
      </div>
    </footer>
  );
}
