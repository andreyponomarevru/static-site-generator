const fs = require("fs-extra");
const path = require("path");

async function writeHTML(pages, pagesMeta, outputDir, template) {
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
        await template.generateHTML(pageContent, metaData)
      );
    }
  } catch (err) {
    console.error(`Error during writing HTML from Markdown: ${err.stack}`);
    process.exit(1);
  }
}

module.exports.writeHTML = writeHTML;
