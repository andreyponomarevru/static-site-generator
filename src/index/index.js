const { loadJsonDir } = require("../utils/build-helpers");

async function generateHTML({
  pageMeta,
  stylesheets,
  scripts,
  topMenu,
  stack,
  jobExperience,
  projects,
  footer,
  favicons,
  fonts,
}) {
  return `
<!DOCTYPE html>
<html lang="${pageMeta.lang}">
  <head>
    <meta charset="${pageMeta.charset}" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="${pageMeta.viewport}" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="email=no" />
    <meta name="description" content="${pageMeta.description}" />
    <meta name="keywords" content="${pageMeta.keywords}" />
    <meta name="author" content="${pageMeta.author}" />
    ${favicons}
    <title>${pageMeta.title}</title>
    ${fonts}
    ${stylesheets}
    ${scripts}
  </head>

  <body>   

    ${topMenu}

    <header>   
      <p>
        Hi, my name is Andrey. I'm a developer specializing in Node.js.
      </p>
      <p>
        Been doing web development since 2006. Until 2014 mostly as a frontend developer; then been out of programming for four years; since 2018 doing full-stack development building primarily my own projects, SPA + REST APIs (Node.js, TypeScript, PostgreSQL, React).
      </p>
    </header>

    <main>     
      <div class="two-column">
        ${stack}
        ${jobExperience}
      </div>

      <h1>Projects</h1> 
      <section class="projects">
        ${projects}
      </section>  

    </main>
 
    <footer>${footer}</footer>

  </body>
</html>`;
}

module.exports = { generateHTML };
