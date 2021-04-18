import { expect } from "chai";

import { getRepository } from "./../../src/githubApiClient";
import { gitHubProjects } from "../../src/pages/index/gitHubProjects";

describe("gitHubApiClient", function () {
  describe("#getRepository", () => {
    it("If valid repo name provided, get projects from GitHub", async function () {
      for (let { repo } of gitHubProjects) {
        await getRepository(repo).then((res) => {
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
});
