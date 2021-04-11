const github = require("./../../../utility/githubAPIClient.js");
const { formatISOstr } = require("./../../../utility/formatISOstr.js");

async function buildProjects(metadata) {
  async function buildRow({ repo, branch }) {
    try {
      const r = await github.getRepository(repo);
      const { date, message } = await github.getRepoLastCommit(repo, branch);
      const { day, month, year } = formatISOstr(date);

      return `
        <li>
          <a href="${r.html_url}">${r.name}</a> — <span>${r.description || "—"}.</span>
          ${r.homepage ? `<a href="${r.homepage}">Demo</a>` : ""}
        </li>`;
    } catch (err) {
      console.error(`Error in "getRepository()": ${err}`);
    }
  }

  return `
    <section>
      <h1>Projects</h1>
      <p>
        Check out my <a href="https://github.com/ponomarevandrey">GitHub</a>.
      </p>
      <ul class="projects__list">
        ${(await Promise.all(metadata.map(buildRow))).join("")}
      </ul>
    </section>`;
}

module.exports.buildProjects = buildProjects;
