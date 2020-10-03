const fs = require("fs-extra");
const { cleanPreviousBuild } = require("./cleanPreviousBuild.js");
const { compileSass } = require("./compileSass.js");
const { copyAssets } = require("./copyAssets.js");
const { compilePages: compileMDPages } = require("./markdown/compilePages.js");
const { loadIndexMeta } = require("./index/loadIndexMeta.js");
const indexTemplate = require("./index/template.js");
const { writeHTML: writeIndexHTML } = require("./index/writeHTML.js");
const util = require("util");

const ROOT_OUTPUT_PATH = "./build";
const INDEX_META_PATH = "./src/meta_index/";
const MD_META_PATH = "./src/meta_md";

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

    await compileMDPages({
      inputDir: "./src/md",
      outputDir: `${ROOT_OUTPUT_PATH}/pages`,
      metadataDir: "./src/meta_md",
    });

    const sectionsMeta = await loadIndexMeta(INDEX_META_PATH, MD_META_PATH);
    await writeIndexHTML(sectionsMeta, ROOT_OUTPUT_PATH, indexTemplate);
  } catch (err) {
    console.error(err);
  }
})();

process.on("unhandledRejection", (reason, p) => {
  console.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
});
