const github = require("./../github-api.js");

async function buildProjectRow({ repo, tech }) {
  let r;
  try {
    r = await github.getRepository(repo);
  } catch (err) {
    console.error(`Error in "getRepository()": ${err}`);
  }

  tech = tech.map((v) => `<span class="projects__tag">${v}</span>`).join("");

  return `
    <div class="projects__row">
      <span class="projects__title">${r.name}</span>
      <p class="projects__tags">${tech}</p>
      <p class="projects__about">${r.description || "—"}</p>
      <div class="buttons-col">
        <a href="${r.html_url}" class="button">Github</a>
        ${r.homepage ? `<a href="${r.homepage}" class="button">Demo</a>` : ""}
      </div>
    </div>  
  `;
}

module.exports.buildProjectRow = buildProjectRow;
