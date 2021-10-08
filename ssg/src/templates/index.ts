import markdown from "markdown-it";
import { loadJsonDir, loadMdFile } from "../utils/build-helpers";
import { MdArticle, Metadata } from "../types";
import {
  googleAnalytics,
  favIcons,
  injectProjects,
  injectArticles,
  injectMenu,
  injectAbout,
  injectStylesheets,
} from "./_particles";

import { SRC_ARTICLES_PATH, SRC_INDEX_PATH } from "../env";

const md = markdown({ html: true });

export async function generateHTML(meta: Metadata) {
  const articlesMetadata = await loadJsonDir(SRC_ARTICLES_PATH);
  const about = await loadMdFile(`${SRC_INDEX_PATH}/intro.md`);
  const aboutLong = await loadMdFile(`${SRC_INDEX_PATH}/about.md`);

  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,viewport-fit=cover,shrink-to-fit=no"
    />
    <meta name="format-detection" content="telephone=no" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="email=no" />
    <meta name="description" content="Andrey Ponomarev Portfolio" />
    <meta
      name="keywords"
      content="web development, backend, frontend, databases, javascript, php"
    />
    <meta name="author" content="Andrey Ponomarev" />
    ${favIcons}
    <title>${meta.title}</title>
    ${googleAnalytics}
    ${injectStylesheets(meta.stylesheets)}
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;0,800;1,400&display=swap"
      rel="stylesheet"
    />
  </head>

  <body>
    
    <header>   
      ${injectMenu()}
			<p>
			  <strong>Hi, my name is Andrey. I'm a programmer specializing in Node.js.</strong>
      </p>
      
      <p>
        I got involved in web development in 2003. Over the years, I have gradually transitioned from web design to frontend development and then (since 2018) to backend development. Self-taught. For most of my career, I have been working alone, as a contractor, with individuals. Currently, looking for a part-time or full-time remote job.
      </p>

      <p>
			  My tools and experience:
			  <ul> 
				  <li><strong>Languages:</strong> JavaScript/TypeScript (Node.js), SQL, Bash</li>
				  <li><strong>Databases:</strong> PostgreSQL, Redis</li>
				  <li><strong>Infrastructure</strong>: Linux, Nginx, Docker/Docker Compose</li>
				  <li><strong>Protocols:</strong> HTTP, WebSocket</li>
			  </ul>
			</p>
    </header>

    <main>   
      <!-- PROJECTS -->${await injectProjects()}
			<!-- ARTICLES ${/*injectArticles(articlesMetadata)*/ ""} -->
			<!-- ABOUT ${/*injectAbout(md.render(aboutLong.content))*/ ""} -->
    </main>

    <footer>© 1989</footer>
  </body>
</html>`;

  return html;
}
