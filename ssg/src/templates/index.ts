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
      ${injectAbout(md.render(aboutLong.content))}   
    </header>

    <!-- PROJECTS ${/*await injectProjects()*/ ""} -->
    <!-- ARTICLES ${/*injectArticles(articlesMetadata)*/ ""} -->

    <!-- Project -->

    <section class="project">
      <div class="portfolio-header">
        <h1>LiveStreamer</h1>
        <p>
          Web application for broadcasting live audio and chatting. Conceptually, it is similar to <a href="http://mixlr.com">Mixlr</a> but on a smaller scale.<br>      
          <a href="https://github.com/ponomarevandrey/live-streamer" class="portfolio-header__project-button project-button">
            GitHub
          </a>
        </p>
      </div>
      <div class="live-streamer-box">
        <img src="./img/live-streamer/01.png" class="app-screenshot live-streamer">
        <img src="./img/live-streamer/02.png" class="app-screenshot live-streamer">
        <img src="./img/live-streamer/03.png" class="app-screenshot live-streamer">
        <img src="./img/live-streamer/04.png" class="app-screenshot live-streamer">
        <img src="./img/live-streamer/05.png" class="app-screenshot live-streamer">
        <img src="./img/live-streamer/06.png" class="app-screenshot live-streamer">
      </div>
    </section>

    <!-- Project -->

    <section class="project">
      <div class="portfolio-header">
        <h1>Musicbox</h1>
        <p>
          Browser-based music library explorer for a home server. This database-centric app parses standard ID3v2 tags of your audio files and provides a simple interface to search, sort, and filter your music collection.<br>      
          <a href="https://github.com/ponomarevandrey/musicbox" class="portfolio-header__project-button project-button">
            GitHub
          </a>
        </p>
      </div>
      <div class="musicbox-box">
        <img src="./img/musicbox/ui-01.png" class="app-screenshot">
        <img src="./img/musicbox/ui-02.png" class="app-screenshot">
        <img src="./img/musicbox/ui-03.png" class="app-screenshot">
      </div>    
    </section>

    <!-- Project -->   

    <section class="project">
      <div class="portfolio-header">
        <h1>Automation Scripts</h1>
        <p>
          Bash scripts to automate repetitive tasks<br>      
          <a href="https://github.com/ponomarevandrey/automation-scripts" class="portfolio-header__project-button project-button">
            GitHub
          </a>
        </p>
      </div>
      <div class="automation-scripts-box">
        >_
      </div>
    </section>

    <!-- Project -->

    <section class="project">
      <div class="portfolio-header">
        <h1>Biscuit Components</h1>
        <p>
          SASS UI components/code snippets library for developing websites based on BEM methodology and a mobile-first approach<br>
          <a href="https://github.com/ponomarevandrey/biscuit-components" class="portfolio-header__project-button project-button">
            GitHub
          </a>
          <a href="https://ponomarevandrey.github.io/biscuit-components" class="portfolio-header__project-button project-button">
            Biscuit Website
          </a>
        </p>
      </div>
      <div class="biscuit-box">
        <img src="./img/biscuit/biscuit-logo-white.svg" class="biscuit-logo">
      </div>
    </section>

    <!-- Project -->

    <section class="project">
      <div class="portfolio-header">
        <h1>SSSG (Simple Static Site Generator)</h1>
        <p>
          Node.js static site generator developed for personal website<br>
          <a href="https://github.com/ponomarevandrey/static-site-generator" class="portfolio-header__project-button project-button">
            GitHub
          </a>
        </p>
      </div>
      <div class="ssg-box">
        SSSG
      </div>
    </section>    

    <footer>© 1989</footer>
  </body>
</html>`;

  return html;
}
