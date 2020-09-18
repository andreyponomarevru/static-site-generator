const md = require("markdown-it")();

const defaultMeta = {
  lang: "en",
  title: "A Page",
  stylesheets: ["./css/styles.css", "./css/prism.css"],
  scripts: ["./js/main.js", "./js/prism.js"],
  charset: "utf-8",
  description: "This is a page",
  keywords: "page, simple",
  author: "Andrey Ponomarev",
  favicon: "./img/favicon.png",
  viewport: "width=device-width, initial-scale=1",
  extra: [],
};

function generatePage(pageContent, pageMeta = defaultMeta) {
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
  const stylsheets = pageMeta.hasOwnProperty("stylesheets")
    ? pageMeta.stylesheets.length
      ? pageMeta.stylesheets.map(
          (value) => `<link rel="stylesheet" href="${value}">`
        )
      : ""
    : defaultMeta.stylesheets
        .map((value) => `<link rel="stylesheet" href="${value}">`)
        .join("");
  const scripts = pageMeta.hasOwnProperty("scripts")
    ? pageMeta.scripts.length
      ? pageMeta.scripts.map((value) => `<script src="${value}"></script>`)
      : ""
    : defaultMeta.scripts
        .map((value) => `<script src="${value}"></script>`)
        .join("");
  const icon = pageMeta.favicon || defaultMeta.favicon;

  const html = `<!DOCTYPE html>
<html lang="${lang}">
  <head>
    <title>${title}</title>
    <meta charset="${charset}">
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <meta name="author" content="${author}">
    ${extra}
    ${stylsheets}
    ${scripts}
    <link href="themes/prism.css" rel="stylesheet">
    <link rel="icon" type="image/png" href="${icon}">
  </head>
  <body>
    <header>
        <nav></nav>
    </header>
    <main>
      ${md.render(pageContent)}
    </main>
    <footer>© 1989</footer>
  </body>
</html>`;

  return html;
}

module.exports.generatePage = generatePage;
