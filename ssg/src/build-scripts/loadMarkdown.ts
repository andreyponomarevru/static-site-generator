import fs from "fs-extra";
import path from "path";

export async function loadMarkdown(dir: string) {
  console.log(`Loading Markdown from /${dir}...`);

  const pages: { [key: string]: string } = {};

  try {
    for (const page of await fs.readdir(dir)) {
      const filename = path.join(dir, page);
      pages[page] = await fs.readFile(filename, "utf-8");
    }
    return pages;
  } catch (err) {
    console.error(
      `Error during reading Markdown loading from ${dir}: ${err.stack}`,
    );
    process.exit(1);
  }
}
