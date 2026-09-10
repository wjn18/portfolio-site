const railItems = [
  { id: "home", label: "首页" },
  { id: "works", label: "作品" },
  { id: "skills", label: "能力" },
  { id: "about", label: "关于" },
  { id: "contact", label: "联系" },
];

export default function SectionRail({ activeId }) {
  return (
    <nav className="rail" aria-label="章节导航">
      {railItems.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="rail__item"
          aria-current={activeId === item.id ? "true" : undefined}
        >
          <span className="rail__label">{item.label}</span>
          <span className="rail__dot" aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
