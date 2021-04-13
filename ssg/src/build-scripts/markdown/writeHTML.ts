/*import fs from "fs-extra";
import path from "path";

export async function writeHTML(
  pages: { [key: string]: string },
  pagesMeta: { [key: string]: string },
  outputDir: string,
  generateHTML: (
    pageContent: string,
    pageMeta: { [key: string]: unknown },
  ) => Promise<string>,
) {
  console.log(
    "Writing HTML from Markdown using the JSON and template provided...",
  );

  try {
    for (const [key, pageContent] of Object.entries(pages)) {

      const pageName = key.slice(0, key.lastIndexOf("."));
      const JSONfileName = `${pageName}.json`;
      const HTMLfileName = `${pageName}.html`;
      const metaData = pagesMeta.hasOwnProperty(JSONfileName)
        ? JSON.parse(pagesMeta[JSONfileName])
        : {};
      metaData.title = metaData.title || pageName;


      await fs.ensureDir(outputDir);
      const filename = path.join(outputDir, HTMLfileName);
    
      await fs.writeFile(filename, HTML);
    }
  } catch (err) {
    console.error(
      `${__filename}: Error during writing HTML from Markdown: ${err.stack}`,
    );
    process.exit(1);
  }
}
*/
