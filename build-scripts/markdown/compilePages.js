const fs = require("fs-extra");
const path = require("path");
const template = require("./page-template.js");

// Read everything in the pages and pages_meta directories.
async function loadMarkdown(dir) {
  console.log("Loading pages...");

  const pages = {};

  try {
    for (const page of await fs.readdir(dir)) {
      pages[page] = await fs.readFile(path.join(dir, page), "utf-8");
    }
    return pages;
  } catch (err) {
    console.error(`Error during page loading: ${err}`);
    process.exit(1);
  }
}

async function loadMarkdownMetadata(pagesMetaPath) {
  console.log("Loading pages metadata...");

  const pagesMeta = {};

  try {
    for (const pageMeta of await fs.readdir(pagesMetaPath)) {
      pagesMeta[pageMeta] = await fs.readFile(
        path.join(pagesMetaPath, pageMeta),
        "utf-8"
      );
    }
    return pagesMeta;
  } catch (err) {
    console.error(`Error during metadata loading: ${err}`);
    process.exit(1);
  }
}

// Generate each page from the data provided, using the template.
async function generateHTML(pages, pagesMeta, outputDir) {
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

      await fs.ensureDir(outputDir);
      await fs.writeFile(
        path.join(outputDir, HTMLfileName),
        await template.generatePage(pageContent, metaData)
      );
    }
  } catch (err) {
    console.error(`Error during page generation: ${err}`);
    process.exit(1);
  }
}

async function compilePages({ inputDir, outputDir, metadataDir }) {
  const pages = await loadMarkdown(inputDir);
  const pagesMeta = await loadMarkdownMetadata(metadataDir);
  await generateHTML(pages, pagesMeta, outputDir);
}

module.exports.compilePages = compilePages;
