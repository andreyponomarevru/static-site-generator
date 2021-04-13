import fs from "fs-extra";
import path from "path";

export async function writeHTML(
  outputDir: string,
  filename: string,
  HTML: string,
) {
  console.log("Writing HTML...");

  try {
    await fs.ensureDir(outputDir);

    const filePath = path.join(outputDir, filename);
    await fs.writeFile(filePath, HTML);
  } catch (err) {
    console.error(`${__filename}: Error during HTML writing: ${err.stack}`);
    process.exit(1);
  }
}
