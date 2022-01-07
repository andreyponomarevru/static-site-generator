import { loadJsonDir } from "../utils/build-helpers";
import { Metadata, ProjectsMeta } from "../types";
import { GOOGLE_ANALYTICS, FAV_ICONS } from "../config/html-snippets";
import { buildMenu } from "./html-snippets/build-menu";
import { injectStylesheets } from "./html-snippets/inject-stylesheets";
import { buildArticlesList } from "./html-snippets/build-articles-list";
import { buildProjects } from "./html-snippets/build-projects";
import { MENU } from "./html-snippets/menu";
import { SRC_ARTICLES_PATH } from "../config/env";

// TODO: move projects to json

const PROJECTS: ProjectsMeta[] = [
  {
    title: "LiveStreamer",
    year: "2021",
    about: `Web application for broadcasting live audio and chatting. Conceptually, it is similar to <a href="http://mixlr.com">Mixlr</a> but on a smaller scale.`,
    links: {
      github: "https://github.com/ponomarevandrey/live-streamer",
      demo: "https://live.andreyponomarev.ru/",
    },
    image: "./img/portfolio/livestreamer.jpg",
  },

  {
    title: "Musicbox",
    year: "2020",
    about:
      "Browser-based music library explorer for a home server. Musicbox is a  database-centric app. It parses standard ID3v2 tags of your audio files and provides a simple interface to search, sort, and filter your music collection.",
    links: { github: "https://github.com/ponomarevandrey/musicbox" },
    image: "./img/portfolio/musicbox.jpg",
  },

  {
    title: "Automation Scripts",
    about: "Bash scripts to automate repetitive tasks",
    links: { github: "https://github.com/ponomarevandrey/automation-scripts" },
  },

  {
    title: "Simple Static Site Generator",
    year: "2019",
    about:
      "Vanilla Node.js static site generator developed for personal website",
    links: {
      github: "https://github.com/ponomarevandrey/static-site-generator",
    },
  },

  {
    title: "Biscuit Components",
    year: "2018/2019",
    about:
      "SASS UI components/code snippets library for developing websites based on BEM methodology and a mobile-first approach",
    links: {
      github: "https://github.com/ponomarevandrey/biscuit-components",
      demo: "https://ponomarevandrey.github.io/biscuit-components",
    },
  },
];

export async function generateHTML(meta: Metadata) {
  const articlesMetadata = await loadJsonDir(SRC_ARTICLES_PATH);

  const GOOGLE_FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Faustina:ital,wght@0,400;0,700;0,800;1,400;1,700;1,800&family=Open+Sans:ital,wght@0,400;0,800;1,400;1,800&display=swap" rel="stylesheet">`;

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
    <meta name="description" content="Andrey Ponomarev" />
    <meta
      name="keywords"
      content="web development, programming, javascript"
    />
    <meta name="author" content="Andrey Ponomarev" />
    ${FAV_ICONS}
    <title>${meta.title}</title>
    ${GOOGLE_ANALYTICS}
    ${GOOGLE_FONTS}
    ${injectStylesheets(meta.stylesheets)}
  </head>

  <body>   

  <main>
    ${buildMenu(MENU)}

    <header>   
      <p>
        <strong>Hi, my name is Andrey. I'm a developer specializing in Node.js.</strong>
      </p>
      <p>
        I've been doing web development since the mid-2000s; over the years, I have gradually transitioned from web design to frontend development and then (since 2018) to backend development. Self-taught. For most of my career, I have been working with small businesses as a contractor.
      </p>
    </header>        
    
    <div class="two-column">
      <section class="stack">
        <span>Languages</span> 
        <span>JavaScript/TypeScript (Node.js), SQL, Bash</span>
        <span>Databases</span>
        <span>PostgreSQL, Redis</span>
        <span>Infrastructure</span>
        <span>Linux, Nginx, Docker</span>
        <span>Protocols</span> 
        <span>HTTP, WebSocket</span>
        <span>Frameworks</span>
        <span>Express.js, React.js; Jest for testing</span>
      </section>
      <section class="job-history">
        <span>2006—2008</span>
        <span>Freelancer<br><span class="job-title">Front End Developer</span></span>
        <span>2008</span>
        <span><a href="http://arcticmedia.ru/">Arctic Media Group</a></span><br><span class="job-title">Web Designer</span></span>
        <span>2008—2014</span>
        <span>Contractor<br><span class="job-title">Front End Developer</span></span>       
        <span>2018—present</span>
        <soan>Contractor<br><span class="job-title">Back End / Full Stack Developer</span></span>
      </section>
    </div>

    <!-- ARTICLES -->
    
    <h1>Notes</h1>
    <p>I post these notes and articles primarily as a reference for my own self. They are periodically revisited and updated. Writing about some topic, for me, is the best way to digest new knowledge or to brush up on old one.</p>
    <section class="articles">
      <ul>${buildArticlesList(articlesMetadata)}</ul>
    </section>

    

    <!-- PROJECTS -->

    <h1>Projects</h1> 
    <section class="projects">
      ${buildProjects(PROJECTS)}
    </section>  

    <footer>Andrey Ponomarev</footer>

  </main>
 
  </body>
</html>`;

  return html;
}
