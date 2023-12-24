export function generateHTMLpage({
  title,
  description,
  keywords,
  abstract,
  author,
  issuetracker,
  markdownContent,
  stylesheets,
  scripts,
  favicons,
  fonts,
  toc,
  date,
}) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,viewport-fit=cover,shrink-to-fit=no"
    />
    <meta name="format-detection" content="telephone=no" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="email=no" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="author" content="${author}" />

    <title>${title}</title>

    <!-- css -->
    ${stylesheets}
    <!-- icons -->
    ${favicons}
    <!-- fonts -->
    ${fonts}
  </head>

  <body>   
    <main>
      <div class="toc">${toc}</div>

      <div></div>

      <article>
        <h1>${title}</h1>
        <h3>Living Document, ${date}</h3>
        <div>
          <strong>Author:</strong> <a href="https://andreyponomarev.ru">${author}</a><br>
          <strong>Issue tracking:</strong> <a href="${issuetracker}">GitHub</a>
        </div>
        <div class="abstract">${abstract}</div>
        ${markdownContent}
      </article>

      <div></div>

      <footer>${author}</footer>
    </main>

    ${scripts}
  </body>
</html>`;
}
