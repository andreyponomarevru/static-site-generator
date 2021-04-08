const md = require("markdown-it")();
const github = require("./../../utility/githubAPIClient.js");
const { formatISOstr } = require("../../utility/formatISOstr.js");
const { googleAnalytics } = require("./../common/googleAnalytics.js");

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
  viewport:
    "width=device-width,initial-scale=1,viewport-fit=cover,shrink-to-fit=no",
  url:
    "https://github.com/ponomarevandrey/programming-sandbox/blob/master/text/index.md",
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
  const viewport = pageMeta.viewport || defaultMeta.viewport;

  const extra = (() => {
    if (pageMeta.hasOwnProperty("extra")) {
      if (pageMeta.extra.length) {
        return pageMeta.extra.map((value) => `<meta ${value} />`);
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

  const html = `
<!DOCTYPE html>
<html lang="${lang}" class="md-page">
  <head>
    <title>${title}</title>
    <meta charset="${charset}" />
    <meta name="viewport" content="${viewport}" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="author" content="${author}" />
    ${extra}
    ${stylesheets}
    ${googleAnalytics}
    ${scripts}
    
    <link rel="icon" type="image/png" href="./../favicon.png">
  </head>
  <body>
    <header>
        <nav>
          <a href="http://andreyponomarev.ru">home</a>
          <a href="https://github.com/ponomarevandrey">github</a>
          <a href="mailto:info@andreyponomarev.ru">email</a>
        </nav>
        <div class="md-gradient md-gradient_header"></div>
    </header>
    
    <time datetime="${year}">Last update: ${day} ${month} ${year}</time>
    <main>
      ${md.render(pageContent)}
    </main>
  </body>
</html>`;

  return html;
}

module.exports.generateHTML = generateHTML;
