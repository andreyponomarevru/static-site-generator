import fs from "fs-extra";
import * as indexTemplate from "./pages/index/template";
import * as mdTemplate from "./pages/articles/template";
import {
  cleanPreviousBuild,
  copyAssets,
  compileSass,
  writeHTML,
  loadMdFile,
  loadJsonFile,
} from "./build-helpers";
import { getFilenameWithoutExtension } from "./utility/get-filename-without-extension";
import { Metadata } from "./types";

const SRC_INDEX_JSON_PATH = process.env.SRC_INDEX_JSON_PATH!;
const SRC_INDEX_MD_PATH = process.env.SRC_INDEX_MD_PATH!;
const SRC_ARTICLES_JSON_PATH = process.env.SRC_ARTICLES_JSON_PATH!;
const SRC_ARTICLES_MD_PATH = process.env.SRC_ARTICLES_MD_PATH!;
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

  const indexMeta = await loadJsonFile<Metadata>(SRC_INDEX_JSON_PATH);
  const indexMd = await loadMdFile(SRC_INDEX_MD_PATH);
  const indexHTML = await indexTemplate.generateHTML(indexMeta, indexMd);
  await writeHTML(OUTPUT_ROOT_PATH, "index.html", indexHTML);

  for (let filename of await fs.readdir(SRC_ARTICLES_JSON_PATH)) {
    const name = getFilenameWithoutExtension(filename);
    const jsonFile = `${SRC_ARTICLES_JSON_PATH}/${filename}`;
    const mdFile = `${SRC_ARTICLES_MD_PATH}/${name}.md`;

    const articleMeta = await loadJsonFile<Metadata>(jsonFile);
    const articleMd = await loadMdFile(mdFile);
    const articleHTML = mdTemplate.generateHTML(articleMeta, articleMd);
    await writeHTML(OUTPUT_MD_PATH, `${name}.html`, articleHTML);
  }
}
