import markdown from "markdown-it";
import { formatDateStr } from "../utils/format-date-str";
import { DEFAULT_META } from "./html-snippets/default-meta";
import { GOOGLE_ANALYTICS, FAV_ICONS } from "../config/html-snippets";
import { Metadata } from "../types";
import { loadMdFile } from "../utils/build-helpers";
import { parseDateInFilename } from "../utils/parse-date-in-filename";
import { injectScripts } from "./html-snippets/inject-scripts";
import { injectStylesheets } from "./html-snippets/inject-stylesheets";

const md = markdown({ html: true });

export async function generateHTML(meta: Metadata, mdPath: string) {
  const metadata = Object.assign(DEFAULT_META, meta);

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
  const { content, mtime } = await loadMdFile(mdPath);
  const lastModifiedAt = formatDateStr(mtime);
  const createdOn = parseDateInFilename(mdPath);

  const mdFilename = mdPath.replace(/^.*\/articles\//, "");
  const mdSourceURL = `https://github.com/ponomarevandrey/static-site-generator/blob/master/ssg/src/content/articles/${mdFilename}`;
  const GOOGLE_FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Faustina:ital,wght@0,400;0,700;0,800;1,400;1,700;1,800&family=Open+Sans:ital,wght@0,400;0,800;1,400;1,800&display=swap" rel="stylesheet">`;

  const html = `
    <!DOCTYPE html>
    <html lang="${lang}">
      <head>
        <meta charset="${charset}" />
        <meta name="viewport" content="${viewport}" />
        <meta name="description" content="${description}" />
        <meta name="keywords" content="${keywords}" />
        <meta name="author" content="${author}" />
        
        <title>${title}</title>    

        ${injectStylesheets(stylesheets)}
        ${GOOGLE_ANALYTICS}
        ${FAV_ICONS}
        ${GOOGLE_FONTS}
        ${injectScripts(scripts)}
      </head>
      <body>  
        <header>  
          <nav>
            <a href="/">Home</a>
            <!-- <a href="${mdSourceURL}"}>Edit on GitHub</a> -->
          </nav>
          <div class="time">
            <!-- <time datetime="">Created: <b>${createdOn}</b></time> -->
            <!-- <time datetime="${lastModifiedAt.year}">
              Updated: 
                <b>${lastModifiedAt.day} ${lastModifiedAt.month} ${
    lastModifiedAt.year
  }
                </b>
            </time> -->
          </div>
        </header>

        <main>
          <article>
            ${md.render(content)}
          </article>
        </main>

        <header>  
          <nav>
            <a href="/">Home</a>
          </nav>
        </header>
      </body>
    </html>`;

  return html;
}
