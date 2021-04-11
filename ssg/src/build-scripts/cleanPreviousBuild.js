const fs = require("fs-extra");
const path = require("path");

async function cleanPreviousBuild(rootOutputPath) {
  console.log("Cleaning previous build...");

  try {
    for (const file of await fs.readdir(rootOutputPath)) {
      await fs.remove(path.join(rootOutputPath, file));
    }
  } catch (err) {
    console.error(`Error during cleanup: ${err.stack}`);
    process.exit(1);
  }
}

module.exports.cleanPreviousBuild = cleanPreviousBuild;
