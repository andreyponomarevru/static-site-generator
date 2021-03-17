const path = require("path");
const github = require("./../../../utility/githubAPIClient.js");
const { formatISOstr } = require("./../../../utility/formatISOstr.js");

async function buildArticles(metadata) {
  async function buildRow({ title, url }) {
    const { date } = await github.getFileLastCommit(url);
    const { day, month, year } = formatISOstr(date);
    const fileName = path.basename(url).replace("md", "html");

    return `
      <div class="text articles__row">
        <a href="./pages/${fileName}" class="link">${title}</a>
        <!--
        <div class="articles__updated">
           Updated: <span>${day} ${month} ${year}</span>
        </div>
        -->
      </div>
    `;
  }

  return `
    <section class="articles" id="articles">
      <h1 class="section-header section-header_h1">ARTICLES</h1>
      <h2 class="section-header section-header_h2">JavaScript</h2>
      <div class="articles__list">
        ${(await Promise.all(metadata.map(buildRow))).join("")}
      </div>
    </section>`;
}

module.exports.buildArticles = buildArticles;
