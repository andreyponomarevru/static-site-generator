import fs from "fs-extra";
import util from "util";
import * as indexTemplate from "./templates/index";
import * as mdTemplate from "./templates/markdown";
import { IndexMeta, ArticleMeta } from "./types";
import { getFilenameWithoutExtension } from "./utility/getFilenameWithoutExtension";
import { Builder } from "./Builder";

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
    await Builder.cleanPreviousBuild(OUTPUT_ROOT_PATH);
    await Builder.copyAssets([
      { from: SRC_IMG_DIR_PATH, to: OUTPUT_IMG_DIR_PATH },
      { from: SRC_FAVICON_DIR_PATH, to: OUTPUT_ROOT_PATH },
      { from: SRC_SCRIPTS_DIR_PATH, to: OUTPUT_SCRIPTS_DIR_PATH },
      { from: SRC_DNS_CONFIG_DIR_PATH, to: OUTPUT_ROOT_PATH },
    ]);
    await Builder.compileSass({ from: SRC_SASS_PATH, to: OUTPUT_CSS_PATH });

    const indexMeta = await Builder.loadJSON<IndexMeta>(SRC_INDEX_META_PATH);
    const articlesMeta = await Builder.loadJSON<ArticleMeta>(SRC_MD_META_PATH);

    const HTML = await indexTemplate.generateHTML(indexMeta, articlesMeta);
    await Builder.writeHTML(OUTPUT_ROOT_PATH, "index.html", HTML);

    const articlesContent = Object.entries(await Builder.loadMD(SRC_MD_PATH));
    for (let [articleFilename, articleContent] of articlesContent) {
      const mdFilename = getFilenameWithoutExtension(articleFilename);
      const pageMetadata = articlesMeta[`${mdFilename}.json`];
      const pageHTML = await mdTemplate.generateHTML(
        pageMetadata,
        articleContent,
      );
      await Builder.writeHTML(OUTPUT_MD_PATH, `${mdFilename}.html`, pageHTML);
    }
  } catch (err) {
    console.error(err);
  }
})();

process.on("unhandledRejection", (reason, p) => {
  console.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
});
