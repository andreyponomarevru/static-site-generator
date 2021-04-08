const { buildProjects } = require("./template/buildProjects.js");
const { buildArticles } = require("./template/buildArticles.js");

async function generateHTML(metadata) {
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

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-33652174-2"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-33652174-2');
    </script>

    <link href="./main.css" rel="stylesheet" />
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;0,800;1,400&display=swap"
      rel="stylesheet"
    />
  </head>

  <body>
    
    <header class="header">   
      <img src="https://avatars.githubusercontent.com/u/34704845?v=4" class="my-photo" />
      <span>Andrey Ponomarev</span>
    </header>

    <!-- MAIN -->

    <main>   
      <section class="intro">
        <p>Hi, my name is Andrey, I'm a web developer specializing in the back-end (Node.js).</p>
        <p>
          <strong>If you need any help with your project, I'd be glad to help you, email me at <a href="mailto:info@andreyponomarev.ru" class="link">info@andreyponomarev.ru</a>. I will reply within 24 hours.</strong>
        </p>
        <p>
          My tools:
          <ul>
            <li><em>backend:</em> Node.js (JavaScript/TypeScript, Express.js), PostgreSQL, Redis, Nginx, Docker, Linux, Shell scripting</li>
            <li><em>frontend:</em> React.js, Webpack, CSS (SASS)</li>
          </ul>
        </p>
      </section>

      <!-- PROJECTS -->${await buildProjects(metadata.projects)}
      <!-- BLOG --> ${await buildArticles(metadata.articles)}
      <!-- ABOUT -->

      <section>
        <h1>About</h1>

        <article>
          <p>
            In 2001, when I was 12, my parents bought a computer. Surfing the Internet, I found a book teaching HTML and CSS and built my first website. Then got interested in programming and started to learn C++ using a textbook by Paulo Franca. Afterward, I've spent some time playing around with other programming languages, messing around the command line, and learning about computer hardware by disassembling and rebuilding my PC. Parallel to this, I finished school and then <a href="http://www.mstu.edu.ru/" class="link">Murmansk State Technical University</a>.
          </p>

          <p>
            During my first year at university, I started building websites for small businesses. Soon enough, I got an internship as a web designer at the local agency <a href="http://arcticmedia.ru/" class="link">Arctic Media Group</a>. After this, I started to work with various web studios and individuals as a freelancer/independent contractor. I've been doing mostly frontend and CMS-integration stuff.
          </p>

          <p class="text text_display_block">
            In 2014, due to the accumulated fatigue, I made a decision to quit web development and try myself in a field unrelated to IT. 
          </p>

          <p class="text text_display_block">
            In 2018 I returned to programming but decided I want to transition into backend development. Since then, I started "rebooting" myself professionally, learning new things every day, and still do this.
          </p>

          <!--
          <p class="text text_display_block" id="ru">—</p>

          <p class="text text_display_block">
            Начало моей истории довольно стандартное: в 2001-м родители купили компьютер. Я нашёл в интернете учебник по HTML и CSS, сделал свой первый сайт, затем заинтересовался программированием и купил книгу Paulo Franca по C++. После этого ещё какое-то время тыкал палкой в другие языки, с отвёрткой в руках ковырялся в системном блоке и возился в командной строке. Параллельно этому я закончил школу, а затем <a href="http://www.mstu.edu.ru/" class="link">«Мурманский Государственный Технический Университет»</a>.
          </p>

          <p class="text text_display_block">             
            Учась на 1-м курсе постепенно начал делать сайты на заказ. Немного позже устроился web-дизайнером-стажёром в <a href="http://arcticmedia.ru/" class="link">Arctic Media Group</a>, но спустя несколько месяцев всё накрылось кризисом 2008-го и я снова отправился в свободное плавание. Затем была контрактная работа с разными агентствами, после чего я ушёл во фриланс. Занимался в основном вёрсткой и интеграцией с CMS.
          </p>
          
          <p class="text text_display_block">
            В 2014-м из-за накопившейся усталости решил на некоторое время уйти из всего связанного с IT. 
          </p>

          <p class="text text_display_block">
            В 2018-м вернулся и постепенно «перезагружаю» себя в профессиональном смысле, занимаясь в основном backend-разработкой.
          </p>
          -->
          
        </article>
      </section>
    
    </main>

    <footer class="footer text">© 1989</footer>
  </body>
</html>`;

  return html;
}

module.exports.generateHTML = generateHTML;
