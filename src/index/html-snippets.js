function buildArticlesList(articleMeta) {
  const rows = [];

  for (let articleFilename in articleMeta) {
    const link = `./articles/${articleFilename.replace("json", "html")}`;
    const title = articleMeta[articleFilename].title;

    const row = `
      <li>
        <time>${articleMeta[articleFilename].published || ""}</time>
        <a href="${link}"><span>${title}</span></a>
      </li>
    `;

    rows.unshift(row);
  }

  return rows.join("");
}

function buildMenu(menu) {
  return `
    <nav class="nav">
      ${menu.map(({ name, link }) => `<a href="${link}">${name}</a>`).join("")}
    </nav>`;
}

function buildStack(meta) {
  const html = [];

  for (let { name, list } of meta) {
    const row = `
      <div>
        <span class="bold">${name}</span>
        <span></span> 
        <span>${list}</span>
      </div>`;
    html.push(row);
  }

  return `<section class="stack">${html.join("")}</section>`;
}

function buildJobExperience(meta) {
  const html = [];

  for (let { year, position, place } of meta) {
    const row = `
      <div>
        <span class="bold">${year}</span>
        <span></span>
        <span>
          ${
            place.link
              ? `<a href=${place.link}>${place.name}</a>`
              : `${place.name}`
          }<br>
          <span class="job-position">${position}</span>
        </span>
      </div>`;
    html.push(row);
  }

  return `<section class="job-history">${html.reverse().join("")}</section>`;
}

function buildProjects(projectsMeta) {
  const projects = [];

  for (let meta of projectsMeta) {
    const project = `
      <li class="project">
        <span class="project__header">${meta.title}</span>
        <span class="project__body">${meta.about}</span>
          <span class="project__nav">
            <a href="${meta.links.github}">ГитХаб</a>   	
            ${meta.links.demo ? `<a href="${meta.links.demo}">Демо</a>` : ""}
          </span>
      </li>`;

    projects.push(project);
  }

  return `<ul class="projects">${projects.join("")}</ul>`;
}

function injectScripts(scripts) {
  return scripts.length
    ? scripts.map((value) => `<script src="${value}"></script>`).join("")
    : "";
}

function injectStylesheets(stylesheets) {
  return stylesheets.length
    ? stylesheets
        .map((value) => `<link rel="stylesheet" href="${value}">`)
        .join("")
    : "";
}

module.exports = {
  buildArticlesList,
  buildMenu,
  buildStack,
  buildJobExperience,
  buildProjects,
  injectScripts,
  injectStylesheets,
};
