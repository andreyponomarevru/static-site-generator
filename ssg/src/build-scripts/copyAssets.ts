import fs from "fs-extra";

export async function copyAssets(nodes: { from: string; to: string }[]) {
  try {
    console.log(`Copying files and folders...`);
    for (const { from, to } of nodes) {
      await fs.copy(from, to);
    }
  } catch (err) {
    console.error(`Error during files and folders copying: ${err.stack}`);
    process.exit(1);
  }
}
