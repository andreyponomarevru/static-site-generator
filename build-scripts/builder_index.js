const sass = require("./../utility.js");
const fs = require("fs-extra");
const path = require("path");
const pageTemplate = require("./page-template.js");

const rootOutputPath = "./build";

const pagesMetaPath = "./src/md-meta";
const pagesDir = {
  from: "./src/md",
  to: `${rootOutputPath}/pages`,
};

const copyDirs = [
  {
    from: "./src/img",
    to: `${rootOutputPath}/img`,
  },
  {
    from: "./src/favicon",
    to: `${rootOutputPath}/`,
  },
  {
    from: "./src/js/",
    to: `${rootOutputPath}/js`,
  },
  {
    from: "./src/index.html",
    to: `${rootOutputPath}/index.html`,
  },
  {
    from: "./src/sass/main.scss",
    to: `${rootOutputPath}/main.css`,
  },
];

const stylesDir = {
  from: "./src/sass/main.scss",
  to: `${rootOutputPath}/main.css`,
};

async function compileSass(from, to) {
  try {
    const { css: cssString } = await sass.render({ file: from });
    await fs.ensureDir(path.dirname(to));
    await fs.writeFile(to, cssString);
    console.log("CSS converted to SASS and written to disk");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

cleanPreviousBuild(rootOutputPath)
  .then(loadPages)
  .then(loadPagesMetadata)
  .then(generatePages)
  .then(copyFolders)
  .then(compileSass.bind(null, stylesDir.from, stylesDir.to))
  .then(() => console.log("Done."))
  .catch((err) => console.error(err));

async function cleanPreviousBuild(rootOutputPath) {
  console.log("Cleaning previous build...");

  try {
    for (const file of await fs.readdir(rootOutputPath)) {
      await fs.remove(path.join(rootOutputPath, file));
    }
  } catch (err) {
    console.error(`Error during cleanup: ${err}`);
    process.exit(1);
  }
}

// Then read everything in the pages and pages_meta directories.
const pages = {};
const pagesMeta = {};

async function loadPages() {
  console.log("Loading pages...");

  try {
    for (const page of await fs.readdir(pagesDir.from)) {
      pages[page] = await fs.readFile(path.join(pagesDir.from, page), "utf-8");
    }
  } catch (err) {
    console.error(`Error during page loading: ${err}`);
    process.exit(1);
  }
}

async function loadPagesMetadata() {
  console.log("Loading pages metadata...");

  try {
    for (const pageMeta of await fs.readdir(pagesMetaPath)) {
      pagesMeta[pageMeta] = await fs.readFile(
        path.join(pagesMetaPath, pageMeta),
        "utf-8"
      );
    }
  } catch (err) {
    console.error(`Error during metadata loading: ${err}`);
    process.exit(1);
  }
}

// Generate each page from the data provided, using the template.
async function generatePages() {
  console.log("Generating pages...");

  try {
    for (const [key, pageContent] of Object.entries(pages)) {
      const pageName = key.slice(0, key.lastIndexOf("."));
      const JSONfileName = `${pageName}.json`;
      const HTMLfileName = `${pageName}.html`;
      const metaData = pagesMeta.hasOwnProperty(JSONfileName)
        ? JSON.parse(pagesMeta[JSONfileName])
        : {};
      metaData.title = metaData.title || pageName;

      await fs.ensureDir(pagesDir.to);
      await fs.writeFile(
        path.join(pagesDir.to, HTMLfileName),
        await pageTemplate.generatePage(pageContent, metaData)
      );
    }
  } catch (err) {
    console.error(`Error during page generation: ${err}`);
    process.exit(1);
  }
}

// Copy folders with assets into build folder.
async function copyFolders() {
  try {
    console.log("Copying folders...");
    for (const location of copyDirs) {
      await fs.copy(location.from, location.to);
    }
  } catch (err) {
    console.error(`Error during folder copying: ${err}`);
    process.exit(1);
  }
}

module.exports.cleanPreviousBuild = cleanPreviousBuild;
module.exports.loadPages = loadPages;
module.exports.loadPagesMetadata = loadPagesMetadata;
module.exports.generatePages = generatePages;
module.exports.copyFolders = copyFolders;
