import markdown from "markdown-it";
import * as builder from "../../builder";
import { MdArticle, Metadata } from "../../types";
import {
  googleAnalytics,
  favIcons,
  injectProjects,
  injectArticles,
  injectMenu,
  injectAbout,
  injectStylesheets,
} from "./../particles";
import { gitHubProjects } from "./gitHubProjects";

const SRC_ARTICLES_JSON_PATH = process.env.SRC_ARTICLES_JSON_PATH!;

const md = markdown({ html: true });

const menu = [
  { name: "Email", link: "mailto:info@andreyponomarev.ru" },
  { name: "GitHub", link: "https://github.com/ponomarevandrey" },
  {
    name: "LinkedIn",
    link: "http://linkedin.com/in/andreyponomareveverywhere",
  },
];

export async function generateHTML(meta: Metadata, article: MdArticle) {
  let articlesMetadata = await builder.loadJsonDir(SRC_ARTICLES_JSON_PATH);

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
      ${injectMenu(menu)}

      <div class="intro">
        <p class="intro__about">
          Hi, my name is Andrey, I'm a backend web developer specializing in Node.js.
        </p>
      <section class="intro__knowledge">
        <ul>
          <span class="intro__header">Languages</span>
          <li>JavaScript/TypeScript (Node.js)</li>
          <li>SQL</li>
          <li>Shell scripting</li>
          <li>CSS/SASS</li>
        </ul>
        <ul>
          <span class="intro__header">Frameworks/Libs/...</span>
          <li>express.js</li>
          <li>superagent</li>
          <li>joi</li>
          <li>node-postgres</li>
          <li>webpack</li>
          <li>react.js (only fundamentals)</li>
        </ul>
        <ul>
          <span class="intro__header">Databases</span>
          <li>PostgreSQL</li>
          <li>Redis</li>
        </ul>
        <ul>
          <span class="intro__header">Infrastructure</span>
          <li>Linux (Ubuntu)</li>
          <li>Nginx</li>
          <li>Docker</li>
        </ul>
        <ul>
          <span class="intro__header">Testing</span>
          <li>mocha</li>
          <li>chai</li>
          <li>sinon</li>
          <li>supertest</li>
        </ul>
      </section>
      </div>
    </header>

    <main>   
      <!-- PROJECTS -->${await injectProjects(gitHubProjects)}
      <!-- ARTICLES --> ${injectArticles(articlesMetadata)}
      <!-- ABOUT -->${injectAbout(md.render(article.content))}
    </main>

    <footer class="footer text">© 1989</footer>
  </body>
</html>`;

  return html;
}
