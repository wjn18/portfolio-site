import { contacts, profile } from "../data/portfolio";

const email = contacts.find((item) => item.label === "邮箱");

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell footer__bar">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="footer__role">{profile.role}</span>
        {email && (
          <a className="footer__link" href={email.href}>
            {email.value}
          </a>
        )}
      </div>
    </footer>
  );
}
