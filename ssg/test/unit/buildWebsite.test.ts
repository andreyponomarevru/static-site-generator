import mocha from "mocha";
import { expect } from "chai";
import sinon from "sinon";

import { buildWebsite } from "./../../src/buildWebsite";

const PORT = process.env.PORT;

const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const API_BASEURL = process.env.API_BASEURL;
const USER_AGENT = process.env.USER_AGENT;

const SRC_INDEX_JSON_PATH = process.env.SRC_INDEX_JSON_PATH;
const SRC_INDEX_MD_PATH = process.env.SRC_INDEX_MD_PATH;
const SRC_ARTICLES_JSON_PATH = process.env.SRC_ARTICLES_JSON_PATH;
const SRC_ARTICLES_MD_PATH = process.env.SRC_ARTICLES_MD_PATH;
const SRC_IMG_DIR_PATH = process.env.SRC_IMG_DIR_PATH;
const SRC_FAVICON_DIR_PATH = process.env.SRC_FAVICON_DIR_PATH;
const SRC_SCRIPTS_DIR_PATH = process.env.SRC_SCRIPTS_DIR_PATH;
const SRC_DNS_CONFIG_DIR_PATH = process.env.SRC_DNS_CONFIG_DIR_PATH;
const SRC_SASS_PATH = process.env.SRC_SASS_PATH;

const OUTPUT_ROOT_PATH = process.env.OUTPUT_ROOT_PATH;
const OUTPUT_MD_PATH = process.env.OUTPUT_MD_PATH;
const OUTPUT_IMG_DIR_PATH = process.env.OUTPUT_IMG_DIR_PATH;
const OUTPUT_SCRIPTS_DIR_PATH = process.env.OUTPUT_SCRIPTS_DIR_PATH;
const OUTPUT_CSS_PATH = process.env.OUTPUT_CSS_PATH;

describe("#buildWebsite", function () {
  before(async () => {
    await buildWebsite();
  });

  it("If the website is built successfully, save all files to 'build' dir.", async () => {
    "check all paths for existing files";
  });
});
