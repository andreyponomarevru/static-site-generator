import fs from "fs-extra";
import path from "path";
import * as indexTemplate from "./templates/index";
import * as articleTemplate from "./templates/article";
import {
  cleanPreviousBuild,
  copyAssets,
  compileSass,
  writeHTML,
  loadMdFile,
  loadJsonFile,
} from "./build-helpers";
import { getFilenameWithoutDate } from "./utility/get-filename-without-date";
import { getFilenameWithoutExtension } from "./utility/get-filename-without-extension";
import { parseDateInFilename } from "./utility/parse-date-in-filename";
import { Metadata } from "./types";

const SRC_INDEX_PATH = process.env.SRC_INDEX_PATH!;

const SRC_ARTICLES_PATH = process.env.SRC_ARTICLES_PATH!;

const SRC_IMG_DIR_PATH = process.env.SRC_IMG_DIR_PATH!;
const SRC_FAVICON_DIR_PATH = process.env.SRC_FAVICON_DIR_PATH!;
const SRC_SCRIPTS_DIR_PATH = process.env.SRC_SCRIPTS_DIR_PATH!;
const SRC_DNS_CONFIG_DIR_PATH = process.env.SRC_DNS_CONFIG_DIR_PATH!;
const SRC_SASS_PATH = process.env.SRC_SASS_PATH!;

const OUTPUT_ROOT_PATH = process.env.OUTPUT_ROOT_PATH!;
const OUTPUT_MD_PATH = process.env.OUTPUT_MD_PATH!;
const OUTPUT_IMG_DIR_PATH = process.env.OUTPUT_IMG_DIR_PATH!;
const OUTPUT_SCRIPTS_DIR_PATH = process.env.OUTPUT_SCRIPTS_DIR_PATH!;
const OUTPUT_CSS_PATH = process.env.OUTPUT_CSS_PATH!;

export async function build() {
  await fs.ensureDir(OUTPUT_ROOT_PATH);
  await cleanPreviousBuild(OUTPUT_ROOT_PATH);
  await copyAssets([
    { from: SRC_IMG_DIR_PATH, to: OUTPUT_IMG_DIR_PATH },
    { from: SRC_FAVICON_DIR_PATH, to: OUTPUT_ROOT_PATH },
    { from: SRC_SCRIPTS_DIR_PATH, to: OUTPUT_SCRIPTS_DIR_PATH },
    { from: SRC_DNS_CONFIG_DIR_PATH, to: OUTPUT_ROOT_PATH },
  ]);
  await compileSass({ from: SRC_SASS_PATH, to: OUTPUT_CSS_PATH });

  const indexMeta = await loadJsonFile<Metadata>(
    `${SRC_INDEX_PATH}/index.json`,
  );
  const indexHTML = await indexTemplate.generateHTML(indexMeta);
  await writeHTML(OUTPUT_ROOT_PATH, "index.html", indexHTML);

  for (let jsonFilename of await fs.readdir(SRC_ARTICLES_PATH)) {
    if (path.extname(jsonFilename) !== ".json") continue;

    const nameWithoutExt = getFilenameWithoutExtension(jsonFilename);

    const jsonFile = `${SRC_ARTICLES_PATH}/${jsonFilename}`;
    const mdPath = `${SRC_ARTICLES_PATH}/${nameWithoutExt}.md`;

    const articleMeta = await loadJsonFile<Metadata>(jsonFile);
    const articleHTML = await articleTemplate.generateHTML(articleMeta, mdPath);
    await writeHTML(OUTPUT_MD_PATH, `${nameWithoutExt}.html`, articleHTML);
  }
}
