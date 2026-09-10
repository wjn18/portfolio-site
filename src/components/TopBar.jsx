import { useEffect, useState } from "react";
import { navItems } from "../data/portfolio";

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
          <p className="topbar__loc">Based in Shanghai</p>

          <button
            type="button"
            className="burger"
            aria-expanded={open}
            aria-controls="site-nav"
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
      </header>

      {open && (
        <>
          <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />
          <nav className="drawer" id="site-nav" aria-label="站点导航">
            <p className="drawer__eyebrow">导航 · Menu</p>
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
              className="btn btn--dark drawer__cta"
              onClick={() => setOpen(false)}
            >
              在线查看简历
              <span className="btn__arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </nav>
        </>
      )}
    </>
  );
}
