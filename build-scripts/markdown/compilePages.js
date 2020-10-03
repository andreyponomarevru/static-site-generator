const { loadMarkdown } = require("./loadMarkdown.js");
const { loadMarkdownMetadata } = require("./loadMarkdownMetadata.js");
const { writeHTML } = require("./writeHTML.js");
const template = require("./template.js");

async function compilePages({ inputDir, outputDir, metadataDir }) {
  const pages = await loadMarkdown(inputDir);
  const pagesMeta = await loadMarkdownMetadata(metadataDir);
  await writeHTML(pages, pagesMeta, outputDir, template);
}

module.exports.compilePages = compilePages;
