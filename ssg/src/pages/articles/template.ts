import markdown from "markdown-it";
import { formatDateStr } from "../../utility/formatDateStr";
import {
  googleAnalytics,
  favIcons,
  injectStylesheets,
  injectScripts,
} from "./../particles";
import { MdArticle, Metadata } from "../../types";
const md = markdown({ html: true });

//

const defaultMeta = {
  lang: "en",
  title: "Andrey Ponomarev",
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
};

export function generateHTML(meta: Metadata, article: MdArticle) {
  const metadata = Object.assign(defaultMeta, meta);

  const {
    lang,
    charset,
    viewport,
    description,
    keywords,
    author,
    title,
    stylesheets,
    scripts,
  } = metadata;
  const { content } = article;
  const { day, month, year } = formatDateStr(article.mtime);

  const html = `
    <!DOCTYPE html>
    <html lang="${lang}" class="md-page">
      <head>
        <meta charset="${charset}" />
        <meta name="viewport" content="${viewport}" />
        <meta name="description" content="${description}" />
        <meta name="keywords" content="${keywords}" />
        <meta name="author" content="${author}" />
        
        <title>${title}</title>    

        ${injectStylesheets(stylesheets)}
        ${googleAnalytics}
        ${favIcons}
        ${injectScripts(scripts)}
      </head>
      <body>  
        <header>  
          <nav class="breadcrumbs"><a href="/">/index</a></nav>
          <time datetime="${year}">Updated: <b>${day} ${month} ${year}</b></time>
        </header>
        <main>
          <article>
          ${md.render(content)}
          </article>
        </main>
      </body>
    </html>`;

  return html;
}
