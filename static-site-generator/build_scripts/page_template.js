const md = require("markdown-it")();
const { Octokit } = require("@octokit/core");

/*
https://docs.github.com/en/rest/reference/repos#get-a-repository

const octokit = new Octokit({ auth: process.env.GITHUB });
octokit
  .request(`GET /repos/{owner}/{repo}`, {
    owner: "ponomarevandrey",
    repo: "musicbox",
  })
  .then((res) => {
    let isoUpdDate = res.data.updated_at;
    isoUpdDate = new Date(isoUpdDate).toDateString();
    //Mon Sep 14 2020
    const str1 = isoUpdDate.match(/\b[A-Za-z]{3,3}\b/g);
    const str2 = isoUpdDate.match(/\b\d{1,2}\b/);
    const str3 = isoUpdDate.match(/\b\d{4,4}\b/);
    const month = str1[1];
    const date = str2[0];
    const year = str3[0];
    console.log(date, month, year);
    //formattedUpdDate = `${isoUpdDate.getFullYear()} ${
    //isoUpdDate.getMonth() + 1
    // } ${isoUpdDate.getDate()}`;
  });
  */

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
