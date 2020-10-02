const fs = require("fs-extra");
const { cleanPreviousBuild } = require("./cleanPreviousBuild.js");
const { compileSass } = require("./compileSass.js");
const { copyAssets } = require("./copyAssets.js");
const { compilePages: compileMDPages } = require("./markdown/compilePages.js");
const { compilePage: compileIndexPage } = require("./index/compilePage.js");
const util = require("util");

const rootOutputPath = "./build";

(async () => {
  try {
    await fs.ensureDir(rootOutputPath);
    await cleanPreviousBuild(rootOutputPath);

    await copyAssets([
      { from: "./src/img", to: `${rootOutputPath}/img` },
      { from: "./src/favicon", to: `${rootOutputPath}/` },
      { from: "./src/js/", to: `${rootOutputPath}/js` },
    ]);

    await compileSass({
      from: "./src/sass/main.scss",
      to: `${rootOutputPath}/main.css`,
    });

    await compileMDPages({
      inputDir: "./src/md",
      outputDir: `${rootOutputPath}/pages`,
      metadataDir: "./src/meta_md",
    });

    await compileIndexPage({
      outputDir: rootOutputPath,
      indexMetadataDir: "./src/meta_index/",
      mdMetadataDir: "./src/meta_md",
    });
  } catch (err) {
    console.error(err);
  }
})();

process.on("unhandledRejection", (reason, p) => {
  console.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
});
