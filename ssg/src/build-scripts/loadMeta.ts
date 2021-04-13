import fs from "fs-extra";
import path from "path";
import { IndexMetadata, ArticleMetadata } from "./../types";

export async function loadMeta<T>(pagesMetaPath: string) {
  console.log("Loading page metadata from JSON...");

  const metadata: { [JSONfilename: string]: T } = {};

  try {
    for (const JSONfilename of await fs.readdir(pagesMetaPath)) {
      const filePath = path.join(pagesMetaPath, JSONfilename);
      metadata[JSONfilename] = JSON.parse(await fs.readFile(filePath, "utf-8"));
    }
    return metadata;
  } catch (err) {
    console.error(`Error during page metadata loading: ${err.stack}`);
    process.exit(1);
  }
}
