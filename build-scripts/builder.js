const fs = require("fs-extra");
const path = require("path");
const { cleanPreviousBuild } = require("./cleanPreviousBuild.js");
const { compileSass } = require("./compileSass.js");
const { copyAssets } = require("./copyAssets.js");
const { compilePages: compileMDPages } = require("./markdown/compilePages.js");
const { compilePage: compileIndexPage } = require("./index/compilePage.js");

const rootOutputPath = "./build";

(async () => {
  try {
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
      metadataDir: "./src/md-meta",
    });

    await compileIndexPage(rootOutputPath);
  } catch (err) {
    console.error(err);
  }
})();
