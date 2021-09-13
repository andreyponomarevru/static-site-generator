import markdown from "markdown-it";
import { formatDateStr } from "../utils/format-date-str";
import {
  googleAnalytics,
  favIcons,
  injectStylesheets,
  injectScripts,
  defaultMeta,
} from "./_particles";
import { MdArticle, Metadata } from "../types";
import { loadMdFile } from "../utils/build-helpers";
import { parseDateInFilename } from "../utils/parse-date-in-filename";
const md = markdown({ html: true });

//

export async function generateHTML(meta: Metadata, mdPath: string) {
  const metadata = Object.assign(defaultMeta, meta);

  const {
    lang,
    charset,
    viewport,
    description,
    keywords,
    author,
    title,
    stylesheets,
    scripts,
  } = metadata;
  const { content, mtime } = await loadMdFile(mdPath);
  const lastModifiedAt = formatDateStr(mtime);
  const createdOn = parseDateInFilename(mdPath);

  const filename = mdPath.replace(/^.*\/articles\//, "");

  const html = `
    <!DOCTYPE html>
    <html lang="${lang}" class="md-page">
      <head>
        <meta charset="${charset}" />
        <meta name="viewport" content="${viewport}" />
        <meta name="description" content="${description}" />
        <meta name="keywords" content="${keywords}" />
        <meta name="author" content="${author}" />
        
        <title>${title}</title>    

        ${injectStylesheets(stylesheets)}
        ${googleAnalytics}
        ${favIcons}
        ${injectScripts(scripts)}
      </head>
      <body>  
        <header>  
          <nav class="links">
            <a href="/">Home</a>
            <a href="https://github.com/ponomarevandrey/static-site-generator/blob/master/ssg/src/content/articles/${filename}"}>Edit on GitHub</a>
          </nav>
          <div class="time">
            <time datetime="">Created: <b>${createdOn}</b></time>
            <time datetime="${lastModifiedAt.year}">
              Updated: 
                <b>${lastModifiedAt.day} ${lastModifiedAt.month} ${
    lastModifiedAt.year
  }
                </b>
            </time>
          </div>
        </header>
        <main>
          <article>
          ${md.render(content)}
          </article>
        </main>
        <footer>
        
          <!-- Disqus Comments -->
          
          <div id="disqus_thread"></div>
          <script>
              /**
              *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
              *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
              /*
              var disqus_config = function () {
              this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
              this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
              };
              */
              (function() { // DON'T EDIT BELOW THIS LINE
              var d = document, s = d.createElement('script');
              s.src = 'https://andreyponomarev.disqus.com/embed.js';
              s.setAttribute('data-timestamp', +new Date());
              (d.head || d.body).appendChild(s);
              })();
          </script>
          <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>        
          
          <!-- Disqus Comments -->
          
        </footer>
      </body>
    </html>`;

  return html;
}
