const fs = require("fs-extra");

async function copyAssets(nodes = []) {
  try {
    console.log(`Copying files and folders...`);
    for (const { from, to } of nodes) await fs.copy(from, to);
  } catch (err) {
    console.error(`Error during files and folders copying: ${err.stack}`);
    process.exit(1);
  }
}

module.exports.copyAssets = copyAssets;
