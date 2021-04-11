const fs = require("fs-extra");
const path = require("path");

async function writeHTML({ sectionsMeta, outputDir, template, fileName }) {
  console.log("Writing HTML...");

  try {
    await fs.ensureDir(outputDir);
    await fs.writeFile(
      path.join(outputDir, fileName),
      await template.generateHTML(sectionsMeta)
    );
  } catch (err) {
    console.error(`Error during HTML writing: ${err.stack}`);
    process.exit(1);
  }
}

module.exports.writeHTML = writeHTML;
