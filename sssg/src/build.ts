import fs from "fs-extra";
import * as indexTemplate from "./templates/index";
import {
  cleanPreviousBuild,
  copyAssets,
  writeHTML,
  loadJsonFile,
} from "./utils/build-helpers";
import { Metadata } from "./types";
import {
  OUTPUT_CSS_DIR_PATH,
  OUTPUT_ROOT_PATH,
  SRC_CSS_DIR_PATH,
  SRC_FAVICON_DIR_PATH,
  SRC_IMG_DIR_PATH,
  SRC_INDEX_PATH,
  SRC_SCRIPTS_DIR_PATH,
  OUTPUT_SCRIPTS_DIR_PATH,
  OUTPUT_IMG_DIR_PATH,
} from "./config/env";

export async function build() {
  await fs.ensureDir(OUTPUT_ROOT_PATH);
  await cleanPreviousBuild(OUTPUT_ROOT_PATH);
  await copyAssets([
    { from: SRC_CSS_DIR_PATH, to: OUTPUT_CSS_DIR_PATH },
    { from: SRC_IMG_DIR_PATH, to: OUTPUT_IMG_DIR_PATH },
    { from: SRC_FAVICON_DIR_PATH, to: OUTPUT_ROOT_PATH },
    { from: SRC_SCRIPTS_DIR_PATH, to: OUTPUT_SCRIPTS_DIR_PATH },
  ]);

  const indexMeta = await loadJsonFile<Metadata>(
    `${SRC_INDEX_PATH}/index.json`,
  );
  const indexHTML = await indexTemplate.generateHTML(indexMeta);
  await writeHTML(OUTPUT_ROOT_PATH, "index.html", indexHTML);
}
