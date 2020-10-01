const fs = require("fs-extra");

// Copy folders and files with assets into build folder
async function copyAssets(nodes) {
  try {
    console.log("Copying files and folders...");
    for (const { from, to } of nodes) {
      await fs.copy(from, to);
    }
  } catch (err) {
    console.error(`Error during folder copying: ${err}`);
    process.exit(1);
  }
}

module.exports.copyAssets = copyAssets;
