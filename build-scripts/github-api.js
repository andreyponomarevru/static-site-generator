const request = require("superagent");
const { encodeToBase64 } = require("./../utility.js");

const USER_AGENT = "Mozilla/5.0";
const API_BASEURL = "https://api.github.com";
const API_TOKEN = process.env.GITHUB;
const REPO_OWNER = "ponomarevandrey";
const credentials = encodeToBase64(`${REPO_OWNER}:${API_TOKEN}`);

function handleRequestError(err) {
  console.error(err);
}

// Doc: https://docs.github.com/en/rest/reference/repos#get-a-repository
async function getRepository(repo) {
  const res = await request
    .get(`${API_BASEURL}/repos/${REPO_OWNER}/${repo}`)
    .set("user-agent", USER_AGENT)
    .set("authorization", `Basic ${credentials}`)
    .on("error", handleRequestError);

  return res.body;
}
// getRepository("musicbox").then(console.log).catch(console.error);

/*
// Doc: https://docs.github.com/en/free-pro-team@latest/rest/reference/git#trees
async function getFileLastModificationDate(repo, filePath) {
  const res = await request
    .get(`${API_BASEURL}/repos/${REPO_OWNER}/${repo}`)
    .set("user-agent", USER_AGENT)
    .set("authorization", `Basic ${credentials}`)
    .query({
      accept: "application/vnd.github.v3+json",
      owner: REPO_OWNER,
      repo,
      tree_sha: "cb563b3db1d938c0b611cc68b9bc47ea07105bdc",
    })
    .on("error", handleRequestError);

  return res.body;
  
  //const res = await octokit.request(
  //  `GET /repos/{owner}/{repo}/git/trees/{tree_sha}`,
  //  {
   //   owner: REPO_OWNER,
   //   repo: repo,
   //   tree_sha: "cb563b3db1d938c0b611cc68b9bc47ea07105bdc",
   //   //recursive: "",
   // }
  //);
}
*/
async function getFileLastModificationData(repo, filePath) {
  const res = await request
    .get(
      `${API_BASEURL}/repos/${REPO_OWNER}/${repo}/commits?path=${filePath}&page=1&per_page=1`
    )
    .set("user-agent", USER_AGENT)
    .set("authorization", `Basic ${credentials}`)
    .query({
      accept: "application/vnd.github.v3+json",
      owner: REPO_OWNER,
      repo,
      tree_sha: "cb563b3db1d938c0b611cc68b9bc47ea07105bdc",
    })
    .on("error", handleRequestError);

  //const commiterDate = formatISOstr(res.body[0].commit.comitter.date);

  return {
    upd: res.body[0].commit.committer.date,
    msg: res.body[0].commit.message,
  };
}

module.exports.getRepository = getRepository;
module.exports.getFileLastModificationData = getFileLastModificationData;
