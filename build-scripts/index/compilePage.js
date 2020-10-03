const { loadIndexMetadata } = require("./loadIndexMetadata.js");
const { writeHTML } = require("./writeHTML.js");
const template = require("./template.js");

async function compilePage({ outputDir, indexMetadataDir, mdMetadataDir }) {
  const sectionsMeta = await loadIndexMetadata(indexMetadataDir, mdMetadataDir);
  await writeHTML(sectionsMeta, outputDir, template);
}

module.exports.compilePage = compilePage;
