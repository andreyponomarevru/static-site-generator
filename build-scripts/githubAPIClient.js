const request = require("superagent");
const { encodeToBase64 } = require("./../utility/encodeToBase64.js");

const USER_AGENT = "Mozilla/5.0";
const API_BASEURL = "https://api.github.com";
const API_TOKEN = process.env.GITHUB;
const REPO_OWNER = "ponomarevandrey";

const credentials = encodeToBase64(`${REPO_OWNER}:${API_TOKEN}`);

console.log(API_TOKEN)

function handleRequestError(err) {
  console.error(err);
}

// Doc: https://docs.github.com/en/rest/reference/repos#get-a-repository
async function getRepository(repo) {
  const endpoint = `${API_BASEURL}/repos/${REPO_OWNER}/${repo}`;

  const res = await request
    .get(endpoint)
    .set("user-agent", USER_AGENT)
    .set("authorization", `Basic ${credentials}`)
    .on("error", handleRequestError);

  return res.body;
}

async function getRepoLastCommit(repo, branch) {
  const endpoint = `${API_BASEURL}/repos/${REPO_OWNER}/${repo}/commits/${branch}`;

  const res = await request
    .get(endpoint)
    .set("user-agent", USER_AGENT)
    .set("authorization", `Basic ${credentials}`)
    .query({
      accept: "application/vnd.github.v3+json",
      owner: REPO_OWNER,
      repo,
    })
    .on("error", handleRequestError);

  const r = {
    date: res.body.commit.committer.date,
    message: res.body.commit.message,
  };

  return r;
}

async function getFileLastCommit(url) {
  const repo = url.split("/")[4];
  const filePath = url.split("blob/master")[1];
  const endpoint = `${API_BASEURL}/repos/${REPO_OWNER}/${repo}/commits?path=${filePath}&page=1&per_page=1`;

  const res = await request
    .get(endpoint)
    .set("user-agent", USER_AGENT)
    .set("authorization", `Basic ${credentials}`)
    .query({
      accept: "application/vnd.github.v3+json",
      owner: REPO_OWNER,
      repo,
    })
    .on("error", handleRequestError);

  const r = {
    date: res.body[0].commit.committer.date,
    message: res.body[0].commit.message,
  };

  return r;
}

module.exports.getRepository = getRepository;
module.exports.getFileLastCommit = getFileLastCommit;
module.exports.getRepoLastCommit = getRepoLastCommit;
