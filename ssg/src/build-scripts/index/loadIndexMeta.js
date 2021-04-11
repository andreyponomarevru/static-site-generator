const fs = require("fs-extra");
const path = require("path");

async function loadIndexMeta(indexMetadataDir, mdMetadataDir) {
  console.log("Loading index page secion's metadata...");

  const sectionsMeta = {
    projects: [],
    articles: [],
  };

  try {
    for (const sectionMeta of await fs.readdir(mdMetadataDir)) {
      const filePath = path.join(mdMetadataDir, sectionMeta);
      const fileContent = await fs.readFile(filePath);
      sectionsMeta.articles.push(JSON.parse(fileContent));
    }

    for (const indexMeta of await fs.readdir(indexMetadataDir)) {
      const filePath = path.join(indexMetadataDir, indexMeta);
      const fileContent = await fs.readFile(filePath);
      sectionsMeta.projects = JSON.parse(fileContent);
    }

    return sectionsMeta;
  } catch (err) {
    console.error(
      `Error during index page section's metadata loading: ${err.stack}`
    );
    process.exit(1);
  }
}

module.exports.loadIndexMeta = loadIndexMeta;
