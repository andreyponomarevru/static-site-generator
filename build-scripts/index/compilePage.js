const fs = require("fs-extra");
const path = require("path");
const template = require("./page-template.js");

async function generateHTML(outputDir) {
  console.log("Generating pages...");

  try {
    const HTMLfileName = `index.html`;

    const pageContent = "";
    const metaData = null;
    await fs.ensureDir(outputDir);
    await fs.writeFile(
      path.join(outputDir, HTMLfileName),
      await template.generatePage(pageContent, metaData)
    );
  } catch (err) {
    console.error(`Error during page generation: ${err}`);
    process.exit(1);
  }
}

module.exports.compilePage = generateHTML;
