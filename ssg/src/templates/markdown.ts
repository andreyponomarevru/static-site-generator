import markdown from "markdown-it";
import * as github from "./../utility/githubAPIClient";
import { formatISOstr } from "../utility/formatISOstr";
import { googleAnalytics } from "./../utility/googleAnalytics";
import { ArticleMetadata } from "../types";
const md = markdown({ html: true });

const defaultMeta = {
  lang: "en",
  title: "Article Example",
  stylesheets: [
    "./../main.css",
    "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;0,800;1,400&display=swap",
  ],
  scripts: ["./../js/prism.js"], // TODO: get all .js files from src/js/
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

export async function generateHTML(
  pageContent: string,
  pageMeta: ArticleMetadata,
) {
  const metadata = Object.assign(defaultMeta, pageMeta);

  const { date } = await github.getFileLastCommit(metadata.url);
  const { day, month, year } = formatISOstr(date);

  const extra = (() => {
    if (metadata.hasOwnProperty("extra")) {
      if (metadata.extra.length) {
        return metadata.extra.map((value) => `<meta ${value} />`);
      } else return "";
    } else return "";
  })();

  const stylesheets = (() => {
    if (metadata.hasOwnProperty("stylesheets")) {
      if (metadata.stylesheets.length) {
        return metadata.stylesheets
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
    if (metadata.hasOwnProperty("scripts")) {
      if (metadata.scripts.length) {
        return metadata.scripts
          .map((value) => `<script src="${value}"></script>`)
          .join("");
      } else return "";
    } else {
      return defaultMeta.scripts
        .map((value) => `<script src="${value}"></script>`)
        .join("");
    }
  })();

  const markdownHTML = md.render(pageContent);

  const html = `
<!DOCTYPE html>
<html lang="${metadata.lang}" class="md-page">
  <head>
    <title>${metadata.title}</title>
    <meta charset="${metadata.charset}" />
    <meta name="viewport" content="${metadata.viewport}" />
    <meta name="description" content="${metadata.description}" />
    <meta name="keywords" content="${metadata.keywords}" />
    <meta name="author" content="${metadata.author}" />
    ${extra}
    ${stylesheets}
    ${googleAnalytics}
    ${scripts}
    
    <link rel="icon" type="image/png" href="./../favicon.png">
  </head>
  <body>    
    <main>
      <div class="wrapper">
        <div class="meta">  
          <div class="breadcrumbs"><a href="/">/index</a></div>
          <time datetime="${year}">
            Updated: <b>${day} ${month} ${year}</b>
          </time>
        </div>
        ${markdownHTML}
      </div>
    </main>
  </body>
</html>`;

  return html;
}
