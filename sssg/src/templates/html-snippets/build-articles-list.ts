import { StringMap } from "../../types";

type ArticleMeta = { [key: string]: StringMap<string> };

export function buildArticlesList(articleMeta: ArticleMeta) {
  const rows = [];

  for (let articleFilename in articleMeta) {
    const link = `./articles/${articleFilename.replace("json", "html")}`;
    const title = articleMeta[articleFilename].title;

    const row = `<li><a href="${link}">${title}</a></li>`;

    rows.push(row);
  }

  return rows.join("");
}
