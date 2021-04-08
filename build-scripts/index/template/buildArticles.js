const path = require("path");
const github = require("./../../../utility/githubAPIClient.js");
const { formatISOstr } = require("./../../../utility/formatISOstr.js");

async function buildArticles(metadata) {
  async function buildRow({ title, url }) {
    const { date } = await github.getFileLastCommit(url);
    const { day, month, year } = formatISOstr(date);
    const fileName = path.basename(url).replace("md", "html");

    return `
      <li>
        <a href="./pages/${fileName}">${title}</a>
      </li>
    `;
  }

  return `
    <section>
      <h1>Blog</h1>
      <h2>Programming</h2>
      <h3>JavaScript</h3>
      <ul>
        ${(await Promise.all(metadata.map(buildRow))).join("")}
      </ul>
      <h2>Databases</h2>
      <h3>PostgreSQL</h3>
      <h2>DevOps</h2>
      <h2>Personal</h2>
    </section>`;
}

module.exports.buildArticles = buildArticles;
