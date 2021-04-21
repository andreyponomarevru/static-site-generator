import { StringMap } from "../types";
import { GitHubProject } from "./index/github-projects";
import * as github from "../github-api-client";

export const googleAnalytics = `
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-33652174-2"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-33652174-2');
  </script>
`;

export const favIcons = `
  <link
    rel="apple-touch-icon"
    sizes="180x180"
    href="/apple-touch-icon.png"
  />
  <link
    rel="icon"
    type="image/png"
    sizes="32x32"
    href="/favicon-32x32.png"
  />
  <link
    rel="icon"
    type="image/png"
    sizes="16x16"
    href="/favicon-16x16.png"
  />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
  <meta name="msapplication-TileColor" content="#da532c" />
  <meta name="theme-color" content="#ffffff" />
  <link rel="icon" type="image/png" href="/favicon.png" />
`;

export function injectStylesheets(stylesheets: string[]) {
  return stylesheets.length
    ? stylesheets
        .map((value) => `<link rel="stylesheet" href="${value}">`)
        .join("")
    : "";
}

export function injectScripts(scripts: string[]) {
  return scripts.length
    ? scripts.map((value) => `<script src="${value}"></script>`).join("")
    : "";
}

export function injectMenu(menu: { name: string; link: string }[]) {
  return `
    <nav class="menu">
      <img src="https://avatars.githubusercontent.com/u/34704845?v=4" class="my-photo" />
      ${menu.map(({ name, link }) => `<a href="${link}">${name}</a>`).join("")}
    </nav>`;
}

export async function injectProjects(metadata: GitHubProject[]) {
  async function buildProjectRow({ repo, branch }: GitHubProject) {
    const {
      body: { html_url, name, description, homepage },
    } = await github.getRepository(repo);
    const descriptionHTML = description ? `— ${description || ""}` : "";
    const homepageHTML = homepage
      ? `<nav>
          <a href="${homepage}">Demo</a>
        </nav>`
      : "";
    return `
      <li class="projects__project">
        <a href="${html_url}">${name}</a> ${descriptionHTML} ${homepageHTML}
      </li>`;
  }

  return `
      <section class="projects">
        <h1>Projects</h1>
        <ul class="projects__list">
          ${(await Promise.all(metadata.map(buildProjectRow))).join("")}
        </ul>

        <p>
          To check out some of my old and less noteworthy projects, visit <a href="https://github.com/ponomarevandrey">GitHub</a>.
        </p>  
      </section>`;
}

export function injectArticles(articleMetadata: {
  [key: string]: StringMap<string>;
}) {
  const rows = [];

  for (let articleFilename in articleMetadata) {
    const link = `./articles/${articleFilename.replace("json", "html")}`;
    const row = `<li><a href="${link}">${articleMetadata[articleFilename].title}</a></li>`;
    rows.push(row);
  }

  return `
    <section class="articles">
      <h1>Articles</h1>
      <ul>${rows.join("")}</ul>
    </section>`;
}

export function injectAbout(article: string) {
  return `
    <section class="about">
      <h1>About</h1>
      <article>${article}</article>
    </section>`;
}
