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

    <!--

    <header class="header">   
    </header>

    -->

    <main class="main">     
      ${topMenu}

      <div class="about">
        <section class="bio">
          <p>
            Привет, меня зовут Андрей. Я разработчик, специализирующийся на Node.js.
          </p>
          <p>
            Занимаюсь веб-разработкой с 2006. До 2014 в основном как фронтенд. Затем был перерыв в 4 года, вне IT. С 2018 занимаюсь фул-стэк  разработкой, с упором на бэкэнд, работая в основном над собственными проектами (SPA, REST API на базе Node.js, TypeScript, PostgreSQL, React) и частными заказами (поддержка сайтов и серверов, консультации, доработка API и подобное).
          </p>
        </section>
        ${stack}
        ${jobExperience}
      </div>

      ${projects} 
      <!-- <div class="two-column"> -->
      <!-- </div> -->
      <!-- <h1>Проекты</h1> <div class="two-column"> -->      
      <!-- </div> -->
    </main>
 
    <footer class="footer">${footer}</footer>

  </body>
</html>`;
}

module.exports = { generateHTML };
