import { useEffect, useState } from "react";
import { navItems, profile } from "../data/portfolio";

export default function TopBar({ activeId }) {
  const [open, setOpen] = useState(false);

  // 抽屉打开时锁定滚动、支持 Esc 关闭
  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isActive = (href) => href === `#${activeId}`;

  return (
    <>
      <header className="topbar">
        <div className="shell topbar__inner">
          <a href="#home" className="brand" onClick={() => setOpen(false)}>
            <span className="brand__dot brand__dot--live" aria-hidden="true" />
            <span>{profile.englishTitle}</span>
          </a>

          <nav className="nav" aria-label="主导航">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="nav__link"
                aria-current={isActive(item.href) ? "true" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="topbar__right">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn btn--primary btn--sm"
            >
              在线简历
            </a>

            <button
              type="button"
              className="burger"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              aria-label={open ? "关闭导航菜单" : "打开导航菜单"}
              onClick={() => setOpen((value) => !value)}
            >
              <span className="burger__box" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <>
          <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="drawer" id="mobile-drawer">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className="drawer__link"
                aria-current={isActive(item.href) ? "true" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <span>{String(index + 1).padStart(2, "0")}</span>
              </a>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn btn--primary drawer__cta"
              onClick={() => setOpen(false)}
            >
              在线查看简历
            </a>
          </div>
        </>
      )}
    </>
  );
}
