import { projects } from "../data/portfolio";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";

export default function WorksSection() {
  return (
    <section
      className="section section--alt section--divided"
      id="works"
      aria-labelledby="works-title"
    >
      <div className="shell">
        <Reveal className="section-head section-head--ruled">
          <p className="eyebrow">Selected Works</p>
          <h2 id="works-title" className="h2">
            作品
          </h2>
          <p className="lead">玩法原型、系统策划案，以及对商业游戏的拆解分析。</p>
        </Reveal>

        <div className="works__grid">
          {projects.map((project, index) => (
            <Reveal key={project.title} delay={(index % 2) * 100}>
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
