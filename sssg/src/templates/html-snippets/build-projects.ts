import { StringMap, ProjectsMeta } from "../../types";

export function buildProjects(projectsMeta: ProjectsMeta[]) {
  const projects = [];

  for (let meta of projectsMeta) {
    const demoLink = meta.links.demo
      ? `&#183;<a href="${meta.links.demo}">Demo</a>`
      : "";
    const year = meta.year || "—";

    const header = meta.image
      ? `<header>
          <img src="${meta.image}">
        </header>`
      : "";

    const project = `
      <li class="project">
        <header>${meta.title}</header>
        <time>${year}</time>
        <span>${meta.about}</span> 
        <span></span>
        <nav>
          <a href="${meta.links.github}">GitHub</a>   	
          ${demoLink}
        </nav>
      </li>`;

    projects.push(project);
  }

  return `<ul>${projects.join("")}</ul>`;
}
