import fs from "fs-extra";
import path from "path";
import { render as renderSass } from "./utility/sassPromiseWrapper";

export class Builder {
  static async cleanPreviousBuild(rootOutputPath: string) {
    console.log("Cleaning previous build...");

    try {
      for (const file of await fs.readdir(rootOutputPath)) {
        await fs.remove(path.join(rootOutputPath, file));
      }
    } catch (err) {
      console.error(`Error during cleanup: ${err.stack}`);
      process.exit(1);
    }
  }

  static async compileSass({ from, to }: { from: string; to: string }) {
    try {
      console.log("Compiling Sass to CSS...");
      const { css } = await renderSass({ file: from });
      await fs.ensureDir(path.dirname(to));
      await fs.writeFile(to, css);
    } catch (err) {
      console.error(err.stack);
      process.exit(1);
    }
  }

  static async copyAssets(nodes: { from: string; to: string }[]) {
    try {
      console.log(`Copying files and folders...`);
      for (const { from, to } of nodes) {
        await fs.copy(from, to);
      }
    } catch (err) {
      console.error(`Error during files and folders copying: ${err.stack}`);
      process.exit(1);
    }
  }

  static async loadJSON<T>(filesPath: string) {
    console.log("Loading page metadata from JSON...");

    const jsonContent: { [filename: string]: T } = {};

    try {
      for (const filename of await fs.readdir(filesPath)) {
        const filePath = path.join(filesPath, filename);
        jsonContent[filename] = JSON.parse(
          await fs.readFile(filePath, "utf-8"),
        );
      }
      return jsonContent;
    } catch (err) {
      console.error(
        `${__filename}: Error during page metadata loading: ${err.stack}`,
      );
      process.exit(1);
    }
  }

  static async loadMD(dir: string) {
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

  static async writeHTML(outputDir: string, filename: string, HTML: string) {
    console.log("Writing HTML...");

    try {
      await fs.ensureDir(outputDir);

      const filePath = path.join(outputDir, filename);
      await fs.writeFile(filePath, HTML);
    } catch (err) {
      console.error(`${__filename}: Error during HTML writing: ${err.stack}`);
      process.exit(1);
    }
  }
}
