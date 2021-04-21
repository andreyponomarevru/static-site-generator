import mocha from "mocha";
import { expect } from "chai";
import { getRepository } from "./../../src/github-api-client";
import { gitHubProjects } from "../../src/pages/index/github-projects";
import { connect } from "http2";

describe("gitHubApiClient", function () {
  describe("#getRepository", function () {
    for (let { repo } of gitHubProjects) {
      it("If valid repo name provided, get projects from GitHub", async function () {
        const res = await getRepository(repo);

        expect(res.status).to.equal(200);
        expect(res.body).exist;
        expect(res.body).to.have.property("name").to.be.a("string");
        expect(res.body).to.have.property("description").to.be.a("string");
        expect(res.body).to.have.property("html_url").to.be.a("string");
        expect(res.body).to.have.property("homepage").to.be.a("string");
      });
    }
  });
});
