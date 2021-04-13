import fs from "fs-extra";
import path from "path";

export async function cleanPreviousBuild(rootOutputPath: string) {
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
