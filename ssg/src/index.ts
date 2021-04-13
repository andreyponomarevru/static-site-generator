import fs from "fs-extra";
import { cleanPreviousBuild } from "./build-scripts/cleanPreviousBuild";
import { compileSass } from "./build-scripts/compileSass";
import { copyAssets } from "./build-scripts/copyAssets";
import { generateHTML as generateIndexHTML } from "./templates/index";
import { generateHTML as generateMarkdownHTML } from "./templates/markdown";
import { writeHTML } from "./build-scripts/writeHTML";
import { loadMarkdown } from "./build-scripts/loadMarkdown";
import { loadJSON } from "./build-scripts/loadJSON";
import util from "util";
import { IndexMetadata, ArticleMetadata } from "./types";
import { getFilenameWithoutExtension } from "./utility/getFilenameWithoutExtension";
import { Builder } from "./build-scripts/Builder";

const builder = new Builder();

// Source paths
const SRC_INDEX_META_PATH = process.env.SRC_INDEX_META_PATH!;
const SRC_MD_META_PATH = process.env.SRC_MD_META_PATH!;
const SRC_MD_PATH = process.env.SRC_MD_PATH!;
const SRC_IMG_DIR_PATH = process.env.SRC_IMG_DIR_PATH!;
const SRC_FAVICON_DIR_PATH = process.env.SRC_FAVICON_DIR_PATH!;
const SRC_SCRIPTS_DIR_PATH = process.env.SRC_SCRIPTS_DIR_PATH!;
const SRC_DNS_CONFIG_DIR_PATH = process.env.SRC_DNS_CONFIG_DIR_PATH!;
const SRC_SASS_PATH = process.env.SRC_SASS_PATH!;

// Output paths
const OUTPUT_ROOT_PATH = process.env.OUTPUT_ROOT_PATH!;
const OUTPUT_MD_PATH = process.env.OUTPUT_MD_PATH!;
const OUTPUT_IMG_DIR_PATH = process.env.OUTPUT_IMG_DIR_PATH!;
const OUTPUT_SCRIPTS_DIR_PATH = process.env.OUTPUT_SCRIPTS_DIR_PATH!;
const OUTPUT_CSS_PATH = process.env.OUTPUT_CSS_PATH!;

(async () => {
  try {
    await fs.ensureDir(OUTPUT_ROOT_PATH);
    await cleanPreviousBuild(OUTPUT_ROOT_PATH);
    await copyAssets([
      { from: SRC_IMG_DIR_PATH, to: OUTPUT_IMG_DIR_PATH },
      { from: SRC_FAVICON_DIR_PATH, to: OUTPUT_ROOT_PATH },
      { from: SRC_SCRIPTS_DIR_PATH, to: OUTPUT_SCRIPTS_DIR_PATH },
      { from: SRC_DNS_CONFIG_DIR_PATH, to: OUTPUT_ROOT_PATH },
    ]);
    await compileSass({
      from: SRC_SASS_PATH,
      to: OUTPUT_CSS_PATH,
    });

    const indexMeta = await loadJSON<IndexMetadata>(SRC_INDEX_META_PATH);
    const articlesMeta = await loadJSON<ArticleMetadata>(SRC_MD_META_PATH);

    const indexHTML = await generateIndexHTML(indexMeta, articlesMeta);
    await writeHTML(OUTPUT_ROOT_PATH, "index.html", indexHTML);

    const articlesContent = Object.entries(await loadMarkdown(SRC_MD_PATH));
    for (let [articleFilename, articleContent] of articlesContent) {
      const pageName = getFilenameWithoutExtension(articleFilename);
      const pageMetadata = articlesMeta[`${pageName}.json`];
      const pageHTML = await generateMarkdownHTML(pageMetadata, articleContent);
      await writeHTML(OUTPUT_MD_PATH, `${pageName}.html`, pageHTML);
    }
  } catch (err) {
    console.error(err);
  }
})();

process.on("unhandledRejection", (reason, p) => {
  console.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
});
