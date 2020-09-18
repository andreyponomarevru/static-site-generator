const fs = require("fs-extra");
const path = require("path");
const pageTemplate = require("./page_template.js");

const pagesPath = "./pages";
const pagesMetaPath = "./pages_meta";
const copyFolders = ["./img", "./css", "./js"];
const outputPath = "./build";

console.log("Cleaning previous build...");

try {
  for (const file of fs.readdirSync(outputPath)) {
    fs.removeSync(path.join(outputPath, file));
  }
} catch (err) {
  console.log(`Error during cleanup: ${err}`);
  process.exit(1);
}

// Then read everything in the pages and pages_meta directories.
const pages = {};
const pagesMeta = {};

console.log("Loading pages...");

try {
  for (const page of fs.readdirSync(pagesPath)) {
    pages[page] = fs.readFileSync(path.join(pagesPath, page), "utf-8");
  }
} catch (err) {
  console.log(`Error during page loading...`);
  process.exit(1);
}

console.log("Loading pages metadata...");

try {
  for (const pageMeta of fs.readdirSync(pagesMetaPath)) {
    pagesMeta[pageMeta] = fs.readFileSync(
      path.join(pagesMetaPath, pageMeta),
      "utf-8"
    );
  }
} catch (err) {
  console.log(`Error during metadata loading: ${err}`);
  process.exit(1);
}

// Generate each page from the data provided, using the template.
console.log("Generating pages...");

try {
  for (const page of Object.entries(pages)) {
    const pageName = page[0].slice(0, page[0].lastIndexOf("."));
    const JSONfileName = `${pageName}.json`;
    const HTMLfileName = `${pageName}.html`;
    const metaData = pagesMeta.hasOwnProperty(JSONfileName)
      ? JSON.parse(pagesMeta[JSONfileName])
      : {};
    metaData.title = metaData.title || pageName;
    const pageContent = page[1];
    console.log(pageContent);
    fs.writeFileSync(
      path.join(outputPath, HTMLfileName),
      pageTemplate.generatePage(pageContent, metaData)
    );
  }
} catch (err) {
  console.log(`Error during page generation: ${err}`);
  process.exit(1);
}

// Copy folders with assets into build folder.
console.log("Copying folders...");

try {
  for (const copyFolder of copyFolders) {
    fs.copySync(copyFolder, path.join(outputPath, copyFolder));
  }
} catch (err) {
  console.log(`Error during folder copying: ${err}`);
  process.exit(1);
}

console.log("Done.");
