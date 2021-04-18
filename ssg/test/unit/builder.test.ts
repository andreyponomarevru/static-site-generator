import mocha from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import fs from "fs-extra";
import path from "path";

import * as builder from "../../src/builder";
import { StringMap, MdArticle, Metadata } from "../../src/types";
import { doesNotMatch } from "assert";

describe("#builder", function () {
  describe("#cleanPreviousBuild", () => {
    const dirPath = "./jf5sa228e8w";

    before(async () => {
      //if (!(await fs.pathExists(dirPath))) await fs.mkdir(dirPath);
      //const files = await fs.readdir(dirPath);
      //if (!files.length) {
      //}
      await fs.mkdir(dirPath);
      await fs.writeFile(`${dirPath}/001.html`, "");
      await fs.mkdir(`${dirPath}/css`);
    });

    it("If dir path is not empty, delete all files/dirs", async function () {
      await builder.cleanPreviousBuild(dirPath);
      const files = await fs.readdir(dirPath);
      if (files.length) return true;
      else return false;
    });

    after(async () => {
      /*
      for (const file of await fs.readdir(dirPath)) {
        await fs.remove(path.join(dirPath, file));
      }*/
      await fs.rmdir(dirPath);
    });

    it("If dir path doesn't exist, exit process with error code 1", async function () {});
  });

  describe("#loadJsonDir", async () => {});

  describe("#loadMdDir", async () => {});

  describe("#loadJsonFile", async () => {});

  describe("#loadMdFile", async () => {});
});
