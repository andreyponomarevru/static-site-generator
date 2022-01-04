import { StringMap, ProjectsMeta } from "../../types";

export function buildProjects(projectsMeta: ProjectsMeta[]) {
  const projects = [];

  for (let meta of projectsMeta) {
    const demoLink = meta.links.demo
      ? `<a href="${meta.links.demo}">Demo</a>`
      : "";
    const year = meta.year || "—";

    const header = meta.image
      ? `<header>
          <img src="${meta.image}">
        </header>`
      : "";

    const project = `
      <div class="project">
        ${header}
        <div class="project__body">
          <h2>${meta.title}</h2>
          <time class="project__time">${year}</time>
          <p>${meta.about}</p>  
        </div>
        <div class="project-btns">
          <a href="${meta.links.github}">GitHub</a>
          ${demoLink}
        </div>
      </div>`;

    projects.push(project);
  }

  return projects.join("");
}
