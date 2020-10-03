const fs = require("fs-extra");
const path = require("path");

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

module.exports.loadMarkdown = loadMarkdown;
