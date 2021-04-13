import fs from "fs-extra";
import { cleanPreviousBuild } from "./build-scripts/cleanPreviousBuild";
import { compileSass } from "./build-scripts/compileSass";
import { copyAssets } from "./build-scripts/copyAssets";
import { generateHTML as generateIndexHTML } from "./templates/index";
import { generateHTML as generateMarkdownHTML } from "./templates/markdown";
import { writeHTML } from "./build-scripts/writeHTML";
import { loadMarkdown } from "./build-scripts/loadMarkdown";
import { loadMeta } from "./build-scripts/loadMeta";
import util from "util";
import { IndexMetadata, ArticleMetadata } from "./types";
import { getFilenameWithoutExtension } from "./utility/getFilenameWithoutExtension";

const ROOT_OUTPUT_PATH = process.env.ROOT_OUTPUT_PATH!;

const INDEX_META_PATH = process.env.INDEX_META_PATH!;
const MD_META_PATH = process.env.MD_META_PATH!;
const MD_INPUT_PATH = process.env.MD_INPUT_PATH!;
const MD_OUTPUT_PATH = `${ROOT_OUTPUT_PATH}/articles`;
const IMG_DIR_PATH = process.env.IMG_DIR_PATH!;
const FAVICON_DIR_PATH = process.env.FAVICON_DIR_PATH!;
const SCRIPTS_DIR_PATH = process.env.SCRIPTS_DIR_PATH!;
const DNS_CONFIG_DIR_PATH = process.env.DNS_CONFIG_DIR_PATH!;
const SASS_PATH = process.env.SASS_PATH!;

(async () => {
  try {
    await fs.ensureDir(ROOT_OUTPUT_PATH);
    await cleanPreviousBuild(ROOT_OUTPUT_PATH);
    await copyAssets([
      { from: IMG_DIR_PATH, to: `${ROOT_OUTPUT_PATH}/img` },
      { from: FAVICON_DIR_PATH, to: `${ROOT_OUTPUT_PATH}/` },
      { from: SCRIPTS_DIR_PATH, to: `${ROOT_OUTPUT_PATH}/js` },
      { from: DNS_CONFIG_DIR_PATH, to: `${ROOT_OUTPUT_PATH}/` },
    ]);
    await compileSass({
      from: SASS_PATH,
      to: `${ROOT_OUTPUT_PATH}/main.css`,
    });

    // NOTE: If you will write to disk first, pages other than index.html (i.e. writeMarkdownHTML before writeHTML), live-server won't be able to correctly perform hot reloading. It will render root dir files instead of index.html cause live-server gets triggered on ANY file change, and usually, it happens before `index.html` had been written to the disk. So, the live-server performs hot reloading but could not find index.html. Hence it just displays all files in root dir (`/build` in our case),
    const indexMeta = await loadMeta<IndexMetadata>(INDEX_META_PATH);
    const projectsMeta = indexMeta["index.json"].projects;
    const articlesMeta = await loadMeta<ArticleMetadata>(MD_META_PATH);
    const pageHTML = await generateIndexHTML(projectsMeta, articlesMeta);
    await writeHTML(ROOT_OUTPUT_PATH, "index.html", pageHTML);

    const pages = await loadMarkdown(MD_INPUT_PATH);
    for (let [mdFilename, pageContent] of Object.entries(pages)) {
      const pageName = getFilenameWithoutExtension(mdFilename);
      const JSONfileName = `${pageName}.json`;
      const HTMLfileName = `${pageName}.html`;

      const pageMetadata = articlesMeta[JSONfileName];
      const pageHTML = await generateMarkdownHTML(pageContent, pageMetadata);
      await writeHTML(MD_OUTPUT_PATH, HTMLfileName, pageHTML);
    }
  } catch (err) {
    console.error(err);
  }
})();

process.on("unhandledRejection", (reason, p) => {
  console.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
});
