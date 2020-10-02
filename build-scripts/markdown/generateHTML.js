const md = require("markdown-it")();
const github = require("./../githubAPIClient.js");
const { formatISOstr } = require("./../../utility/formatISOstr.js");

const defaultMeta = {
  lang: "en",
  title: "Article Example",
  stylesheets: [
    "./../main.css",
    "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;0,800;1,400&display=swap",
  ],
  scripts: ["./../js/prism.js"],
  charset: "utf-8",
  description: "Default page description",
  keywords: "default, page",
  author: "Andrey Ponomarev",
  favicon: "",
  viewport: "width=device-width, initial-scale=1",
  url:
    "https://github.com/ponomarevandrey/programming-sandbox/blob/master/text/programming/javascript/async-programming.md",
  extra: [],
};

async function generateHTML(pageContent, pageMeta = defaultMeta) {
  const { date } = await github.getFileLastCommit(pageMeta.url);
  const { day, month, year } = formatISOstr(date);

  const lang = pageMeta.lang || defaultMeta.lang;
  const title = pageMeta.title || defaultMeta.title;
  const charset = pageMeta.charset || defaultMeta.charset;
  const description = pageMeta.description || defaultMeta.description;
  const keywords = pageMeta.keywords || defaultMeta.keywords;
  const author = pageMeta.author || defaultMeta.author;

  const extra = (() => {
    if (pageMeta.hasOwnProperty("extra")) {
      if (pageMeta.extra.length) {
        return pageMeta.extra.map((value) => `<meta ${value}>`);
      } else return "";
    } else return "";
  })();

  const stylesheets = (() => {
    if (pageMeta.hasOwnProperty("stylesheets")) {
      if (pageMeta.stylesheets.length) {
        return pageMeta.stylesheets
          .map((value) => `<link rel="stylesheet" href="${value}">`)
          .join("");
      } else return "";
    } else {
      return defaultMeta.stylesheets
        .map((value) => `<link rel="stylesheet" href="${value}">`)
        .join("");
    }
  })();

  const scripts = (() => {
    if (pageMeta.hasOwnProperty("scripts")) {
      if (pageMeta.scripts.length) {
        return pageMeta.scripts
          .map((value) => `<script src="${value}"></script>`)
          .join("");
      } else return "";
    } else {
      return defaultMeta.scripts
        .map((value) => `<script src="${value}"></script>`)
        .join("");
    }
  })();

  const html = `<!DOCTYPE html>
<html lang="${lang}" class="md-page">
  <head>
  <title>${title}</title>
  <meta charset="${charset}">
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="${author}">
  ${extra}
  ${stylesheets}
  ${scripts}
  <link rel="icon" type="image/png" href="./../favicon.png">
  </head>
  <body class="md-page__body">
    <div class="sidebar">Andrey Ponomarev</div>
    <header class="md-header">
        <nav class="md-nav">
          <a href="http://andreyponomarev.ru">HOME</a>
        </nav>
    </header>
    <main class="md-main">
      ${md.render(pageContent)}
    </main>
    <footer class="md-footer">
      <div class="gradient-bottom"></div>
      <div class="md-last-update">
        <span class="md-last-update__text">Last update:</span>
        <span class="md-last-update__date">${day} ${month} ${year}</span>
      </div>
    </footer>
  </body>
</html>`;

  return html;
}

module.exports.generateHTML = generateHTML;
