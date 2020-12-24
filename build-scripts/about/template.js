async function generateHTML() {
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
      <a href="http://andreyponomarev.ru" class="my-photo">
        <img
          src="https://sun9-52.userapi.com/c850520/v850520824/148c19/BC4V9wrvBvo.jpg"
          class="my-photo__img"
        />
      </a>
    </header>

    <!-- MAIN -->
    <main class="main">
      <div class="about">

        <div class="content__text">
          <p class="text text_display_block">
            Привет, меня зовут Андрей, я веб-разработчик, специализируюсь на backend'е (Node.js).
          </p>
          <p class="text text_display_block">
            Свои первые строки кода написал в 2003-м, а с 2006-го занимаюсь веб-разработкой профессионально, как контрактник/фрилансер.
          </p>
          <p class="text text_display_block">
            Если вам нужна помощь с проектом или консультация, буду рад вам помочь, пишите на <a href="mailto:info@andreyponomarev.ru" class="link">info@andreyponomarev.ru</a>, я отвечу в течении суток.
          </p>
        </div>



        <div class="content__column">
          <h1 class="col-header col-header_type_about">
            <a id="about">Немного обо мне</a>
          </h1>
          <div class="content__text">
            <p class="text text_display_block">
              Начало истории очень «оригинально»: в 2001-м родители подарили компьютер. За пару лет я наигрался в игры, мне стало скучно и я нашёл где-то в интернете учебник по HTML и CSS. С его помощью я  сделал свой первый сайт на narod.ru. Примерно в этоже время в школе мы проходили всякие Бэйсики и я, увлёкшись программированием, купил книгу Paulo Franca по C++. После этого я ещё какое-то время потыкал палкой в другие языки, с отвёрткой в руках поизучал собственный компьютер, повозился в командной строке и... наступил 2006-й год, время поступать в универ.
            </p>

            <p class="text text_display_block">
              Я закончил <a href="http://www.mstu.edu.ru/" class="link">«Мурманский Государственный Технический Университет»</a>: некоторое время я проучился на «Автоматизации технологических процессов и производств», затем на «Прикладной информатике», но закончил универ не по IT-специальности. На первом курсе я уже начал делать сайты на заказ - иногда с нуля, под ключ, но чаще на базе «Битрикс» и пр. CMS. Немного позже я устроился web-дизайнером-стажёром в <a href="http://arcticmedia.ru/" class="link">Arctic Media Group</a>, но спустя несколько месяцев всё накрылось пресловутым кризисом 2008-го и я снова отправился в свободное плавание. Затем была контрактная работа с другой небольшой мурманской студией, после чего я полностью ушёл во фриланс. Занимался в основном вёрсткой и интеграцией с разными CMS, немного веб-дизайном. Работал с частными клиентами и малым бизнесом. Какое-то время всё шло бодро и с энтузиазмом, но постепенно однотипная работа стала приедаться и вызывать апатию. 
            </p>

            <p class="text text_display_block">
              Не нужно быть Нострадамусом чтобы догадаться чем всё кончилось -  выгоранием. Разочаровавшись во всём на свете (к тому моменту я проработал 7-8 лет) я решил уйти в другую сферу, никак не связанную с IT. Однако, вышло так, что программист во мне всё-таки победил и спустя 4 года, в 2018-м, я вернулся обратно - уже окончательно в себе разобравшись я решил, что хочу начать всё по-новой, но уже будучи более аккуратным в выборе того чем занимаюсь.
            </p>
          </div>
        </div>

        <div class="content__column">
          <div class="col-header col-header_type_about">
            <a id="about">СЕЙЧАС</a>
          </div>        

          <div class="content__text">        
            <p class="text text_display_block">
              C 2018-го года я постепенно «перезагружаю» себя в профессиональном смысле и постепенно ухожу из fullstack в backend-разработку.
            </p>

            <p>
              <ul class="list text text_display_block">
                <li class="list__item">чтобы наверстать новое, что появилось в CSS за годы моего отсутствия я написал CSS-библиотеку на базе БЭМ, <a href="https://github.com/ponomarevandrey/biscuit-components" class="link">Biscuit Components</a></li>
                <li class="list__item">подтянул основы Shell-скриптинга написав <a href="https://github.com/ponomarevandrey/automation-scripts" class="link">скрипты</a> для автоматизации рутинных процессов</li>
                <li class="list__item">написал self-hosted менеджер музыкальной библиотеки <a href="https://github.com/ponomarevandrey/musicbox" class="link">MusicBox</a> на базе Node.js/PostgreSQL/Nginx на бэке и React.js на фронте (потом переписал это приложение на TypeScript). Проект оказался не самым тривиальным в отношении дизайна базы данных и неплохо прокачал как навыки проектирования базы данных, так и нвыки написания сложных SQL-запросов с множеством subquery и join'ов.</li>
                <li class="list__item">влюбился в контейнеры и стал использовать Docker для всей локальной разработки</li>
                <li class="list__item">сделал фронт и бэкэнд для сайта онлайн-заказа товаров <a href="https://andreyponomarev.ru/ypen/" class="link">Ypen</a></li>
                <li class="list__item">стал вести <a href="https://github.com/ponomarevandrey" class="link">англоязычный блог</a></li>
                <li class="list__item">на <a href="https://github.com/ponomarevandrey" class="link">Github</a> есть ещё много других более мелких проектов </li>
              </ul>
            </p>

            <p class="text text_display_block">
              Мои инструменты:
            </p>
            <p class="text text_display_block">
              <strong>— frontend:</strong> React.js, Webpack, CSS (SASS)<br>
              <strong>— backend:</strong> JavaScript/TypeScript (Node.js), PostgreSQL, Nginx, Docker, Linux, Shell scripting
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

module.exports.generateHTML = generateHTML;
