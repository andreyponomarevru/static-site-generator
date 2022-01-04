import mocha from "mocha";
import { expect } from "chai";
import fs from "fs-extra";
import path from "path";

const OUTPUT_ROOT_PATH = process.env.OUTPUT_ROOT_PATH!;
/*
describe("#buildWebsite", function () {
  const buildDirPath = path.resolve(OUTPUT_ROOT_PATH);

  it(`If the website is built successfully, save all files to ${buildDirPath}`, async () => {
    expect(await fs.pathExists(`${buildDirPath}/index.html`)).to.be.true;
    expect(await fs.pathExists(`${buildDirPath}/CNAME`)).to.be.true;

    expect(await fs.pathExists(`${buildDirPath}/articles`)).to.be.true;
    expect(await fs.pathExists(`${buildDirPath}/img`)).to.be.true;
    expect(await fs.pathExists(`${buildDirPath}/js`)).to.be.true;
  });
});
*/
