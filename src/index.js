#!/usr/bin/env node

import util from "util";
import parseMarkdownYaml from "markdown-yaml-metadata-parser";
import markdownit from "markdown-it";
// Adds an id attribute to headings, e.g. ## Foo becomes <h2 id="foo">Foo</h2>.
import markdownItAnchor from "markdown-it-anchor";
// Add GitHub style anchor tags to headers
import markdownItGitHubHeadings from "markdown-it-github-headings";
// Generate a slug just like GitHub does for markdown headings.
import GithubSlugger from "github-slugger";
import markdownItFootnote from "markdown-it-footnote";
import markdownItDefList from "markdown-it-deflist";
import markdownItAbbr from "markdown-it-abbr";
import {
  writeHTML,
  injectScripts,
  injectStylesheets,
  getCurrentDate,
} from "./utils.js";
import { getHeaders, buildTOC } from "./toc.js";
import { generateHTMLpage } from "./templates/article/template.js";
import {
  MARKDOWNIT_CONFIG,
  STYLESHEETS,
  SCRIPTS,
  HTML_FAVICONS,
  HTML_FONTS,
} from "./templates/article/config.js";

const MD_FILENAME = process.argv[2];
const BUILD_DIR_PATH = "./build/";

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    `UnhandledRejection: ${util.inspect(promise)}, reason "${reason}"`,
  );
});

const md = markdownit(MARKDOWNIT_CONFIG)
  .use(markdownItAnchor, { slugify: (s) => new GithubSlugger().slug(s) })
  .use(markdownItFootnote)
  .use(markdownItGitHubHeadings, { linkIcon: "#" })
  .use(markdownItDefList)
  .use(markdownItAbbr);

async function build() {
  // Get Markdown from STDIN and parse it
  let markdownFile = "";
  for await (const chunk of process.stdin) markdownFile += chunk;
  const { metadata, content } = parseMarkdownYaml(markdownFile);

  const indexHTML = generateHTMLpage({
    ...metadata,
    markdownContent: md.render(content),
    stylesheets: injectStylesheets(STYLESHEETS),
    scripts: injectScripts(SCRIPTS),
    favicons: HTML_FAVICONS,
    fonts: HTML_FONTS,
    toc: buildTOC(getHeaders(md, markdownFile)),
    date: getCurrentDate(),
  });

  await writeHTML(BUILD_DIR_PATH, `${MD_FILENAME}.html`, indexHTML);
}

try {
  await build();
} catch (err) {
  console.error(`Ooops! ${err}`);
}
