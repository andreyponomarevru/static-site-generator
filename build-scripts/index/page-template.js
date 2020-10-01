const fs = require("fs-extra");
const articlesSection = require("./page-template_section_articles.js");
const projectsSection = require("./page-template_section_projects.js");

const projects = [
  {
    repo: "musicbox",
    tech: [
      "Docker",
      "Node.js",
      "JavaScript",
      "Express.js",
      "PostgreSQL",
      "React.js",
      "SCSS",
      "Pug",
      "Webpack",
    ],
  },
  {
    repo: "biscuit-components",
    tech: ["SCSS", "CSS", "JavaScript", "Webpack", "BEM", "Pug"],
  },
  {
    repo: "automation-scripts",
    tech: ["Shell", "Linux"],
  },
  {
    repo: "configs",
    tech: [
      "JavaScript",
      "Webpack",
      "ESLint",
      "VSCode",
      "Git",
      "SQL",
      "SCSS",
      "Shell",
      "Pug",
      "Docker",
      "Docker Compose",
      "Linux",
    ],
  },
  {
    repo: "andreyponomarev",
    tech: ["JavaScript, HTML, SCSS"],
  },
];

const articles = [
  {
    repo: "programming-sandbox",
    filePath: "text/programming/javascript/async-programming.md",
    url:
      "https://github.com/ponomarevandrey/programming-sandbox/blob/master/text/programming/javascript/async-programming.md",
  },
  {
    repo: "programming-sandbox",
    filePath: "text/index.md",
    url:
      "https://github.com/ponomarevandrey/programming-sandbox/blob/master/text/index.md",
  },
  {
    repo: "programming-sandbox",
    filePath: "text/authentication/token-based-authentication.md",
    url:
      "https://github.com/ponomarevandrey/programming-sandbox/blob/master/text/authentication/token-based-authentication.md",
  },
];

async function generatePage(pageContent, pageMeta = defaultMeta) {
  // const articles = await fs.readdir("./src/md");

  const html = `
<!DOCTYPE html>
<html class="page" lang="en">
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

    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="./apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="./favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="./favicon-16x16.png"
    />
    <link rel="manifest" href="./site.webmanifest" />
    <link rel="mask-icon" href="./safari-pinned-tab.svg" color="#5bbad5" />
    <meta name="msapplication-TileColor" content="#da532c" />
    <meta name="theme-color" content="#ffffff" />

    <link rel="icon" type="image/png" href="./favicon.png" />

    <title>Andrey Ponomarev</title>

    <link href="./main.css" rel="stylesheet" />
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;0,800;1,400&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="page__body">
    <!-- HEADER -->
    <header class="header">
      <div class="my-photo">
        <img
          src="https://sun9-52.userapi.com/c850520/v850520824/148c19/BC4V9wrvBvo.jpg"
          class="my-photo__img"
        />
      </div>

      <nav class="nav">
        <a
          href="mailto:info@andreyponomarev.ru"
          id="header"
          class="header__link"
          >info@andreyponomarev.ru</a
        >
      </nav>
    </header>

    <!-- MAIN -->
    <main class="main">

      <!-- PROJECTS -->
      <div class="projects">
        <div class="col-header col-header_type_projects">
          <a id="projects">PROJECTS</a>
        </div>
        <div class="projects__content">
          ${(
            await Promise.all(
              projects.map(({ repo, tech }) =>
                projectsSection.buildProjectRow({ repo, tech })
              )
            )
          ).join("")}
        </div>
      </div>

      <!-- CONTENT -->
      <div class="various">

        <!-- ARTICLES -->
        <div class="various__articles">
          <div class="col-header col-header_type_articles">
            <a id="articles">ARTICLES</a>
          </div>
          <div class="various__articles">
            ${(
              await Promise.all(
                articles.map(({ repo, filePath, url }) =>
                  articlesSection.buildArticleRow({ repo, filePath, url })
                )
              )
            ).join("")}
            <div class="text various__row">
              <a href="#" class="link">SOLID in javascript</a>
              <div class="various__updated">
                <img
                  src="./img/icon_refresh.svg"
                  alt="Biscuit Logo"
                  class="img-svg"
                />
                <span class="update_time">26 Dec 2020</span>
              </div>
            </div>

            <div class="text various__row">
              <a href="#" class="link">
                Setting up local development environment in Docker</a
              >
              <div class="various__updated">
                <img
                  src="./img/icon_refresh.svg"
                  alt="Biscuit Logo"
                  class="img-svg"
                />
                <span class="update_time">03 Jan 2020</span>
              </div>
            </div>

            <div class="text various__row">
              <a href="#" class="link">SQL Query Performance Benchmark</a>
              <div class="various__updated">
                <img
                  src="./img/icon_refresh.svg"
                  alt="Biscuit Logo"
                  class="img-svg"
                />
                <span class="update_time">30 Aug 2020</span>
              </div>
            </div>

            <div class="text various__row">
              <a href="#" class="link"
                >How PHP executes code vs how Node.js executes code</a
              >
              <div class="various__updated">
                <img
                  src="./img/icon_refresh.svg"
                  alt="Biscuit Logo"
                  class="img-svg"
                />
                <span class="update_time">01 Jul 2020</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ABOUT -->
        <div class="various__about">
          <div class="col-header col-header_type_about">
            <a id="about">ABOUT</a>
          </div>
          <div class="various__content">
            <p class="text text_display_block">
              Hi, my name is Andrey, I'm a web developer.
            </p>
            <p class="text text_display_block">
              I wrote my first lines of code back in 2003, and since 2006 I'm doing web development professionally, as an independent contractor. The period from the mid-2000s to the mid-2010s, I've mostly been working as a web designer and front-end developer. Here're a few of my works from those times: <a href="./img/003.png" class="link text">one</a>, <a href="./img/002.jpg" class="link text">two</a>. 
              
              <p class="text text_display_block">
              In recent years I've moved to the server-side and currently primarily do backend development.
              </p>
            </p>

          </div>
        </div>
      </div>
    </main>

    <div class="gradient"></div>

    <!-- FOOTER -->
    <footer class="footer text">
      <!-- Place this tag where you want the button to render. -->
      <a
        class="github-button"
        href="https://github.com/ponomarevandrey"
        data-color-scheme="no-preference: dark; light: dark; dark: dark;"
        data-size="large"
        aria-label="Follow @ponomarevandrey on GitHub"
        >Follow @ponomarevandrey</a
      >
      <span class="footer__year"> © 1989 </span>
    </footer>
    <!-- Place this tag in your head or just before your close body tag. -->
    <script async defer src="https://buttons.github.io/buttons.js"></script>
  </body>
</html>`;

  return html;
}

module.exports.generatePage = generatePage;
