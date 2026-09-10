import { archiveProjects, spotlightProjects } from "../data/portfolio";
import ProjectCard from "./ProjectCard";

export default function WorksSection() {
  return (
    <section
      className="section section--divided section--alt"
      id="works"
      aria-labelledby="works-title"
    >
      <div className="shell">
        <div className="section-head section-head--ruled">
          <p className="eyebrow">Selected Works</p>
          <h2 id="works-title" className="h2">
            代表作品
          </h2>
          <p className="lead">
            这些内容覆盖了我目前最核心的能力方向：系统策划、战斗与关卡拆解、动作表现分析，以及游戏原型开发。
          </p>
        </div>

        <div className="grid-2 works__grid">
          {spotlightProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              featured
            />
          ))}
        </div>

        <div className="archive__head">
          <div>
            <p className="eyebrow">Archive</p>
            <h3 className="h3" style={{ marginTop: "var(--s-3)" }}>
              策划案与拆解文档
            </h3>
          </div>
          <p className="meta">共 {archiveProjects.length} 份文档</p>
        </div>

        <div className="grid-2 works__grid">
          {archiveProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={spotlightProjects.length + index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
