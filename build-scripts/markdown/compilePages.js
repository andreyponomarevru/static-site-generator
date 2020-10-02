const fs = require("fs-extra");
const path = require("path");
const { generateHTML } = require("./generateHTML.js");

async function loadMarkdown(dir) {
  console.log(`Loading Markdown from /${dir}...`);

  const pages = {};

  try {
    for (const page of await fs.readdir(dir)) {
      pages[page] = await fs.readFile(path.join(dir, page), "utf-8");
    }
    return pages;
  } catch (err) {
    console.error(
      `Error during reading Markdown loading from ${dir}: ${err.stack}`
    );
    process.exit(1);
  }
}

async function loadMarkdownMetadata(pagesMetaPath) {
  console.log("Loading Markdown metadata...");

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
    console.error(`Error during Markdown metadata loading: ${err.stack}`);
    process.exit(1);
  }
}

async function writeHTML(pages, pagesMeta, outputDir) {
  console.log(
    "Writing HTML from Markdown using the JSON and template provided..."
  );

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
        await generateHTML(pageContent, metaData)
      );
    }
  } catch (err) {
    console.error(`Error during writing HTML from Markdown: ${err.stack}`);
    process.exit(1);
  }
}

async function compilePages({ inputDir, outputDir, metadataDir }) {
  const pages = await loadMarkdown(inputDir);
  const pagesMeta = await loadMarkdownMetadata(metadataDir);
  await writeHTML(pages, pagesMeta, outputDir);
}

module.exports.compilePages = compilePages;
