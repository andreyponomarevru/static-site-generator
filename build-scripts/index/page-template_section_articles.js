const path = require("path");
const github = require("./../github-api.js");
const { formatISOstr, fileUrlToHeading } = require("./../../utility.js");

async function buildArticleRow({ repo, filePath, url }) {
  const repoInfo = await github.getFileLastModificationData(repo, filePath);

  const heading = fileUrlToHeading(path.basename(url));
  console.log(heading);
  const { date, month, year } = formatISOstr(repoInfo.upd);

  return `
    <div class="text various__row">
      <a href="${url}" class="link">${heading}</a>
      <div class="various__updated">
        <img
          src="./img/icon_refresh.svg"
          alt="Biscuit Logo"
          class="img-svg"
        />
        <span class="update_time">${date} ${month} ${year}</span>
      </div>
    </div>
  `;
}

module.exports.buildArticleRow = buildArticleRow;
