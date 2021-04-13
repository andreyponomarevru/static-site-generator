import * as request from "superagent";
import { encodeToBase64 } from "./utility/encodeToBase64";
const USER_AGENT = process.env.USER_AGENT!;
const API_BASEURL = process.env.API_BASEURL!;
const API_TOKEN = process.env.GITHUB_API_TOKEN!;
const REPO_OWNER = process.env.REPO_OWNER!;

//

type GetRepositoryResponse = {
  body: {
    name: string;
    description: string;
    html_url: string;
    homepage: string;
  };
};

type GetLastCommit = { date: string; message: string };

//

const credentials = encodeToBase64(`${REPO_OWNER}:${API_TOKEN}`);

function handleRequestError(err: Error) {
  console.error(err);
}

// Doc: https://docs.github.com/en/rest/reference/repos#get-a-repository
export async function getRepository(repo: string) {
  const endpoint = `${API_BASEURL}/repos/${REPO_OWNER}/${repo}`;

  try {
    const res: GetRepositoryResponse = await request
      .get(endpoint)
      .set("user-agent", USER_AGENT)
      .set("authorization", `Basic ${credentials}`)
      .on("error", handleRequestError);

    return res.body;
  } catch (err) {
    console.error(`${__filename}: Cat't get repository.\n${err}`);
    process.exit(1);
  }
}

export async function getRepoLastCommit(repo: string, branch: string) {
  const endpoint = `${API_BASEURL}/repos/${REPO_OWNER}/${repo}/commits/${branch}`;

  try {
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

    const r: GetLastCommit = {
      date: res.body.commit.committer.date,
      message: res.body.commit.message,
    };

    return r;
  } catch (err) {
    console.error(`${__filename}: Cat't get last repo commit.\n${err}`);
    process.exit(1);
  }
}

export async function getFileLastCommit(url: string) {
  const repo = url.split("/")[4];
  const filePath = url.split("blob/master")[1];
  const endpoint = `${API_BASEURL}/repos/${REPO_OWNER}/${repo}/commits?path=${filePath}&page=1&per_page=1`;

  try {
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

    const r: GetLastCommit = {
      date: res.body[0].commit.committer.date,
      message: res.body[0].commit.message,
    };

    return r;
  } catch (err) {
    console.error(`${__filename}: Cat't get last file commit.\n${err}`);
    process.exit(1);
  }
}
