import { StringMap } from "../../types";

type ArticleMeta = { [key: string]: StringMap<string> };

export function buildArticlesList(articleMeta: ArticleMeta) {
  const rows = [];

  for (let articleFilename in articleMeta) {
    const link = `./articles/${articleFilename.replace("json", "html")}`;
    const title = articleMeta[articleFilename].title;

    const row = `
      <li>
        <time>${articleMeta[articleFilename].published || ""}</time>
        <a href="${link}"><span>${title}</span></a>
      </li>
    `;

    rows.unshift(row);
  }

  return rows.join("");
}
