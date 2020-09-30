const md = require("markdown-it")();
const github = require("./github-api.js");

const defaultMeta = {
  lang: "en",
  title: "A Page",
  stylesheets: ["./styles.css"],
  scripts: ["./js/main.js", "./js/prism.js"],
  charset: "utf-8",
  description: "This is a page",
  keywords: "page, simple",
  author: "Andrey Ponomarev",
  favicon: "./img/favicon.png",
  viewport: "width=device-width, initial-scale=1",
  extra: [],
};

async function generatePage(pageContent, pageMeta = defaultMeta) {
  const lastUpdate = await github.getGithubData();

  const lang = pageMeta.lang || defaultMeta.lang;
  const title = pageMeta.title || defaultMeta.title;
  const charset = pageMeta.charset || defaultMeta.charset;
  const description = pageMeta.description || defaultMeta.description;
  const keywords = pageMeta.keywords || defaultMeta.keywords;
  const author = pageMeta.author || defaultMeta.author;

  const extra = pageMeta.hasOwnProperty("extra")
    ? pageMeta.extra.length
      ? pageMeta.extra.map((value) => `<meta ${value}>`)
      : ""
    : "";

  const stylesheets = (() => {
    if (pageMeta.hasOwnProperty("stylesheets")) {
      if (pageMeta.stylesheets.length) {
        return pageMeta.stylesheets
          .map((value) => `<link rel="stylesheet" href="${value}">`)
          .join("");
      } else {
        return "";
      }
    } else {
      return defaultMeta.stylesheets
        .map((value) => `<link rel="stylesheet" href="${value}">`)
        .join("");
    }
  })();

  const scripts = pageMeta.hasOwnProperty("scripts")
    ? pageMeta.scripts.length
      ? pageMeta.scripts
          .map((value) => `<script src="${value}"></script>`)
          .join("")
      : ""
    : defaultMeta.scripts
        .map((value) => `<script src="${value}"></script>`)
        .join("");

  const icon = pageMeta.favicon || defaultMeta.favicon;

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
  <link rel="icon" type="image/png" href="${icon}">
  </head>
  <body class="md-page__body">
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
      <div>${lastUpdate.date} ${lastUpdate.month} ${lastUpdate.year}</div>
    </footer>
  </body>
</html>`;

  return html;
}

module.exports.generatePage = generatePage;
