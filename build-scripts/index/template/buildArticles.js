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
      <h1>Articles</h1>
      <ul>
        ${(await Promise.all(metadata.map(buildRow))).join("")}
      </ul>
    </section>`;
}

module.exports.buildArticles = buildArticles;
