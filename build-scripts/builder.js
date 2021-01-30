const fs = require("fs-extra");
const { cleanPreviousBuild } = require("./cleanPreviousBuild.js");
const { compileSass } = require("./compileSass.js");
const { copyAssets } = require("./copyAssets.js");
const indexTemplate = require("./index/template.js");
const markdownTemplate = require("./markdown/template.js");
const { writeHTML } = require("./writeHTML.js");
const { writeHTML: writeMarkdownHTML } = require("./markdown/writeHTML.js");
const { loadMarkdown } = require("./markdown/loadMarkdown.js");
const { loadMarkdownMeta } = require("./markdown/loadMarkdownMeta.js");
const { loadIndexMeta } = require("./index/loadIndexMeta.js");
const util = require("util");

const ROOT_OUTPUT_PATH = "./build";
const INDEX_META_PATH = "./src/meta_index/";
const MD_META_PATH = "./src/meta_md";
const MD_INPUT_PATH = "./src/md";
const MD_OUTPUT_PATH = `${ROOT_OUTPUT_PATH}/pages`;

(async () => {
  try {
    await fs.ensureDir(ROOT_OUTPUT_PATH);
    await cleanPreviousBuild(ROOT_OUTPUT_PATH);
    await copyAssets([
      { from: "./src/img", to: `${ROOT_OUTPUT_PATH}/img` },
      { from: "./src/favicon", to: `${ROOT_OUTPUT_PATH}/` },
      { from: "./src/js/", to: `${ROOT_OUTPUT_PATH}/js` },
    ]);
    await compileSass({
      from: "./src/sass/main.scss",
      to: `${ROOT_OUTPUT_PATH}/main.css`,
    });

    const pages = await loadMarkdown(MD_INPUT_PATH);
    const pagesMeta = await loadMarkdownMeta(MD_META_PATH);
    await writeMarkdownHTML(pages, pagesMeta, MD_OUTPUT_PATH, markdownTemplate);

    const sectionsMeta = await loadIndexMeta(INDEX_META_PATH, MD_META_PATH);
    await writeHTML({
      sectionsMeta: sectionsMeta,
      outputDir: ROOT_OUTPUT_PATH,
      template: indexTemplate,
      fileName: "index.html",
    });
  } catch (err) {
    console.error(err);
  }
})();

process.on("unhandledRejection", (reason, p) => {
  console.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
});
