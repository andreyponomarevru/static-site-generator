import fs from "fs-extra";
import path from "path";
import mocha from "mocha";
import { expect } from "chai";
import {
  cleanPreviousBuild,
  loadJsonDir,
  loadMdDir,
  loadJsonFile,
  loadMdFile,
} from "./../../src/utils/build-helpers";

/*
describe("#builder", function () {
  describe("#cleanPreviousBuild", () => {
    const dirName = "jf5sa228e8w";
    const fileName = "001.html";

    before(async () => {
      if (!(await fs.pathExists(`/tmp/${dirName}`))) {
        await fs.mkdir(`/tmp/${dirName}`);
        await fs.writeFile(`/tmp/${fileName}`, "test");
      }
    });

    it("If dir path is not empty, delete all files/dirs", async function () {
      await cleanPreviousBuild(`/tmp`);
      expect(await fs.readdir(`/tmp`)).to.be.empty;
    });

    after(async () => {
      for (const file of await fs.readdir(`/tmp`)) {
        await fs.remove(path.join("/tmp", file));
      }
    });
  });

  describe("#loadJsonDir", function () {
    it("If existing JSON dir path provided, load all JSON files as objects", async () => {
      const jsonFiles = await loadJsonDir(path.resolve(SRC_ARTICLES_JSON_PATH));

      expect(jsonFiles).to.be.an("object");
      for (let fileName in jsonFiles)
        expect(jsonFiles[fileName]).to.be.an("object");
    });
  });

  describe("#loadMdDir", function () {
    it("If existing Markdown dir path provided, load all Markdown files as objects", async () => {
      const mdFiles = await loadMdDir(SRC_ARTICLES_MD_PATH);

      expect(mdFiles).to.be.an("object");
      for (let fileName in mdFiles) {
        const mdFile = mdFiles[fileName];
        expect(mdFile).to.be.an("object");
        expect(mdFile).to.have.property("content").to.be.a("string");
        expect(mdFile).to.have.property("mtime").to.be.a("date");
      }
    });
  });

  describe("#loadJsonFile", function () {
    it("If existing JSON file path provided, load JSON file as object", async () => {
      const jsonFile = await loadJsonFile(SRC_INDEX_JSON_PATH);
      expect(jsonFile).to.be.an("object");
    });
  });

  describe("#loadMdFile", function () {
    it("If existing Markdown file path provided, load Markdown file as object", async () => {
      const mdFile = await loadMdFile(SRC_INDEX_MD_PATH);
      expect(mdFile).to.be.an("object");
    });
  });
});
*/
