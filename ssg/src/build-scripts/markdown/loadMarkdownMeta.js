const fs = require("fs-extra");
const path = require("path");

async function loadMarkdownMeta(pagesMetaPath) {
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

module.exports.loadMarkdownMeta = loadMarkdownMeta;
