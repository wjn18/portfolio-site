export default function ProjectCard({ project, index = 0, featured = false }) {
  return (
    <article className={featured ? "project project--featured" : "project"}>
      <div className="project__top">
        <span className="project__type">{project.type}</span>
        <span className="project__badge">{project.role}</span>
      </div>

      <h3 className="project__title">{project.title}</h3>
      <p className="project__sub">{project.subtitle}</p>
      <p className="project__period">{project.period}</p>
      <p className="project__summary">{project.summary}</p>

      <ul className="contrib">
        {project.contributions.map((item) => (
          <li key={item}>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="links">
        {project.links.map((link) => (
          <a
            key={`${project.title}-${link.href}`}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            className="btn btn--ghost btn--sm"
          >
            {link.label}
          </a>
        ))}
      </div>

      <span className="project__index" style={{ marginTop: "var(--s-4)" }}>
        {String(index + 1).padStart(2, "0")} / {project.type}
      </span>
    </article>
  );
}
