import fs from "fs-extra";
import path from "path";

export async function loadJSON<T>(filesPath: string) {
  console.log("Loading page metadata from JSON...");

  const jsonContent: { [filename: string]: T } = {};

  try {
    for (const filename of await fs.readdir(filesPath)) {
      const filePath = path.join(filesPath, filename);
      jsonContent[filename] = JSON.parse(await fs.readFile(filePath, "utf-8"));
    }
    return jsonContent;
  } catch (err) {
    console.error(
      `${__filename}: Error during page metadata loading: ${err.stack}`,
    );
    process.exit(1);
  }
}
