import fs from "fs-extra";
import path from "path";

/*
 * Build utilities
 */

async function cleanPreviousBuild(dirPath) {
  console.log("Cleaning previous build...");

  try {
    for (const file of await fs.readdir(dirPath)) {
      await fs.remove(path.join(dirPath, file));
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error during cleanup: ${err.stack}`);
    }
    process.exit(1);
  }
}

async function copyAssets(nodes) {
  console.log("Copying files and folders: ", nodes);

  try {
    for (const { from, to } of nodes) await fs.copy(from, to);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error while copying files and folders: ${err.stack}`);
    }
    process.exit(1);
  }
}

async function loadJsonDir(filesPath) {
  console.log("Loading page metadata from JSON...");

  try {
    const dirContent = {};
    for (const filename of await fs.readdir(filesPath)) {
      if (path.extname(filename) !== ".json") continue;
      const filePath = path.join(filesPath, filename);
      dirContent[filename] = JSON.parse(await fs.readFile(filePath, "utf-8"));
    }
    return dirContent;
  } catch (err) {
    if (err instanceof Error) {
      console.error(
        `${__filename}: Error while loading page metadata: ${err.stack}`,
      );
    }
    process.exit(1);
  }
}

async function loadMdDir(dir) {
  console.log(`Loading Markdown files from ${dir}...`);

  try {
    let md = {};
    for (const filename of await fs.readdir(dir)) {
      if (path.extname(filename) !== ".md") continue;
      md = {
        [filename]: {
          content: await fs.readFile(path.join(dir, filename), "utf-8"),
          mtime: (await fs.stat(path.join(dir, filename))).mtime,
        },
      };
    }
    return md;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error while loading Markdown from ${dir}: ${err.stack}`);
    }
    process.exit(1);
  }
}

async function loadJsonFile(filePath) {
  console.log("Loading page metadata from JSON...");

  try {
    const json = JSON.parse(await fs.readFile(filePath, "utf-8"));
    return json;
  } catch (err) {
    if (err instanceof Error) {
      console.error(
        `${__filename}: Error while loading page metadata from ${filePath}: ${err.stack}`,
      );
    }
    process.exit(1);
  }
}

async function loadMdFile(filePath) {
  console.log(`Loading Markdown file from ${filePath}...`);

  try {
    return {
      content: await fs.readFile(filePath, "utf-8"),
      mtime: (await fs.stat(filePath)).mtime,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(
        `Error while loading Markdown file from ${filePath}: ${err.stack}`,
      );
    }
    process.exit(1);
  }
}

async function writeHTML(outputDir, filename, HTMLcontent) {
  console.log("Writing HTML...");

  try {
    await fs.ensureDir(outputDir);
    const filePath = path.join(outputDir, filename);
    await fs.writeFile(filePath, HTMLcontent);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`${__filename}: Error while writing HTML: ${err.stack}`);
    }
    process.exit(1);
  }
}

/*
 * Other utilities
 */

function encodeToBase64(text) {
  return Buffer.from(text).toString("base64");
}

function getCurrentDate() {
  return `${new Date().getDate()} ${new Date().toLocaleString("default", {
    month: "long",
  })} ${new Date().getFullYear()}`;
}

function getFilenameWithoutDate(filename) {
  const withoutDate = filename.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}-(.*)$/);

  const newFilename = withoutDate ? withoutDate[1] : null;
  if (!withoutDate) {
    throw new Error(`${__filename}: Can't parse filename ${filename}`);
  } else {
    return newFilename;
  }
}

function getFilenameWithoutExtension(filename) {
  return filename.slice(0, filename.lastIndexOf("."));
}

function injectScripts(scripts) {
  return scripts.length
    ? scripts.map((value) => `<script src="${value}"></script>`).join("")
    : "";
}

function injectStylesheets(stylesheets) {
  return stylesheets.length
    ? stylesheets
        .map((value) => `<link rel="stylesheet" href="${value}">`)
        .join("")
    : "";
}

export {
  cleanPreviousBuild,
  copyAssets,
  loadJsonDir,
  loadMdDir,
  loadJsonFile,
  loadMdFile,
  writeHTML,
  encodeToBase64,
  getCurrentDate,
  getFilenameWithoutDate,
  getFilenameWithoutExtension,
  injectScripts,
  injectStylesheets,
};
