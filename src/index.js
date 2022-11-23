const util = require("util");
const fs = require("fs-extra");
const {
  cleanPreviousBuild,
  copyAssets,
  writeHTML,
  loadJsonFile,
} = require("./utils/build-helpers");
const {
  buildMenu,
  injectStylesheets,
  injectScripts,
  buildProjects,
  buildStack,
  buildJobExperience,
} = require("./index/html-snippets");
const menu = require("./index/sections/menu.json");
const projects = require("./index/sections/projects.json");
const stack = require("./index/sections/stack.json");
const jobExperience = require("./index/sections/job-experience.json");
const footer = require("./index/sections/footer.json");
const { favicons } = require("./index/sections/favicons");
const { fonts } = require("./index/sections/fonts");

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    `UnhandledRejection: ${util.inspect(promise)}, reason "${reason}"`,
  );
});

//

const indexTemplate = require("./index/index");

const common = {
  css: { from: "./src/common-assets/css/", to: "./build/" },
  favicon: { from: "./src/common-assets/favicon/", to: "./build/" },
};

const index = {
  htmlTemplate: { from: "./src/index/", to: "./build/" },
  imgDir: { from: "./src/index/img/", to: "./build/img/" },
  scriptsDir: { from: "./src/index/js/", to: "./build/js/" },
  // SRC_INDEX_MD_PATH: "./src/assets/text/index",
};

(async function build() {
  await fs.ensureDir(index.htmlTemplate.to);
  await cleanPreviousBuild(index.htmlTemplate.to);

  await copyAssets([common.css, common.favicon]);
  await copyAssets([index.imgDir, index.scriptsDir]);

  const indexMeta = await loadJsonFile(`${index.htmlTemplate.from}/index.json`);

  const indexHTML = await indexTemplate.generateHTML({
    pageMeta: indexMeta,
    stylesheets: injectStylesheets(indexMeta.stylesheets),
    scripts: injectScripts(indexMeta.scripts),
    topMenu: buildMenu(menu),
    stack: buildStack(stack),
    jobExperience: buildJobExperience(jobExperience),
    projects: buildProjects(projects),
    footer: footer.author,
    favicons: favicons,
    fonts: fonts,
  });
  await writeHTML(index.htmlTemplate.to, "index.html", indexHTML);
})().catch(console.error);
