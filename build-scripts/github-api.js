const { Octokit } = require("@octokit/core");

async function getGithubData() {
  // https://docs.github.com/en/rest/reference/repos#get-a-repository
  const octokit = new Octokit({ auth: process.env.GITHUB });

  const res = await octokit.request(`GET /repos/{owner}/{repo}`, {
    owner: "ponomarevandrey",
    repo: "andreyponomarev",
  });

  let isoUpdDate = res.data.updated_at;
  isoUpdDate = new Date(isoUpdDate).toDateString();
  //Mon Sep 14 2020
  const str1 = isoUpdDate.match(/\b[A-Za-z]{3,3}\b/g);
  const str2 = isoUpdDate.match(/\b\d{1,2}\b/);
  const str3 = isoUpdDate.match(/\b\d{4,4}\b/);
  const month = str1[1];
  const date = str2[0];
  const year = str3[0];
  //formattedUpdDate = `${isoUpdDate.getFullYear()} ${
  //isoUpdDate.getMonth() + 1
  // } ${isoUpdDate.getDate()}`;
  const result = { date, month, year };
  console.log(result);
  return result;
}

module.exports.getGithubData = getGithubData;
