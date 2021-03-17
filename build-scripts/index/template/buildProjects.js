const github = require("./../../../utility/githubAPIClient.js");
const { formatISOstr } = require("./../../../utility/formatISOstr.js");

async function buildProjects(metadata) {
  async function buildRow({ repo, branch }) {
    try {
      const r = await github.getRepository(repo);
      const { date, message } = await github.getRepoLastCommit(repo, branch);
      const { day, month, year } = formatISOstr(date);

      return `
        <div class="projects__module">
          <div class="projects__header">
            <div class="projects__title">${r.name}</div>
            <div class="projects__commit"> 
                Updated: ${day} ${month} ${year}<!-- — ${message} -->
            </div>
          </div>
          <p class="projects__about">${r.description || "—"}</p>
          <div class="buttons">
            <a href="${r.html_url}" class="button">Github</a>
            ${
              r.homepage
                ? `<a href="${r.homepage}" class="button">Demo</a>`
                : ""
            }
          </div>
        </div>`;
    } catch (err) {
      console.error(`Error in "getRepository()": ${err}`);
    }
  }

  return `
    <section class="projects" id="projects">
      <div class="section-header section-header_h1 section-header_projects">PROJECTS</div>
      <div class="projects__list">
        ${(await Promise.all(metadata.map(buildRow))).join("")}
      </div>
    </section>`;
}

module.exports.buildProjects = buildProjects;
